/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (degree: number) => degree * (Math.PI / 180);

  // Convert latitude and longitude from degrees to radians
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Differences in coordinates
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  // Haversine formula
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of the Earth in meters (mean value)
  const R = 6371000;

  // Calculate the distance in meters
  return R * c;
};
