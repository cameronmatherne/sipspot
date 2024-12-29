import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

import axios from 'axios';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


const apiKey = 'AIzaSyB9RznnpXAou3Aa0s4qUXxt7EVMd2lqftA';
const latitude = 30.2239;
const longitude = -92.0171917;
const radius = 80467; // 50 miles in meters
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${apiKey}`;

export async function get() {
  try {
    const response = await axios.get(url);
    const restaurants = response.data.results;

    // Loop through each restaurant and insert into Supabase
    for (const restaurant of restaurants) {
      const {
        name,
        geometry: { location },
        rating,
        price_level,
        user_ratings_total,
        opening_hours,
        photos,
        place_id,
        types,
        vicinity
      } = restaurant;

      // Prepare photo reference (if exists)
      const photo_reference = photos && photos.length > 0 ? photos[0].photo_reference : null;

      // Insert restaurant into Supabase
      const { data, error } = await supabase
      .from('restaurants')
      .upsert([
        {
          name, 
          latitude: location.lat, 
          longitude: location.lng, 
          rating, 
          price_level, 
          user_ratings_total, 
          opening_hours: opening_hours ? opening_hours.open_now : null, 
          photo_reference, 
          place_id, 
          types: Array.isArray(types) ? types : types.split(','),  // Ensure types is an array
          address: vicinity
        }
      // @ts-ignore
      ], { onConflict: ['place_id'] });

      if (error) {
        console.error('Error inserting data into Supabase:', error);
      } else {
        console.log('Restaurant successfully inserted:', name);
      }
    }

    return {
      status: 200,
      body: { message: 'Restaurants successfully inserted into Supabase.' }
    };
  } catch (error) {
    console.error('Error fetching or inserting restaurants:', error);
    return {
      status: 500,
      body: { message: 'Error fetching or inserting restaurants.' }
    };
  }
}
