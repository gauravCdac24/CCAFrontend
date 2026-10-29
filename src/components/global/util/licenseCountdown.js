/**
 * Remaining licence term as Year:Months:Days HH:MM:SS.
 * A licence is valid for 5 years from the grant date, through the end of the
 * day before that anniversary (the stored "Licence Valid upto" date).
 * The countdown reaches zero at local midnight when that validity ends.
 */

const pad = (value) => String(value).padStart(2, "0");

const isUnset = (value) =>
    value === null ||
    value === undefined ||
    value === "" ||
    value === "-" ||
    value === 0 ||
    value === "0";

const isEpoch = (date) =>
    (date.getUTCFullYear() <= 1970 && date.getUTCMonth() === 0 && date.getUTCDate() <= 1) ||
    (date.getFullYear() <= 1970 && date.getMonth() === 0 && date.getDate() <= 1);

/** Calendar date in local time, ignoring the time of day from the API. */
const toLocalDay = (value) => {
    if (isUnset(value)) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || isEpoch(date)) {
        return null;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const addMonthsClamped = (date, months) => {
    const result = new Date(date.getTime());
    const day = result.getDate();
    result.setDate(1);
    result.setMonth(result.getMonth() + months);
    const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    result.setDate(Math.min(day, lastDay));
    return result;
};

/**
 * Instant the licence stops being valid.
 * Prefers the stored expiry date. Falls back to five years after the issue date.
 */
export const getLicenseCountdownTarget = (expiryDate, issueDate) => {
    const expiryDay = toLocalDay(expiryDate);
    if (expiryDay) {
        return new Date(expiryDay.getFullYear(), expiryDay.getMonth(), expiryDay.getDate() + 1);
    }

    const issueDay = toLocalDay(issueDate);
    if (!issueDay) {
        return null;
    }

    return addMonthsClamped(issueDay, 5 * 12);
};

const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

/**
 * Calendar remainder that adds back to `end` with ordinary date arithmetic.
 * Days borrow from the previous month until the count is non-negative, so a
 * short February does not drop a day from the total.
 */
const calendarRemaining = (end, now) => {
    let years = end.getFullYear() - now.getFullYear();
    let months = end.getMonth() - now.getMonth();
    let days = end.getDate() - now.getDate();
    let hours = end.getHours() - now.getHours();
    let minutes = end.getMinutes() - now.getMinutes();
    let seconds = end.getSeconds() - now.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
    }
    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }
    if (hours < 0) {
        hours += 24;
        days -= 1;
    }

    let borrowYear = end.getFullYear();
    let borrowMonth = end.getMonth();
    while (days < 0) {
        borrowMonth -= 1;
        if (borrowMonth < 0) {
            borrowMonth = 11;
            borrowYear -= 1;
        }
        days += daysInMonth(borrowYear, borrowMonth);
        months -= 1;
    }

    while (months < 0) {
        months += 12;
        years -= 1;
    }

    if (years < 0) {
        return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return { years, months, days, hours, minutes, seconds };
};

export const EXPIRED_LICENSE_COUNTDOWN = "0:00:00 00:00:00";

/** @param {Date|number|null} target countdown end instant */
export const formatLicenseCountdown = (target, now = Date.now()) => {
    if (!target) {
        return "-";
    }

    const end = target instanceof Date ? target : new Date(target);
    const current = new Date(now);
    if (Number.isNaN(end.getTime()) || end.getTime() <= current.getTime()) {
        return EXPIRED_LICENSE_COUNTDOWN;
    }

    const { years, months, days, hours, minutes, seconds } = calendarRemaining(end, current);
    return `${years}:${pad(months)}:${pad(days)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
