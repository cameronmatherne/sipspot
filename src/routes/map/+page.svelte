<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";

  const mapboxAccessToken =
    "pk.eyJ1IjoiY2FtZXJvbm1hdGhlcm5lIiwiYSI6ImNtNTl4bGU5NzRlMDgybG9veDVtc3lkd3oifQ.Y_p-yXHOlu_KLHI8r5AH6Q";
  const google_key = "AIzaSyB9RznnpXAou3Aa0s4qUXxt7EVMd2lqftA";

  let restaurants: any[] = [];
  let mapContainer: HTMLDivElement | null = null;
  let map: mapboxgl.Map;
  let sidebarExpanded = true;
  let currentMarker: mapboxgl.Marker | null = null;

  const initializeMap = (latitude: number, longitude: number) => {
    if (!mapContainer) return;

    mapboxgl.accessToken = mapboxAccessToken;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 14,
    });

    currentMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
  };

  onMount(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("Latitude: " + latitude + ", Longitude: " + longitude);

          initializeMap(latitude, longitude);

          await fetchRestaurants(latitude, longitude);
          addRestaurantMarkers(restaurants);
        },
        (error) => {
          console.error("Geolocation error:", error);
          initializeMap(40, -74.5);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
      initializeMap(40, -74.5);
    }
  });

  const fetchRestaurants = async (latitude: number, longitude: number) => {
    const radius = 25 * 1609.34; // 25 miles in meters
    const type = "restaurant";
    const googleKey = google_key;

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${google_key}`
    );

    const data = await res.json();

    return data.results;
  };

  const addRestaurantMarkers = (restaurants: any[]) => {
    restaurants.forEach((restaurant) => {
      const { lat, lng } = restaurant.geometry.location;

      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${restaurant.name}</h3><p>${restaurant.vicinity}</p>`
          )
        )
        .addTo(map);
    });
  };

  const toggleSidebar = () => {
    sidebarExpanded = !sidebarExpanded;
  };

  const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (map) {
            map.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              essential: true,
            });

            if (currentMarker) {
              currentMarker.setLngLat([longitude, latitude]);
            }
          }
        },
        (error) => {
          alert("Could not retrieve your location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
</script>

<div class="page-container">
  <div class={`sidebar ${sidebarExpanded ? "" : "collapsed"}`}>
    <button class="toggle-btn" on:click={toggleSidebar}>
      {sidebarExpanded ? "←" : "→"}
    </button>
    <div class="sidebar-content">
      <h2>Nearby Restaurants</h2>
      {#each restaurants as restaurant}
        <div class="restaurant-item">
          <h3>{restaurant.name}</h3>
          <p>{restaurant.vicinity}</p>
        </div>
      {/each}
    </div>
  </div>

  <div class="map-container">
    <div bind:this={mapContainer} id="map"></div>

    <button class="location-btn" on:click={goToCurrentLocation}>
      Re-Center
    </button>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    height: 100vh;
    position: relative;
  }

  .map-container {
    flex: 1;
    position: relative;
  }

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    background-color: #2f2f2f;
    color: white;
    transition: all 0.3s ease;
    padding: 15px;
    height: 100%;
    z-index: 10;
  }

  .sidebar.collapsed {
    width: 50px;
  }

  .sidebar.collapsed .sidebar-content {
    display: none;
  }

  .toggle-btn {
    position: absolute;
    top: 15px;
    right: -25px;
    background-color: #444;
    color: white;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 5px;
  }

  #map {
    width: 100%;
    height: 100%;
  }

  .location-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    z-index: 20;
    cursor: pointer;
  }
</style>
