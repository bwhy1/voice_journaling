import Link from 'next/link';
import { format } from 'date-fns';
import { createClient } from '@/utils/supabase/server';
import { ChevronLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import VoiceRecorder from '../components/VoiceRecorder';

export default async function RecordPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const displayDate = format(new Date(), 'MMMM d, yyyy');

  // Server-side check if there's already an entry for today
  const supabase = await createClient();

  const { data: existingEntry } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('entry_date', today)
    .single();

  // Redirect to day view if entry already exists
  if (existingEntry) {
    redirect(`/day?date=${today}`);
  }

  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex items-center'>
        <Link href='/' className='inline-flex items-center text-blue-600 hover:text-blue-800'>
          <ChevronLeft size={16} />
          <span className='ml-1'>Home</span>
        </Link>

        <h1 className='text-lg font-semibold text-center flex-1 mx-2'>Recording Journal</h1>

        <div className='w-8'></div>
      </header>

      <main className='flex-1 p-4'>
        <div className='flex flex-col h-[calc(100vh-8rem)]'>
          <VoiceRecorder date={displayDate} today={today} />
        </div>
      </main>
    </div>
  );
}
