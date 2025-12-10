'use client';

import { useState } from 'react';

/* ================================
   MOCK AUTH / CURRENT USER
================================ */
const LOGGED_IN_USER = {
  id: 1,
  name: 'Clark Lyons',
  role: 'Supervisor'
};

/* ================================
   SHIFT TYPES
================================ */
const SHIFT_TYPES = {
  morning: { label: 'Morning', start: '06:00', end: '14:00' },
  afternoon: { label: 'Afternoon', start: '14:00', end: '22:00' },
  night: { label: 'Night', start: '22:00', end: '06:00' }
} as const;

type ShiftType = keyof typeof SHIFT_TYPES;

type Shift = {
  id: number;
  type: ShiftType;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
};

/* ================================
   PAGE COMPONENT
================================ */
export default function ClockInPage() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [currentShift, setCurrentShift] = useState<Shift>({
    id: 1,
    type: 'morning',
    date: tomorrow
  });

  const [history, setHistory] = useState<Shift[]>([]);
  const [nextId, setNextId] = useState(2);

  function clockIn() {
    if (currentShift.clockIn) return;
    setCurrentShift({ ...currentShift, clockIn: new Date() });
  }

  function clockOut() {
    if (!currentShift.clockIn) return;
    const now = new Date();
    const finishedShift = { ...currentShift, clockOut: now };
    setHistory([finishedShift, ...history]);
    setNextId(nextId + 1);
    // reset current shift for demo purposes
    setCurrentShift({
      id: nextId,
      type: 'morning',
      date: new Date(new Date().setDate(new Date().getDate() + 1))
    });
  }

  function formatDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    return `${hours}h ${minutes}m`;
  }

  function formatDate(d: Date) {
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  return (
    <main
      style={{
        padding: 32,
        fontFamily: 'sans-serif',
        maxWidth: 600
      }}
    >
      <h1 style={{ fontSize: 28 }}>My Shifts</h1>
      <p>
        Logged in as <strong>{LOGGED_IN_USER.name}</strong> (
        {LOGGED_IN_USER.role})
      </p>

      {/* Current Shift */}
      <div
        style={{
          border: '1px solid #ccc',
          padding: 16,
          marginTop: 16,
          borderRadius: 6
        }}
      >
        <h3>{SHIFT_TYPES[currentShift.type].label} Shift</h3>
        <p>
          Tomorrow: {SHIFT_TYPES[currentShift.type].start} –{' '}
          {SHIFT_TYPES[currentShift.type].end}
        </p>

        <div style={{ marginTop: 8 }}>
          <button
            onClick={clockIn}
            disabled={!!currentShift.clockIn}
            style={{
              background: 'green',
              color: 'white',
              marginRight: 8,
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              cursor: currentShift.clockIn ? 'not-allowed' : 'pointer'
            }}
          >
            Clock In
          </button>

          <button
            onClick={clockOut}
            disabled={!currentShift.clockIn}
            style={{
              background: 'red',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: 4,
              cursor: !currentShift.clockIn ? 'not-allowed' : 'pointer'
            }}
          >
            Clock Out
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <p>
            <strong>Status:</strong>{' '}
            {currentShift.clockIn
              ? currentShift.clockOut
                ? 'Completed'
                : 'Clocked In'
              : 'Clocked Out'}
          </p>
          <p>
            <strong>Clock In:</strong>{' '}
            {currentShift.clockIn ? formatDate(currentShift.clockIn) : '—'}
          </p>
          
        </div>
      </div>

      {/* Shift History */}
      <section style={{ marginTop: 32 }}>
        <h2>Previous Shifts</h2>
        {history.length === 0 ? (
          <p>No previous shifts.</p>
        ) : (
          <table
            border={1}
            cellPadding={8}
            style={{ borderCollapse: 'collapse', width: '100%' }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map(s => (
                <tr key={s.id}>
                  <td>{s.date.toDateString()}</td>
                  <td>{SHIFT_TYPES[s.type].label}</td>
                  <td>{s.clockIn ? s.clockIn.toLocaleTimeString() : '—'}</td>
                  <td>{s.clockOut ? s.clockOut.toLocaleTimeString() : '—'}</td>
                  <td>
                    {s.clockIn && s.clockOut
                      ? formatDuration(s.clockIn, s.clockOut)
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
