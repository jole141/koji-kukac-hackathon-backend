import { INITIAL_DAY } from '../config';

export function customDataDateOffset() {
  const currentDate = new Date();
  const initialDate = new Date(INITIAL_DAY);
  const diffTime = currentDate.getTime() - initialDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  return diffDays * 48 + (currentHour - initialDate.getHours() + 1) * 2 + (currentMinute >= 30 ? 1 : 0);
}
