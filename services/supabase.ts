
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = 'https://lsfjxtrqggogkzefudry.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZmp4dHJxZ2dvZ2t6ZWZ1ZHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjM1OTAsImV4cCI6MjA2ODk5OTU5MH0.yNVvU41kD9T4kVLHg7bxtfPgGglTSXEEUMO6-cvJ_6U';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
