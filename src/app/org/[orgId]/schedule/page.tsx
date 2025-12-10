'use client';

import { useState } from 'react';

/* ================================
   MOCK AUTH
================================ */
const LOGGED_IN_USER = {
  name: 'Clark Lyons',
  role: 'Supervisor'
};

/* ================================
   USERS
================================ */
const USERS = [
  { id: 1, name: 'Clark Lyons' },
  { id: 2, name: 'Evan W' },
  { id: 3, name: 'Alex Smith' }
];

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
  userId: number;
  day: number; // 0–6 (Mon–Sun)
  week: number;
  type: ShiftType;
};

/* ================================
   DATE HELPERS (NO LIBS)
================================ */
function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

/* ================================
   PAGE
================================ */
export default function OrgSchedule({
  params
}: {
  params: { orgId: string };
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [nextId, setNextId] = useState(1);

  const baseWeekStart = startOfWeek(new Date());
  const currentWeekStart = addDays(baseWeekStart, weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  function weekLabel() {
    return `${formatDate(weekDays[0])} – ${formatDate(weekDays[6])}`;
  }

  function addShift(userId: number, day: number, type: ShiftType) {
    setShifts(prev => [
      ...prev,
      {
        id: nextId,
        userId,
        day,
        week: weekOffset,
        type
      }
    ]);
    setNextId(id => id + 1);
  }

  function removeShift(id: number) {
    setShifts(prev => prev.filter(s => s.id !== id));
  }

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      {/* Header */}
      <h1 style={{ fontSize: 28 }}>Weekly Shift Schedule</h1>

      <p style={{ opacity: 0.7 }}>
        Org ID: {params.orgId}
      </p>

      <p style={{ marginTop: 8 }}>
        Logged in as <strong>{LOGGED_IN_USER.name}</strong> (
        {LOGGED_IN_USER.role})
      </p>

      {/* Week Controls */}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setWeekOffset(o => o - 1)}>
          ◀ Previous
        </button>

        <span style={{ margin: '0 12px', fontWeight: 'bold' }}>
          {weekLabel()}
        </span>

        <button onClick={() => setWeekOffset(o => o + 1)}>
          Next ▶
        </button>
      </div>

      {/* Schedule Table */}
      <table
        border={1}
        cellPadding={8}
        style={{
          borderCollapse: 'collapse',
          marginTop: 24,
          width: '100%'
        }}
      >
        <thead>
          <tr>
            <th>User</th>
            {weekDays.map((date, i) => (
              <th key={i}>
                {date.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'numeric',
                  day: 'numeric'
                })}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {USERS.map(user => (
            <tr key={user.id}>
              <td style={{ fontWeight: 'bold' }}>
                {user.name}
              </td>

              {weekDays.map((_, dayIndex) => {
                const cellShifts = shifts.filter(
                  s =>
                    s.userId === user.id &&
                    s.day === dayIndex &&
                    s.week === weekOffset
                );

                return (
                  <td key={dayIndex} style={{ verticalAlign: 'top' }}>
                    {cellShifts.map(shift => {
                      const def = SHIFT_TYPES[shift.type];
                      return (
                        <div
                          key={shift.id}
                          style={{
                            background: '#eee',
                            padding: 6,
                            marginBottom: 6,
                            borderRadius: 4
                          }}
                        >
                          <strong>{def.label}</strong>
                          <div>
                            {def.start} – {def.end}
                          </div>
                          <button
                            onClick={() => removeShift(shift.id)}
                            style={{ marginTop: 4 }}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      );
                    })}

                    {/* Add Shift Buttons */}
                    <div style={{ marginTop: 6 }}>
                      {(Object.keys(SHIFT_TYPES) as ShiftType[]).map(type => (
                        <button
                          key={type}
                          onClick={() =>
                            addShift(user.id, dayIndex, type)
                          }
                          style={{
                            display: 'block',
                            marginBottom: 4,
                            width: '100%'
                          }}
                        >
                          + {SHIFT_TYPES[type].label}
                        </button>
                      ))}
                    </div>
                  </td>
                );a
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
