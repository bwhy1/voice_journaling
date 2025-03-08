import Link from 'next/link';
import { format, parse, isValid, isToday } from 'date-fns';
import type { JournalEntry } from '@/lib/supabase';
import JournalEntryDisplay from '../components/JournalEntryDisplay';
import { ChevronLeft, Edit } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

type Props = {
  searchParams: { date?: string };
};

export default async function DayPage({ searchParams }: Props) {
  const { date: dateParam } = searchParams;

  // Default to today's date if no date is provided
  const today = format(new Date(), 'yyyy-MM-dd');
  const date = dateParam || today;

  // Check if the current date is today
  const isCurrentDateToday = () => {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate) && isToday(parsedDate);
  };

  // If it's today with no specific request for today's date, redirect to record page
  if (isCurrentDateToday() && !dateParam) {
    redirect('/record');
  }

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(parsedDate) ? format(parsedDate, 'MMMM d, yyyy') : dateString;
  };

  const displayDate = formatDisplayDate(date);

  // Create a Supabase client for server-side operations
  const supabase = await createClient();

  // Fetch journal entry
  const { data: entry, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('entry_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching journal entry:', error);
  }

  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center'>
        <Link href='/' className='inline-flex items-center text-blue-600 hover:text-blue-800'>
          <ChevronLeft size={16} />
          <span className='ml-1'>Home</span>
        </Link>

        <h1 className='text-lg font-semibold text-center flex-1 mx-2 truncate'>{displayDate}</h1>

        {isCurrentDateToday() && (
          <Link
            href='/record'
            className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
            aria-label="Edit today's entry"
          >
            <Edit size={16} />
          </Link>
        )}

        {!isCurrentDateToday() && <div className='w-8' />}
      </header>

      {/* Main content */}
      <main className='flex-1 p-4'>
        <JournalEntryDisplay
          entry={entry as JournalEntry | null}
          date={displayDate}
          isLoading={false}
          onStartRecording={isCurrentDateToday() ? undefined : undefined}
          isToday={isCurrentDateToday()}
        />
      </main>
    </div>
  );
}
