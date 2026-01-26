'use client';

import { useEffect, useState } from 'react';

interface TimeZoneInfo {
  name: string;
  abbreviation: string;
  offset: number; // in hours from UTC
  availability: string;
  workHoursOverlap: string;
  overlapHours: number;
}

export default function TimezoneOverlap() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // UK availability: 8am - 8pm GMT (UTC+0)
  const ukStartHour = 8;
  const ukEndHour = 20;

  const timezones: TimeZoneInfo[] = [
    {
      name: 'UK (London)',
      abbreviation: 'GMT',
      offset: 0,
      availability: '08:00 – 20:00',
      workHoursOverlap: '08:00 – 17:00',
      overlapHours: 9,
    },
    {
      name: 'US East (New York)',
      abbreviation: 'ET',
      offset: -5,
      availability: '03:00 – 15:00',
      workHoursOverlap: '09:00 – 15:00',
      overlapHours: 6,
    },
    {
      name: 'US Central (Chicago)',
      abbreviation: 'CT',
      offset: -6,
      availability: '02:00 – 14:00',
      workHoursOverlap: '09:00 – 14:00',
      overlapHours: 5,
    },
    {
      name: 'US Mountain (Denver)',
      abbreviation: 'MT',
      offset: -7,
      availability: '01:00 – 13:00',
      workHoursOverlap: '09:00 – 13:00',
      overlapHours: 4,
    },
    {
      name: 'US Pacific (LA, SF)',
      abbreviation: 'PT',
      offset: -8,
      availability: '00:00 – 12:00',
      workHoursOverlap: '09:00 – 12:00',
      overlapHours: 3,
    },
  ];

  const getCurrentTimeInZone = (offset: number) => {
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utcTime.getTime() + offset * 3600000);
    return zoneTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isWithinWorkHours = (offset: number) => {
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    const zoneTime = new Date(utcTime.getTime() + offset * 3600000);
    const hour = zoneTime.getHours();
    return hour >= 9 && hour < 17;
  };

  const isWithinAvailability = (offset: number) => {
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    const ukTime = utcTime;
    const ukHour = ukTime.getHours();
    return ukHour >= ukStartHour && ukHour < ukEndHour;
  };

  // Generate 24-hour timeline
  const generateTimeline = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getBarPosition = (startHour: number, endHour: number) => {
    const start = (startHour / 24) * 100;
    const width = ((endHour - startHour) / 24) * 100;
    return { left: `${start}%`, width: `${width}%` };
  };

  const getOverlapPosition = (timezone: TimeZoneInfo) => {
    // Convert work hours overlap to 24-hour format in that timezone
    const overlapStart = parseInt(timezone.workHoursOverlap.split(' – ')[0].split(':')[0]);
    const overlapEnd = parseInt(timezone.workHoursOverlap.split(' – ')[1].split(':')[0]);

    // Convert to UK time for positioning on timeline
    const ukStartEquivalent = overlapStart - timezone.offset;
    const ukEndEquivalent = overlapEnd - timezone.offset;

    return getBarPosition(ukStartEquivalent, ukEndEquivalent);
  };

  const getCurrentTimePosition = () => {
    // Get current time in GMT (UK time)
    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);
    const hours = utcTime.getHours();
    const minutes = utcTime.getMinutes();
    const totalHours = hours + minutes / 60;
    return (totalHours / 24) * 100;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Availability & Timezone Overlap
        </h2>
        <p className="text-sm text-gray-600">
          Your Calendly availability is 8:00am–8:00pm UK time. US clients will see this converted to their local time.
        </p>
      </div>

      {/* Current Times */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {timezones.map((tz) => {
          const isWorkHours = isWithinWorkHours(tz.offset);
          const isAvailable = isWithinAvailability(tz.offset);

          return (
            <div
              key={tz.abbreviation}
              className={`p-3 rounded-lg border-2 ${
                isAvailable && isWorkHours
                  ? 'border-green-500 bg-green-50'
                  : isAvailable
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-xs font-medium text-gray-600 mb-1">
                {tz.name}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {getCurrentTimeInZone(tz.offset)}
              </div>
              <div className="text-xs text-gray-500 mt-1">{tz.abbreviation}</div>
              {isAvailable && isWorkHours && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  ✓ Peak overlap
                </div>
              )}
              {isAvailable && !isWorkHours && (
                <div className="text-xs text-indigo-600 font-medium mt-1">
                  ✓ Available
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Working Hours Overlap</h3>

        {/* 24-hour timeline header */}
        <div className="relative h-8 border-b border-gray-200">
          {[0, 6, 12, 18, 24].map((hour) => (
            <div
              key={hour}
              className="absolute top-0 text-xs text-gray-500"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}

          {/* Current time indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${getCurrentTimePosition()}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>

        {/* UK availability bar */}
        <div className="relative">
          <div className="text-xs font-medium text-gray-700 mb-2">
            UK (GMT) - Your Availability
          </div>
          <div className="relative h-8 bg-gray-100 rounded">
            <div
              className="absolute h-full bg-indigo-500 rounded"
              style={getBarPosition(ukStartHour, ukEndHour)}
            >
              <span className="absolute left-2 top-1 text-xs text-white font-medium">
                08:00 – 20:00 GMT
              </span>
            </div>
            {/* Current time indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${getCurrentTimePosition()}%` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* US timezone bars */}
        {timezones.slice(1).map((tz) => {
          // Calculate local time range
          const localStart = ukStartHour + tz.offset;
          const localEnd = ukEndHour + tz.offset;

          // Handle wrap around midnight
          const displayStart = localStart < 0 ? 24 + localStart : localStart;
          const displayEnd = localEnd < 0 ? 24 + localEnd : localEnd > 24 ? localEnd - 24 : localEnd;

          return (
            <div key={tz.abbreviation} className="relative">
              <div className="text-xs font-medium text-gray-700 mb-2 flex items-center justify-between">
                <span>{tz.name} ({tz.abbreviation})</span>
                <span className="text-green-600 font-semibold">
                  {tz.overlapHours} hour{tz.overlapHours !== 1 ? 's' : ''} overlap
                </span>
              </div>
              <div className="relative h-8 bg-gray-100 rounded">
                {/* Full availability in local time */}
                <div
                  className="absolute h-full bg-blue-200 rounded"
                  style={getBarPosition(
                    displayStart < displayEnd ? displayStart : 0,
                    displayStart < displayEnd ? displayEnd : 24
                  )}
                />
                {/* Overlap with standard work hours (9-5 in that timezone) */}
                <div
                  className="absolute h-full bg-green-500 rounded"
                  style={getOverlapPosition(tz)}
                >
                  <span className="absolute left-2 top-1 text-xs text-white font-medium">
                    {tz.workHoursOverlap} {tz.abbreviation}
                  </span>
                </div>
                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{ left: `${getCurrentTimePosition()}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Your availability (UK time)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span>Availability in local time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Overlap with 9-5 work hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-red-500"></div>
          <span>Current time (GMT)</span>
        </div>
      </div>

      {/* Detailed overlap info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {timezones.slice(1).map((tz) => (
          <div key={tz.abbreviation} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">
              {tz.name}
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>
                <span className="font-medium">When you're available:</span> {tz.availability} {tz.abbreviation}
              </div>
              <div>
                <span className="font-medium">Standard work hours overlap:</span> {tz.workHoursOverlap} {tz.abbreviation}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="font-medium text-green-600">
                  {tz.overlapHours} hours
                </span>{' '}
                of overlap during their typical 9-5 workday
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
