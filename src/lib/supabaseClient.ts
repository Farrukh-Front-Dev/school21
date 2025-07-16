// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdwloaqrgzbczanwfqso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd2xvYXFyZ3piY3phbndmcXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjY2MjIsImV4cCI6MjA2NzkwMjYyMn0.ehylz-SkEWxVSNUHGTeBA3AuVzuAzbX_1jy0C9pE3Fo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
