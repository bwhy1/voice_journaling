import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for journal entries
export type JournalEntry = {
  id: string;
  created_at: string;
  entry_date: string;
  audio_url?: string;
  transcript?: string;
  content: string;
  user_id?: string;
};

// Type for user profile
export type UserProfile = {
  id?: string;
  name: string;
  goals: string;
  challenges: string;
  interests: string;
  created_at?: string;
};
