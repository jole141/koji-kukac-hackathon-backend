import axios from 'axios';
import { MAP_BOX_API_KEY } from '@config';

export async function getAddressFromLongLat(longitude: number, latitude: number) {
  const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAP_BOX_API_KEY}`);
  const data = res.data;
  return data.features[0].place_name;
}
