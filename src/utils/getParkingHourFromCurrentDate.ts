export function getParkingHourFromCurrentDate() {
  const currentDate = new Date();
  return currentDate.getMinutes() % 30;
}
