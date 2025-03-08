'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/supabase';
import { ArrowRight, Check, Sparkles, Mic, Square, Volume2 } from 'lucide-react';
import {
  initializeRetellClient,
  startRetellCall,
  stopRetellCall,
  SETUP_AGENT_ID,
} from '@/lib/retell';

type Step = {
  question: string;
  description: string;
  placeholder: string;
  key: keyof UserProfile;
};

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    goals: '',
    challenges: '',
    interests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retell voice interaction states
  const [isCalling, setIsCalling] = useState(false);
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [transcript, setTranscript] = useState('');

  const steps: Step[] = useMemo(
    () => [
      {
        question: "What's your name?",
        description: "We'll use this to personalize your journal experience.",
        placeholder: 'Your name',
        key: 'name',
      },
      {
        question: 'What are you trying to optimize for?',
        description:
          'For example: training for a marathon, starting a family, changing careers, etc.',
        placeholder: "I'm working towards...",
        key: 'goals',
      },
      {
        question: 'What challenges are you facing?',
        description: 'What obstacles or difficulties are you currently dealing with?',
        placeholder: "I'm currently struggling with...",
        key: 'challenges',
      },
      {
        question: 'What are your interests?',
        description: 'What topics, activities, or areas are you interested in?',
        placeholder: "I'm interested in...",
        key: 'interests',
      },
    ],
    []
  );

  // Initialize Retell client

  const currentQuestion = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [currentQuestion.key]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentQuestion && profile[currentQuestion.key]?.trim() === '') {
      setError('Please provide an answer before continuing.');
      return;
    }

    setError('');

    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartVoiceConversation = async () => {
    try {
      // Start a call with the current question and step
      await startRetellCall(SETUP_AGENT_ID, {
        currentStep,
        totalSteps: steps.length,
        question: currentQuestion.question,
        description: currentQuestion.description,
        currentProfile: profile,
      });
    } catch (err) {
      console.error('Failed to start voice conversation:', err);
      setError('Failed to start voice conversation. Please try again or use text input.');
    }
  };

  const handleStopVoiceConversation = () => {
    stopRetellCall();
  };

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      // Store the profile in Supabase
      const { error: saveError } = await supabase.from('user_profiles').insert([
        {
          ...profile,
          created_at: new Date().toISOString(),
        },
      ]);

      if (saveError) throw saveError;

      // Redirect to home page after successful setup
      router.push('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [profile, router]);

  useEffect(() => {
    initializeRetellClient(
      // Call started
      () => setIsCalling(true),
      // Call ended
      () => {
        setIsCalling(false);

        // Use transcript to fill in current step if available
        if (transcript.trim()) {
          setProfile({
            ...profile,
            [steps[currentStep].key]: transcript,
          });

          // Move to next step after transcript is processed
          if (currentStep < steps.length - 1) {
            setTimeout(() => {
              setCurrentStep(currentStep + 1);
              setTranscript('');
            }, 1000);
          } else {
            handleSubmit();
          }
        }
      },
      // Agent start talking
      () => setIsAgentTalking(true),
      // Agent stop talking
      () => setIsAgentTalking(false),
      // Updates (transcript)
      (update) => {
        if (update.transcript) {
          setTranscript(update.transcript);
        }
      }
    );

    // Cleanup
    return () => {
      if (isCalling) {
        stopRetellCall();
      }
    };
  }, [currentStep, handleSubmit, isCalling, profile, steps, transcript]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header with progress indicator */}
      <header className='p-4 border-b'>
        <div className='w-full max-w-md mx-auto'>
          <div className='flex justify-between items-center'>
            <h1 className='text-xl font-semibold'>Setup Your Journal</h1>
            <div className='text-sm text-gray-500'>
              {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className='mt-3 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-blue-500 transition-all duration-300'
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className='flex-1 flex flex-col items-center justify-center p-6'>
        <div className='w-full max-w-md mx-auto space-y-6'>
          {/* Question */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-blue-500' />
              <h2 className='text-xl font-semibold'>{currentQuestion.question}</h2>
            </div>
            <p className='text-gray-600 dark:text-gray-300'>{currentQuestion.description}</p>
          </div>

          {/* Voice interaction button */}
          <div className='flex justify-center mb-4'>
            {!isCalling ? (
              <button
                onClick={handleStartVoiceConversation}
                className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                <Mic size={18} />
                Answer with voice
              </button>
            ) : (
              <button
                onClick={handleStopVoiceConversation}
                className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
              >
                <Square size={18} />
                Stop recording
              </button>
            )}
          </div>

          {/* Voice status */}
          {isCalling && (
            <div className='text-center p-2 mb-4'>
              <div className='flex items-center justify-center mb-2'>
                {isAgentTalking ? (
                  <>
                    <Volume2 size={18} className='text-green-500 mr-2 animate-pulse' />
                    <span className='text-green-500'>AI is speaking...</span>
                  </>
                ) : (
                  <>
                    <Mic size={18} className='text-blue-500 mr-2 animate-pulse' />
                    <span className='text-blue-500'>Listening to you...</span>
                  </>
                )}
              </div>
              {transcript && (
                <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm'>
                  {transcript}
                </div>
              )}
            </div>
          )}

          {/* Text answer input */}
          <div className='space-y-4'>
            <textarea
              className='w-full p-4 min-h-[120px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
              placeholder={currentQuestion.placeholder}
              value={profile[currentQuestion.key] || ''}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isCalling}
            />

            {error && <div className='text-red-500 text-sm'>{error}</div>}

            <button
              className='w-full flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:pointer-events-none'
              onClick={handleNext}
              disabled={loading || isCalling}
            >
              {loading ? (
                <span>Saving...</span>
              ) : isLastStep ? (
                <>
                  <span>Complete Setup</span>
                  <Check className='h-4 w-4' />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className='h-4 w-4' />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
