import dateFn from 'date-fns';
import fp from 'mostly-func';

const startOfInterval = (date, frequency, unit) => {
  switch (unit) {
    case 'minute': {
      const minute = dateFn.getMinutes(date);
      return dateFn.startOfMinute(dateFn.setMinutes(date, minute - minute % frequency));
    }
    case 'hour': {
      const hour = dateFn.getHours(date);
      return dateFn.startOfHour(dateFn.setHours(date, hour - hour % frequency));
    }
    case 'day': {
      const day = dateFn.getDayOfYear(date);
      return dateFn.startOfDay(dateFn.setDayOfYear(date, day - day % frequency));
    }
    case 'week': {
      const week = dateFn.getISOWeek(date);
      return dateFn.startOfISOWeek(dateFn.setISOWeek(date, week - week % frequency));
    }
    case 'month': {
      const month = dateFn.getMonth(date);
      return dateFn.startOfMonth(dateFn.setMonth(date, month - month % frequency));
    }
    case 'year': {
      const year = dateFn.getYear(date);
      return dateFn.startOfYear(dateFn.setYear(date, year - year % frequency));
    }
    default: return date;
  }
};

// add time frequency
const addInterval = (startTime, frequency, unit) => {
  switch (unit) {
    case 'minute': return dateFn.addMinutes(startTime, frequency);
    case 'hour': return dateFn.addHours(startTime, frequency);
    case 'day': return dateFn.addDays(startTime, frequency);
    case 'week': return dateFn.addWeeks(startTime, frequency);
    case 'month': return dateFn.addMonths(startTime, frequency);
    case 'year': return dateFn.addISOYears(startTime, frequency);
    default: return startTime;
  }
};

// difference of given dates in percent of time unit
const diffIntervalPercent = (startTime, endTime, unit) => {
  switch (unit) {
    case 'minute': return dateFn.differenceInSeconds(endTime, startTime) / 60;
    case 'hour': return dateFn.differenceInMinutes(endTime, startTime) / 60;
    case 'day': return dateFn.differenceInHours(endTime, startTime) / 24;
    case 'week': return dateFn.differenceInDays(endTime, startTime) / 7;
    case 'month': return dateFn.differenceInDays(endTime, startTime) / dateFn.getDaysInMonth(startTime);
    case 'year': return dateFn.differenceInDays(endTime, startTime) / dateFn.getDaysInYear(startTime);
    default: return 0;
  }
};

export default function checkRateLimit (rate, limit) {
  const now = new Date();
  let { count, lastRequest, firstRequest, expiredAt } = limit || {};
  if (expiredAt && expiredAt.getTime() >= now.getTime()) {
    // replenish the count for leady bucket
    if (rate.window === 'LEAKY') {
      count += Math.floor(diffIntervalPercent(lastRequest, now, rate.interval) / rate.frequency * rate.count);
      count = Math.min(count, rate.count);
    }
  }

  // reset the limit
  if (!expiredAt || expiredAt.getTime() < now.getTime()) {
    count = rate.count;
    switch (rate.window) {
      case 'FIXED':
        // start at a fixed window of interval
        firstRequest = startOfInterval(now, rate.frequency, rate.interval);
        break;
      case 'ROLLING':
        // start at a rolling window of interval
        firstRequest = now;
        break;
      case 'LEAKY':
        // start at a rolling window also
        firstRequest = now;
        break;
      default:
        throw new Error('Unkonwn rate window ' + rate.window);
    }
    expiredAt = addInterval(firstRequest, rate.frequency, rate.interval);
  }

  if (expiredAt.getTime() >= now.getTime() && count > 0) {
    count = count - 1;
    lastRequest = now;
  } else {
    throw new Error('Rate limit exceed, the action can only be triggered ' +
      `${rate.count} times every ${rate.frequency} ${rate.interval}s`);
  }

  count = count - (limit && limit.count || 0); // difference with original count

  return { count, lastRequest, firstRequest, expiredAt };
}

