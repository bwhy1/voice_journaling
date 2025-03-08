'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/lib/supabase';

export default function JournalCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalDates, setJournalDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all journal entries to highlight days with entries
  useEffect(() => {
    async function fetchJournalDates() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('journal_entries').select('entry_date');

        if (error) {
          console.error('Error fetching journal dates:', error);
          return;
        }

        // Extract dates from entries
        const dates = data?.map((entry) => entry.entry_date) || [];
        setJournalDates(dates);
      } catch (error) {
        console.error('Error fetching journal dates:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJournalDates();
  }, []);

  // Generate calendar days for the current month
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return daysInMonth;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Check if a day has a journal entry
  const hasJournalEntry = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return journalDates.includes(formattedDay);
  };

  const days = getDaysInMonth();
  const today = new Date();

  // Day of week header names
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='text-center mb-6'>
        <h2 className='text-xl font-semibold mb-4'>Journal Calendar</h2>
        <p className='text-gray-600 dark:text-gray-300'>
          Select a date to view or create your journal entry
        </p>
      </div>

      {/* Month navigation */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={prevMonth}
          className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
          aria-label='Previous month'
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className='text-lg font-medium'>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button
          onClick={nextMonth}
          className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
          aria-label='Next month'
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className='grid grid-cols-7 gap-1'>
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className='text-center py-2 text-sm font-medium text-gray-500'>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const isToday = isSameDay(day, today);
          const hasEntry = hasJournalEntry(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <Link
              key={dayStr}
              href={`/day?date=${dayStr}`}
              className={`
                aspect-square flex flex-col items-center justify-center p-1 rounded-md relative
                ${!isCurrentMonth && 'opacity-40'}
                ${
                  hasEntry
                    ? 'hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full text-sm
                  ${isToday && 'bg-blue-100 dark:bg-blue-900/50 font-semibold'}
                  ${hasEntry && 'font-medium'}
                `}
              >
                {format(day, 'd')}
              </div>

              {hasEntry && (
                <div className='absolute bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
              )}
            </Link>
          );
        })}
      </div>

      {isLoading && (
        <div className='text-center mt-4 text-sm text-gray-500'>Loading journal entries...</div>
      )}
    </div>
  );
}
