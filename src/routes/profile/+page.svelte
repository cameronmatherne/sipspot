<h1> User Profile</h1>
<h2> Saved Restauraunts: </h2>

<script lang="ts">
    export let restaurants: { id: string; name: string; address: string; lat: number; lng: number }[];
</script>

  <ul>
    {#each restaurants as restaurant}
        <li>
            <h2>{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <p>Lat: {restaurant.lat}, Lng: {restaurant.lng}</p>
        </li>
    {/each}
  </ul>

