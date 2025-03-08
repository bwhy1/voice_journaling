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
    <div className='p-6 border rounded-lg shadow-sm w-full max-w-3xl'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-xl font-semibold'>Voice Journal for {date}</h2>

        <div className='flex gap-3'>
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
              disabled={isSaving}
            >
              <Mic size={18} />
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
            >
              <Square size={18} />
              Stop Recording
            </button>
          )}

          <button
            onClick={handleSaveEntry}
            className='flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
            disabled={isRecording || !transcript || isSaving}
          >
            <Save size={18} />
            Save Entry
          </button>
        </div>

        <div className='mt-2'>
          <div className='text-sm text-gray-500'>
            Status: {isRecording ? 'Recording...' : status}
          </div>
          {mediaBlobUrl && (
            <div className='mt-3'>
              <p className='mb-2 text-sm font-medium'>Listen to your recording:</p>
              <audio src={mediaBlobUrl} controls className='w-full' />
            </div>
          )}
        </div>

        {transcript && (
          <div className='mt-4'>
            <h3 className='text-md font-semibold mb-2'>Transcript:</h3>
            <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-md min-h-[100px]'>
              {transcript}
            </div>
          </div>
        )}

        {savedStatus && (
          <div
            className={`mt-3 p-2 rounded-md text-sm ${
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
