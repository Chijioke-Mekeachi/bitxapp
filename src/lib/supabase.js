import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://xbifbtbouraistmakxwj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaWZidGJvdXJhaXN0bWFreHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTU3MTEsImV4cCI6MjA2NTMzMTcxMX0.fxb-VlYG_sBdGahWFk-q8mAKD6yOyMqSZTkdkoTCXLg';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});