import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ddlauqobkylxwvlhkfvc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGF1cW9ia3lseHd2bGhrZnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDE0NzMsImV4cCI6MjA2NjAxNzQ3M30.OUjuYt8ZdvLj1ymFB9A2rz6Q8_EyKGtZC10qN6Ky4Ls';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);