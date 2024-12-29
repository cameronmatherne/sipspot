import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const googleApiKey = 'AIzaSyB9RznnpXAou3Aa0s4qUXxt7EVMd2lqftA';

export const GET: RequestHandler = async ({ url }) => {
  const latitude = url.searchParams.get('latitude');
  const longitude = url.searchParams.get('longitude');
  const radius = 25000; // 25km
  const type = 'restaurant';

  if (!latitude || !longitude) {
    return json({ error: 'Latitude and Longitude are required.' }, { status: 400 });
  }

  const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${googleApiKey}`;

  try {
    const response = await fetch(googlePlacesUrl);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`);
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Error fetching Google Places data:', error);
    return json({ error: 'Failed to fetch data from Google Places API.' }, { status: 500 });
  }
};
