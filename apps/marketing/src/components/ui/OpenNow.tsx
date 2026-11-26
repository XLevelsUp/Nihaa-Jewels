'use client';
// Live "Open now / Closed now" for the showroom, worked out in the browser on Coimbatore time so cached pages never show a stale status.

import { useEffect, useState } from 'react';

const OPEN_DAYS = [1, 2, 3, 4, 5, 6];
const OPEN_MINUTE = 10 * 60;
const CLOSE_MINUTE = 21 * 60;

function isOpen(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minute = Number(get('hour')) * 60 + Number(get('minute'));
  return OPEN_DAYS.includes(day) && minute >= OPEN_MINUTE && minute < CLOSE_MINUTE;
}

export default function OpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpen(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return null;
  return (
    <span className="inline-flex items-center gap-2 font-medium">
      <span className="h-2 w-2 rounded-full" style={{ background: open ? '#3DBE6A' : '#D9534F' }} aria-hidden="true" />
      {open ? 'Open now' : 'Closed now'}
    </span>
  );
}
