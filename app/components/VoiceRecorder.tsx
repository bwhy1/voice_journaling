'use client';

import { useState, useEffect } from 'react';
import { Mic, Square, Save, Lightbulb, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  initializeRetellClient,
  startRetellCall,
  stopRetellCall,
  JOURNAL_AGENT_ID,
} from '@/lib/retell';

interface VoiceRecorderProps {
  date: string;
  today: string; // Added today's date in YYYY-MM-DD format
  onConversationComplete?: () => void;
}

// Add interface for transcript message format
interface TranscriptMessage {
  role?: string;
  content?: string;
}

export default function VoiceRecorder({ date, today, onConversationComplete }: VoiceRecorderProps) {
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>('');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isAgentTalking, setIsAgentTalking] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string>('');
  const [journalPrompt, setJournalPrompt] = useState<string>('');

  // Fetch user profile with React Query
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          //   console.error('Error fetching user profile:', error);
          return null;
        }

        return data as UserProfile | null;
      } catch (error) {
        console.log('Error fetching user profile:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always fetch on mount
  });

  // Generate journal prompt when user profile loads
  useEffect(() => {
    if (userProfile) {
      generateJournalPrompt(userProfile);
    } else {
      // Set a default prompt if no user profile exists
      setJournalPrompt("How are you feeling today? What's on your mind?");
    }
  }, [userProfile]);

  // Initialize Retell client
  useEffect(() => {
    initializeRetellClient(
      // Call started
      () => setIsCalling(true),
      // Call ended
      () => {
        setIsCalling(false);
        if (onConversationComplete) {
          onConversationComplete();
        }
      },
      // Agent start talking
      () => setIsAgentTalking(true),
      // Agent stop talking
      () => setIsAgentTalking(false),
      // Updates (including transcript)
      (update) => {
        if (update.transcript) {
          // Handle transcript updates, which might be objects or strings
          if (typeof update.transcript === 'string') {
            setTranscript(update.transcript);
          } else if (Array.isArray(update.transcript)) {
            // Format array of transcript messages with proper type casting
            const formattedTranscript = (update.transcript as Array<TranscriptMessage | string>)
              .map((msg) => {
                if (typeof msg === 'string') return msg;
                const role = msg.role ? `${msg.role}: ` : '';
                const content = msg.content || '';
                return `${role}${content}`;
              })
              .join('\n\n');
            setTranscript(formattedTranscript);
          } else if (typeof update.transcript === 'object' && update.transcript !== null) {
            // Handle single transcript message object
            const msg = update.transcript as TranscriptMessage;
            const role = msg.role ? `${msg.role}: ` : '';
            const content = msg.content || '';
            setTranscript(`${role}${content}`);
          }
        }
      },
      // Error handling
      (error) => {
        console.log('Retell error:', error);
        setIsCalling(false);
      }
    );

    // Cleanup on unmount
    return () => {
      if (isCalling) {
        stopRetellCall();
      }
    };
  }, [onConversationComplete]);

  // Function to generate a prompt based on user profile
  const generateJournalPrompt = (profile: UserProfile) => {
    try {
      // This is a simple template-based prompt, but could be enhanced with an actual AI call
      const promptTemplates = [
        `How are you progressing with your goal to ${profile.goals.toLowerCase()}?`,
        `What challenges related to ${profile.challenges.toLowerCase()} did you face today?`,
        `Did you make any breakthroughs with ${profile.goals.toLowerCase()} today?`,
        `How are you feeling about ${profile.challenges.toLowerCase()} today?`,
        `Did you learn anything new about ${profile.interests.toLowerCase()} today?`,
        `What steps did you take today towards ${profile.goals.toLowerCase()}?`,
        `How did ${profile.challenges.toLowerCase()} affect your day?`,
      ];

      // Select a random prompt from the templates
      const randomPrompt = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
      setJournalPrompt(randomPrompt);
    } catch (error) {
      console.log('Error generating prompt:', error);
      // Fallback to default prompt
      setJournalPrompt("How are you feeling today? What's on your mind?");
    }
  };

  // Start conversation with Retell AI
  const handleStartConversation = async () => {
    setTranscript('');
    setSavedStatus('');

    // Prepare metadata with either user profile or default context
    const metadata = {
      date,
      prompt: journalPrompt,
      userProfile: userProfile || undefined,
    };

    // Start the Retell call
    const started = await startRetellCall(JOURNAL_AGENT_ID, metadata);

    if (!started) {
      setSavedStatus('Failed to start voice conversation. Please try again.');
    }
  };

  // Stop conversation with Retell AI
  const handleStopConversation = () => {
    stopRetellCall();
    if (onConversationComplete) {
      onConversationComplete();
    }
  };

  // Modified to save directly to Supabase and better align with JournalEntry type
  const handleSaveEntry = async () => {
    if (!transcript.trim()) return;

    try {
      setIsSaving(true);

      // Get user ID if available
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      // Create the entry object in line with JournalEntry type
      const newEntry = {
        entry_date: today,
        content: transcript.trim(),
        transcript: transcript.trim(), // Store the same content in transcript field
        created_at: new Date().toISOString(),
        user_id: userId || undefined,
      };
      console.log('🚀 ~ handleSaveEntry ~ newEntry:', newEntry);

      // Save to Supabase
      const { error } = await supabase.from('journal_entries').insert([newEntry]);

      if (error) {
        throw error;
      }

      setSavedStatus('Journal entry saved successfully!');

      // Redirect to the day view
      setTimeout(() => {
        router.push(`/day?date=${today}`);
      }, 1500);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSavedStatus('Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex flex-col w-full h-full'>
      {/* Date header */}
      <h2 className='text-xl font-semibold text-center mb-4'>Voice Journal for {date}</h2>

      {/* Journal prompt */}
      {journalPrompt && !isCalling && (
        <div className='mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800'>
          <div className='flex items-center gap-2 mb-2'>
            <Lightbulb className='h-5 w-5 text-amber-500' />
            <h3 className='font-medium'>Today&apos;s Prompt</h3>
          </div>
          <p className='text-amber-800 dark:text-amber-200'>{journalPrompt}</p>
        </div>
      )}

      {/* Main conversational interface */}
      <div className='flex flex-col items-center justify-center flex-grow'>
        {/* Recording status */}
        <div className='text-sm text-gray-500 mb-4 text-center'>
          {isCalling ? (
            <div className='flex items-center justify-center'>
              <Activity
                className={`h-5 w-5 mr-2 ${
                  isAgentTalking ? 'text-green-500 animate-pulse' : 'text-blue-500'
                }`}
              />
              <span className={isAgentTalking ? 'text-green-500' : 'text-blue-500'}>
                {isAgentTalking ? 'AI is speaking...' : 'Listening to you...'}
              </span>
            </div>
          ) : (
            <div>Ready to start conversation</div>
          )}
        </div>

        {/* Main conversation button */}
        <div className='mb-8'>
          {!isCalling ? (
            <button
              onClick={handleStartConversation}
              className='flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300'
              disabled={isSaving}
              aria-label='Start conversation'
            >
              <Mic size={32} />
            </button>
          ) : (
            <button
              onClick={handleStopConversation}
              className='flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500'
              aria-label='End conversation'
            >
              <Square size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Transcript results */}
      <div className='mt-6 px-4'>
        {transcript && (
          <div className='mb-6'>
            <h3 className='text-md font-semibold mb-2 text-center'>Conversation Transcript:</h3>
            <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[100px] max-w-lg mx-auto'>
              {transcript}
            </div>
          </div>
        )}

        {transcript && !isCalling && (
          <div className='flex justify-center mt-6 mb-8'>
            <button
              onClick={handleSaveEntry}
              className='flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300'
              disabled={isCalling || !transcript || isSaving}
            >
              <Save size={18} />
              Save Journal Entry
            </button>
          </div>
        )}

        {savedStatus && (
          <div
            className={`mt-3 p-2 rounded-md text-sm max-w-md mx-auto text-center ${
              savedStatus.includes('success')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {savedStatus}
          </div>
        )}
      </div>
    </div>
  );
}
