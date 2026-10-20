'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkEligibility } from '@/lib/eligibility';
import { createClient } from '@/lib/supabase';

type Step = 'idle' | 'locating' | 'scanning' | 'done' | 'denied';

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');
  const [message, setMessage] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) return;
        setPlayerId(data.user.id);
      });
  }, []);

  async function handleGeofence() {
    setStep('locating');
    try {
      const coords = await new Promise<GeolocationCoordinates>((res, rej) =>
        navigator.geolocation.getCurrentPosition((p) => res(p.coords), rej, {
          timeout: 10_000,
        }),
      );
      const result = await checkEligibility({
        playerId,
        action: 'check_in',
        location: coords,
      });
      if (result.allowed) {
        setStep('done');
        setTimeout(() => router.push('/lobby'), 800);
      } else {
        setMessage(result.reason);
        setStep('denied');
      }
    } catch {
      setMessage('location-unavailable');
      setStep('denied');
    }
  }

  async function handleQr() {
    const result = await checkEligibility({
      playerId,
      action: 'check_in',
      qrToken: qrInput,
    });
    if (result.allowed) {
      setStep('done');
      setTimeout(() => router.push('/lobby'), 800);
    } else {
      setMessage(result.reason);
      setStep('denied');
    }
  }

  return (
    <main>
      {step === 'idle' && (
        <>
          <h1>Check in</h1>
          <button onClick={handleGeofence}>Use my location</button>
          <button onClick={() => setStep('scanning')}>Scan QR code</button>
        </>
      )}

      {step === 'locating' && <p>Locating…</p>}

      {step === 'scanning' && (
        <>
          <h1>Enter code</h1>
          <p className="muted">Type the code shown on the venue tablet.</p>
          <input
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Venue code"
            autoFocus
          />
          <button onClick={handleQr} disabled={!qrInput}>Confirm</button>
          <button onClick={() => setStep('idle')}>Back</button>
        </>
      )}

      {step === 'done' && <p>Checked in. Entering lobby…</p>}

      {step === 'denied' && (
        <>
          <p>Check-in failed: {message}</p>
          <button onClick={() => setStep('idle')}>Try again</button>
        </>
      )}
    </main>
  );
}
