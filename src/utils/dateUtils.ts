/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns the current date as a YYYY-MM-DD string adjusted for local timezone.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
}

/**
 * Formats a YYYY-MM-DD string into a warm, readable Russian date.
 * E.g., "2026-05-30" -> "30 мая 2026 г."
 */
export function formatRussianDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Calculates the number of full days passed since the sobriety start date.
 * If today is the start date, it is considered day 0 (or day 1 depending on convention - let's make it friendly: e.g. "Идет 1-й день твоей трезвости" if it's today!)
 */
export function getDaysSince(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  // Set times to midnight to calculate full days list
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
