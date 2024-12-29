<script lang="ts">
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';
  
    const mapboxAccessToken = 'pk.eyJ1IjoiY2FtZXJvbm1hdGhlcm5lIiwiYSI6ImNtNTl4bGU5NzRlMDgybG9veDVtc3lkd3oifQ.Y_p-yXHOlu_KLHI8r5AH6Q';
  
    let mapContainer: HTMLDivElement | null = null;
    let map: mapboxgl.Map;
    let sidebarExpanded = true; 
  
    onMount(() => {
      if (mapContainer) {
        mapboxgl.accessToken = mapboxAccessToken;

        map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Initial map center
        zoom: 9,
        });
  

        new mapboxgl.Marker()
          .setLngLat([-74.5, 40])
          .addTo(map);
      }
    });

    const toggleSidebar = () => {
        sidebarExpanded = !sidebarExpanded;
    };

    const goToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo({
            center: [longitude, latitude],
            zoom: 14, // Zoom level when focusing on the current location
            essential: true, // Ensure animation is smooth
          });
        },
        (error) => {
          alert('Could not retrieve your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };


</script>


<style>
  /* Basic styles for the page layout */
  .page-container {
    display: flex;
    height: 100vh;
    position: relative;  /* Position relative to keep the sidebar overlay in place */
  }

  /* The map container */
  .map-container {
    flex: 1;
    position: relative;
  }

  /* Sidebar style */
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    background-color: #2f2f2f;
    color: white;
    transition: all 0.3s ease;
    padding: 15px;
    height: 100%;
    z-index: 10; /* Ensure sidebar stays on top of the map */
  }

  /* If the sidebar is minimized */
  .sidebar.collapsed {
    width: 50px;  /* Narrow width when collapsed */
  }

  /* Sidebar toggle button style */
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

  .location-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    z-index: 20; /* Make sure it stays on top of the map */
    cursor: pointer;
  }
  

  /* Map styles */
  #map {
    width: 100%;
    height: 100%;
  }
</style>

  
<div class="page-container">
    <!-- Sidebar with toggle button -->
    <div class={`sidebar ${sidebarExpanded ? '' : 'collapsed'}`}>
      <button class="toggle-btn" on:click={toggleSidebar}>
        {sidebarExpanded ? '←' : '→'}
      </button>
      <!-- You can add more content or links here as needed -->
    </div>
  
    <!-- Map container -->
    <div class="map-container">
      <div bind:this={mapContainer} id="map"></div>
      <button class="location-btn" on:click={goToCurrentLocation}>
        My Location
      </button>
    </div>
  </div>