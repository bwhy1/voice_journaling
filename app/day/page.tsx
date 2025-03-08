'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format, parse, isValid } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/lib/supabase';
import VoiceRecorder from '../components/VoiceRecorder';
import JournalEntryDisplay from '../components/JournalEntryDisplay';
import { ChevronLeft, Plus } from 'lucide-react';

export default function DayPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate) ? format(parsedDate, 'MMMM d, yyyy') : dateString;
  };

  const displayDate = formatDisplayDate(date);

  // Fetch entry for the given date
  useEffect(() => {
    async function fetchJournalEntry() {
      setIsLoading(true);

      // Parse and validate the date from URL params
      if (dateParam) {
        try {
          const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
          if (isValid(parsedDate)) {
            setDate(dateParam);
          }
        } catch (error) {
          console.error('Invalid date format:', error);
        }
      }

      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('entry_date', date)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching journal entry:', error);
        }

        setEntry(data as JournalEntry);
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJournalEntry();
  }, [date, dateParam]);

  // Save a new journal entry
  const handleSaveEntry = async (content: string) => {
    try {
      const newEntry = {
        entry_date: date,
        content,
        created_at: new Date().toISOString(),
      };

      // Check if entry already exists
      if (entry) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update({ content })
          .eq('id', entry.id);

        if (error) throw error;

        setEntry({ ...entry, content });
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert([newEntry])
          .select()
          .single();

        if (error) throw error;

        setEntry(data as JournalEntry);
      }

      setShowRecorder(false);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <Link href='/' className='inline-flex items-center text-blue-600 hover:text-blue-800'>
            <ChevronLeft size={16} />
            <span className='ml-1'>Back to Home</span>
          </Link>

          <h1 className='text-2xl font-bold text-center'>Journal for {displayDate}</h1>

          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            {!showRecorder ? (
              <>
                <Plus size={16} className='mr-1' />
                {entry ? 'New Recording' : 'Add Entry'}
              </>
            ) : (
              'Cancel'
            )}
          </button>
        </div>

        {showRecorder ? (
          <VoiceRecorder date={displayDate} onSave={handleSaveEntry} />
        ) : (
          <JournalEntryDisplay entry={entry} date={displayDate} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
