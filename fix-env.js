const fs = require('fs');
const content = `NEXT_PUBLIC_SUPABASE_URL=https://yvuwlaeihlwaiebbquwp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dXdsYWVpaGx3YWllYmJxdXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODcyNTMsImV4cCI6MjA4NTQ2MzI1M30._knGhbQygHXxnV4ypvbxyoqEJ7N-yuRfQB4kbCpaDww

GEMINI_API_KEY=AIzaSyDKK8Y_XpiILQfRQwqDmRkVtDuZYKBIXDo

ELEVENLABS_API_KEY=sk_f127338d68c8be8f946ab5ea1082b8d54fe1e8b66d5145cd
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAMTlvDq8ikWAM
`;
fs.writeFileSync('.env.local', content, { encoding: 'utf8' });
console.log('Fixed .env.local encoding to UTF-8');
