import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddlauqobkylxwvlhkfvc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGF1cW9ia3lseHd2bGhrZnZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDE0NzMsImV4cCI6MjA2NjAxNzQ3M30.OUjuYt8ZdvLj1ymFB9A2rz6Q8_EyKGtZC10qN6Ky4Ls';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);