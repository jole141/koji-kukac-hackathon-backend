const DUMMY_ADDRESSES = [
  'Ulica Ljudevita Posavskog 31, 10000, Zagreb',
  'Ulica grada Vukovara 269d, 10000, Zagreb',
  'Ulica Josip Kozarca 12, 10000, Zagreb',
  'Ulica grada Vukovara 269a, 10000, Zagreb',
  'Zagrebačka ulica 223, 10000, Zagreb',
];

// Problem with api rate limit
export async function getAddressFromLongLat(longitude: number, latitude: number) {
  // const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAP_BOX_API_KEY}`);
  // const data = res.data;
  // return data.features[0].place_name;
  const randomIndex = Math.floor(Math.random() * 5);
  return DUMMY_ADDRESSES[randomIndex];
}
