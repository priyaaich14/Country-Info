export const getCurrentTime = (timezones: string[] | undefined): string => {
  if (!timezones || timezones.length === 0 || timezones[0] === 'N/A') {
    console.warn('Invalid timezone received:', timezones);
    return 'N/A';
  }

  const rawTimezone = timezones[0]; // Use the first timezone
  console.log('Raw Timezone:', rawTimezone);

  // Map raw UTC offsets to Intl-compatible timezone names
  const timezoneMapping: Record<string, string> = {
    'UTC': 'UTC',
    'UTC+00:00': 'UTC',
    'UTC+01:00': 'Europe/London',
    'UTC+02:00': 'Europe/Berlin',
    'UTC+03:00': 'Africa/Nairobi',
    'UTC+03:30': 'Asia/Tehran',
    'UTC+04:00': 'Asia/Dubai',
    'UTC+04:30': 'Asia/Kabul',
    'UTC+05:00': 'Asia/Karachi',
    'UTC+05:30': 'Asia/Kolkata',
    'UTC+05:45': 'Asia/Kathmandu',
    'UTC+06:00': 'Asia/Dhaka',
    'UTC+06:30': 'Asia/Yangon',
    'UTC+07:00': 'Asia/Bangkok',
    'UTC+08:00': 'Asia/Singapore',
    'UTC+09:00': 'Asia/Tokyo',
    'UTC+09:30': 'Australia/Darwin',
    'UTC+10:00': 'Australia/Sydney',
    'UTC+10:30': 'Australia/Lord_Howe',
    'UTC+11:00': 'Pacific/Noumea',
    'UTC+12:00': 'Pacific/Auckland',
    'UTC+13:00': 'Pacific/Tongatapu',
    'UTC+14:00': 'Pacific/Kiritimati',
    'UTC-01:00': 'Atlantic/Azores',
    'UTC-02:00': 'Atlantic/South_Georgia',
    'UTC-03:00': 'America/Argentina/Buenos_Aires',
    'UTC-03:30': 'America/St_Johns',
    'UTC-04:00': 'America/New_York',
    'UTC-05:00': 'America/Bogota',
    'UTC-06:00': 'America/Chicago',
    'UTC-07:00': 'America/Denver',
    'UTC-08:00': 'America/Los_Angeles',
    'UTC-09:00': 'America/Anchorage',
    'UTC-09:30': 'Pacific/Marquesas',
    'UTC-10:00': 'Pacific/Honolulu',
    'UTC-11:00': 'Pacific/Midway',
    'UTC-12:00': 'Etc/GMT+12',
  };

  const timezone = timezoneMapping[rawTimezone] || rawTimezone;

  console.log('Mapped Timezone:', timezone);

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return formatter.format(new Date());
  } catch (error) {
    console.error(`Error formatting time for timezone: ${timezone}`, error);
    return 'N/A';
  }
};
