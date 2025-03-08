'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import JournalCalendar from '../components/JournalCalendar';

export default function CalendarPage() {
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex items-center'>
        <Link href='/' className='inline-flex items-center text-blue-600 hover:text-blue-800'>
          <ChevronLeft size={16} />
          <span className='ml-1'>Home</span>
        </Link>

        <h1 className='text-lg font-semibold text-center flex-1 mx-2'>Journal Calendar</h1>

        {/* Empty div for spacing balance */}
        <div className='w-[60px]'></div>
      </header>

      {/* Main content */}
      <main className='flex-1 p-4 pt-8'>
        <JournalCalendar />
      </main>
    </div>
  );
}
