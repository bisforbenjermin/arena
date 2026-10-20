'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/signin'); return; }

    await supabase.from('players').upsert({
      id: user.id,
      handle,
      home_region_id: region || null,
    });

    router.push('/');
  }

  return (
    <main>
      <h1>Enter the Arena</h1>
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <input
          placeholder="Handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
          minLength={2}
          maxLength={32}
          autoFocus
        />
        <input
          placeholder="Home region (optional)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button type="submit" disabled={loading || !handle}>
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
