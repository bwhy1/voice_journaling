'use client';

import { JournalEntry } from '@/lib/supabase';
import { Calendar, Clock } from 'lucide-react';

interface JournalEntryDisplayProps {
  entry: JournalEntry | null;
  date: string;
  isLoading: boolean;
}

export default function JournalEntryDisplay({ entry, date, isLoading }: JournalEntryDisplayProps) {
  if (isLoading) {
    return (
      <div className='p-6 border rounded-lg shadow-sm w-full max-w-3xl animate-pulse'>
        <div className='h-6 bg-gray-200 rounded w-1/2 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-1/4 mb-3'></div>
        <div className='space-y-2'>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className='p-6 border rounded-lg shadow-sm w-full max-w-3xl'>
        <h2 className='text-xl font-semibold mb-4'>Journal Entry for {date}</h2>
        <p className='text-gray-500'>
          No journal entry found for this date. Record one to get started!
        </p>
      </div>
    );
  }

  const createdDate = new Date(entry.created_at);
  const formattedCreatedDate = createdDate.toLocaleDateString();
  const formattedCreatedTime = createdDate.toLocaleTimeString();

  return (
    <div className='p-6 border rounded-lg shadow-sm w-full max-w-3xl'>
      <h2 className='text-xl font-semibold mb-2'>Journal Entry for {date}</h2>

      <div className='flex items-center gap-4 mb-4 text-sm text-gray-500'>
        <div className='flex items-center'>
          <Calendar size={16} className='mr-1' />
          <span>{formattedCreatedDate}</span>
        </div>
        <div className='flex items-center'>
          <Clock size={16} className='mr-1' />
          <span>{formattedCreatedTime}</span>
        </div>
      </div>

      <div className='prose dark:prose-invert max-w-none'>
        <p>{entry.content}</p>
      </div>

      {entry.audio_url && (
        <div className='mt-4'>
          <h3 className='text-md font-medium mb-2'>Original Recording:</h3>
          <audio src={entry.audio_url} controls className='w-full' />
        </div>
      )}
    </div>
  );
}
