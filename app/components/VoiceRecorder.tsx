'use client';

import { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, Square, Save } from 'lucide-react';

interface VoiceRecorderProps {
  date: string;
  onSave: (content: string) => void;
}

export default function VoiceRecorder({ date, onSave }: VoiceRecorderProps) {
  const [transcript, setTranscript] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string>('');

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl) => {
      console.log('Recording stopped, blob URL:', blobUrl);
    },
  });

  const isRecording = status === 'recording';

  const handleStartRecording = () => {
    setTranscript('');
    setSavedStatus('');
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveEntry = async () => {
    if (!transcript.trim()) {
      setSavedStatus('Please record some content first');
      return;
    }

    setIsSaving(true);

    try {
      // Save the transcript to Supabase
      const content = transcript.trim();
      onSave(content);
      setSavedStatus('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setSavedStatus('Failed to save journal entry');
    } finally {
      setIsSaving(false);
    }
  };

  // This is a placeholder for actual transcription service
  // In a real app, you would integrate with a service like Whisper API
  useEffect(() => {
    if (mediaBlobUrl && status === 'stopped') {
      // Simulating transcription for demo purposes
      setTimeout(() => {
        setTranscript(
          'This is a simulated transcription of your voice journal. In a production app, this would be generated from your actual voice recording using a service like OpenAI Whisper API.'
        );
      }, 1000);
    }
  }, [mediaBlobUrl, status]);

  return (
    <div className='flex flex-col w-full h-full'>
      {/* Date header */}
      <h2 className='text-xl font-semibold text-center mb-4'>Voice Journal for {date}</h2>

      {/* Main recording interface */}
      <div className='flex flex-col items-center justify-center flex-grow'>
        {/* Recording status */}
        <div className='text-sm text-gray-500 mb-4 text-center'>
          {isRecording ? (
            <div className='text-red-500 font-medium animate-pulse'>Recording...</div>
          ) : (
            <div>{status === 'stopped' ? 'Recording complete' : 'Ready to record'}</div>
          )}
        </div>

        {/* Main recording button */}
        <div className='mb-8'>
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className='flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300'
              disabled={isSaving}
              aria-label='Start recording'
            >
              <Mic size={32} />
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className='flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 hover:bg-gray-900 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500'
              aria-label='Stop recording'
            >
              <Square size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Recording results */}
      <div className='mt-6 px-4'>
        {mediaBlobUrl && (
          <div className='mb-6'>
            <p className='mb-2 text-sm font-medium text-center'>Listen to your recording:</p>
            <audio src={mediaBlobUrl} controls className='w-full max-w-md mx-auto' />
          </div>
        )}

        {transcript && (
          <div className='mb-6'>
            <h3 className='text-md font-semibold mb-2 text-center'>What I heard:</h3>
            <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[100px] max-w-lg mx-auto'>
              {transcript}
            </div>
          </div>
        )}

        {transcript && (
          <div className='flex justify-center mt-6 mb-8'>
            <button
              onClick={handleSaveEntry}
              className='flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300'
              disabled={isRecording || !transcript || isSaving}
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
