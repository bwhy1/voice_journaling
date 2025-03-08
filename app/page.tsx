import Link from 'next/link';
import { format } from 'date-fns';
import { Book, PenSquare } from 'lucide-react';

export default function Home() {
  // Get today's date in the format YYYY-MM-DD
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-3xl'>
        <h1 className='text-3xl font-bold text-center w-full'>Voice Journal App</h1>

        <div className='flex flex-col gap-6 w-full'>
          <div className='p-6 border rounded-lg shadow-sm w-full'>
            <h2 className='text-xl font-semibold mb-4'>What would you like to do today?</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Link
                href={`/day?date=${today}`}
                className='flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
              >
                <div className='p-3 bg-blue-100 dark:bg-blue-900 rounded-full'>
                  <PenSquare size={24} className='text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <h3 className='font-medium'>Create Today&apos;s Journal</h3>
                  <p className='text-sm text-gray-500'>Record your thoughts for today</p>
                </div>
              </Link>

              <Link
                href='/calendar'
                className='flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors'
              >
                <div className='p-3 bg-purple-100 dark:bg-purple-900 rounded-full'>
                  <Book size={24} className='text-purple-600 dark:text-purple-400' />
                </div>
                <div>
                  <h3 className='font-medium'>Browse Journal Calendar</h3>
                  <p className='text-sm text-gray-500'>View entries day by day</p>
                </div>
              </Link>
            </div>
          </div>

          <div className='p-6 border rounded-lg shadow-sm'>
            <h2 className='text-xl font-semibold mb-2'>About Voice Journaling</h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Voice journaling is a convenient way to document your thoughts, feelings, and
              experiences. Simply speak your thoughts, and our app will transcribe and store them
              securely.
            </p>
          </div>
        </div>
      </main>

      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>
        <p className='text-sm text-gray-500'>© {new Date().getFullYear()} Voice Journal App</p>
      </footer>
    </div>
  );
}
