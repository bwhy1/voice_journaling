'use client';

import { JournalEntry } from '@/lib/supabase';
import { Calendar, Clock, Mic } from 'lucide-react';

interface JournalEntryDisplayProps {
  entry: JournalEntry | null | undefined;
  date: string;
  isLoading: boolean;
  onStartRecording?: () => void;
  isToday?: boolean;
}

export default function JournalEntryDisplay({
  entry,
  date,
  isLoading,
  onStartRecording,
  isToday = false,
}: JournalEntryDisplayProps) {
  if (isLoading) {
    return (
      <div className='w-full animate-pulse'>
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4'></div>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6'></div>
        <div className='space-y-3 max-w-md mx-auto'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center p-4'>
        <div className='bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4'>
          <Calendar size={32} className='text-gray-400' />
        </div>
        <h2 className='text-xl font-semibold mb-2'>No Journal Entry Yet</h2>
        <p className='text-gray-500 max-w-xs mb-8'>
          {isToday
            ? "You haven't created a journal entry for today yet."
            : `You haven't created a journal entry for ${date}.`}
        </p>

        {onStartRecording && (
          <button
            onClick={onStartRecording}
            className='flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'
          >
            <Mic size={18} />
            {isToday ? "Start Recording Today's Journal" : 'Create Journal Entry'}
          </button>
        )}
      </div>
    );
  }

  const createdDate = new Date(entry.created_at);
  const formattedCreatedDate = createdDate.toLocaleDateString();
  const formattedCreatedTime = createdDate.toLocaleTimeString();

  return (
    <div className='max-w-md mx-auto'>
      <div className='flex items-center justify-center gap-4 mb-6 text-sm text-gray-500'>
        <div className='flex items-center'>
          <Calendar size={14} className='mr-1' />
          <span>{formattedCreatedDate}</span>
        </div>
        <div className='flex items-center'>
          <Clock size={14} className='mr-1' />
          <span>{formattedCreatedTime}</span>
        </div>
      </div>

      <div className='prose dark:prose-invert max-w-none'>
        <p className='leading-relaxed text-lg'>{entry.content}</p>
      </div>

      {entry.audio_url && (
        <div className='mt-8'>
          <h3 className='text-md font-medium mb-2 text-center'>Your Recording</h3>
          <audio src={entry.audio_url} controls className='w-full' />
        </div>
      )}

      {isToday && onStartRecording && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={onStartRecording}
            className='flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm'
          >
            <Mic size={16} />
            Create New Recording
          </button>
        </div>
      )}
    </div>
  );
}
