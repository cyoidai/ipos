'use client';

import React, { useEffect, useState } from 'react';

type User = { id: number; first_name: string; last_name: string };
type ScheduleEntry = { id: number; user_id: number; start_time: number; end_time: number };

interface SchedulePageProps {
  orgId: string;
}

// Helper functions
function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0,0,0,0);
  return date;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function formatDate(date: Date, format: 'EEE' | 'MMM dd') {
  const options: Intl.DateTimeFormatOptions =
    format === 'EEE' ? { weekday: 'short' } : { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export default function SchedulePage({ orgId }: SchedulePageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(getMonday(new Date()));
  const [newShift, setNewShift] = useState<{ [key: string]: string }>({});

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // --- Fetch users and schedule from backend ---
  const fetchData = async () => {
    try {
      const usersRes = await fetch(`/api/org/${orgId}/users`);
      const scheduleRes = await fetch(`/api/org/${orgId}/schedule?weekStart=${weekStart.getTime()}`);
      if (!usersRes.ok || !scheduleRes.ok) throw new Error('Failed to fetch data');

      const usersJson: User[] = await usersRes.json();
      const scheduleJson: ScheduleEntry[] = await scheduleRes.json();
      setUsers(usersJson);
      setSchedule(scheduleJson);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekStart]);

  const handleInputChange = (userId: number, dayKey: string, value: string) => {
    setNewShift(prev => ({ ...prev, [dayKey]: value }));
  };

  const saveShift = async (userId: number, dayKey: string) => {
    const shiftText = newShift[dayKey];
    if (!shiftText) return;

    const [start, end] = shiftText.split('-').map(t => t.trim());
    const dayTimestamp = parseInt(dayKey.split('_')[1]);
    const shiftDate = new Date(dayTimestamp);
    const startTime = new Date(shiftDate);
    const endTime = new Date(shiftDate);
    startTime.setHours(parseInt(start), 0, 0, 0);
    endTime.setHours(parseInt(end), 0, 0, 0);

    try {
      const res = await fetch(`/api/org/${orgId}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          start_time: Math.floor(startTime.getTime()/1000),
          end_time: Math.floor(endTime.getTime()/1000)
        })
      });
      if (!res.ok) throw new Error('Failed to save shift');
      fetchData();
      setNewShift(prev => ({ ...prev, [dayKey]: '' }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteShift = async (shiftId: number) => {
    try {
      const res = await fetch(`/api/org/${orgId}/schedule/${shiftId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete shift');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Weekly Schedule</h1>

      <div className="flex items-center gap-4">
        <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="px-3 py-1 bg-gray-200 rounded">Previous</button>
        <div className="font-semibold">{formatDate(weekStart,'MMM dd')} - {formatDate(addDays(weekStart,6),'MMM dd')}</div>
        <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        <div className="font-bold p-2 bg-gray-100">Employee</div>
        {days.map(day => (
          <div key={day.toISOString()} className="font-bold p-2 bg-gray-100 text-center">{formatDate(day,'EEE')}</div>
        ))}

        {users.map(user => (
          <React.Fragment key={user.id}>
            <div className="p-2 font-semibold">{user.first_name} {user.last_name}</div>
            {days.map(day => {
              const existingShift = schedule.find(s =>
                s.user_id === user.id && isSameDay(new Date(s.start_time*1000), day)
              );
              const key = `${user.id}_${day.getTime()}`;
              return (
                <div key={day.toISOString()} className="p-1">
                  {existingShift ? (
                    <div className="flex justify-between items-center bg-gray-100 p-1 rounded">
                      <span>{new Date(existingShift.start_time*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(existingShift.end_time*1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      <button onClick={() => deleteShift(existingShift.id)} className="ml-1 text-red-500 font-bold">X</button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <input className="border p-1 rounded w-full text-sm"
                        placeholder="9-17"
                        value={newShift[key] || ''}
                        onChange={e => handleInputChange(user.id, key, e.target.value)}
                      />
                      <button className="px-2 bg-blue-500 text-white rounded text-sm" onClick={() => saveShift(user.id, key)}>Save</button>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
