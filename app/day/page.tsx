'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format, parse, isValid, isToday } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/lib/supabase';
import VoiceRecorder from '../components/VoiceRecorder';
import JournalEntryDisplay from '../components/JournalEntryDisplay';
import { ChevronLeft, Plus, X } from 'lucide-react';

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

  // Check if the current date is today
  const isCurrentDateToday = () => {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate) && isToday(parsedDate);
  };

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

        // If it's today and there's no entry, show the recorder automatically
        if (isCurrentDateToday() && !data) {
          setShowRecorder(true);
        }
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
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center'>
        <Link href='/' className='inline-flex items-center text-blue-600 hover:text-blue-800'>
          <ChevronLeft size={16} />
          <span className='ml-1'>Home</span>
        </Link>

        <h1 className='text-lg font-semibold text-center flex-1 mx-2 truncate'>{displayDate}</h1>

        {entry && (
          <button
            onClick={() => setShowRecorder(!showRecorder)}
            className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
            aria-label={showRecorder ? 'Cancel recording' : 'New recording'}
          >
            {showRecorder ? <X size={16} /> : <Plus size={16} />}
          </button>
        )}

        {/* Spacer when there's no entry, to keep the header balanced */}
        {!entry && <div className='w-8' />}
      </header>

      {/* Main content */}
      <main className='flex-1 p-4'>
        {showRecorder ? (
          <div className='flex flex-col h-[calc(100vh-8rem)]'>
            <VoiceRecorder date={displayDate} onSave={handleSaveEntry} />
          </div>
        ) : (
          <JournalEntryDisplay entry={entry} date={displayDate} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
