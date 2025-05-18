/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface CallInfo {
  roomName: string;
  displayName: string;
}

export default function VideoCall() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  const { user } = useUser();
  const router = useRouter();
  const jitsiRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJitsiScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) return resolve();

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi script'));
        document.body.appendChild(script);
      });
    };

    const fetchCallInfo = async () => {
      if (!user) return;

      try {
        const userId = user.id;
        if (!appointmentId || !userId) {
          console.log('Missing:', appointmentId, userId);
          setError('Missing appointment or user information.');
          return null;
        }

        const res = await fetch('/api/videocall/calls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId,
            userId,
          }),
        });

        if (!res.ok) throw new Error('Call info not found.');

        const data: CallInfo = await res.json();
        return data;
      } catch (err) {
        setError('Failed to fetch call information.');
        console.error(err);
        return null;
      }
    };

    const initCall = async () => {
      setLoading(true);
      try {
        await loadJitsiScript();
        const callInfo = await fetchCallInfo();

        if (!callInfo || !jitsiRef.current) return;

        const domain = 'meet.jit.si';
        const options = {
          roomName: callInfo.roomName,
          parentNode: jitsiRef.current,
          width: '100%',
          height: '100%',
          userInfo: {
            displayName: callInfo.displayName,
          },
          configOverwrite: {
            prejoinPageEnabled: false,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // 🔁 Redirect to /home after call ends
        api.addEventListener('readyToClose', () => {
          router.push('/home');
        });

      } catch (err) {
        setError('Error initializing video call.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initCall();
  }, [appointmentId, user]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center text-gray-700">
        Joining call...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black">
      <div ref={jitsiRef} className="w-full h-full" />
    </div>
  );
}
