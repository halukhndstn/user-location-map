<template>
  <div id="map"></div>
</template>

<script>
export default {
  name: "LocationsMap",
  mounted() {
   
    var myMap = L.map('map').setView([39.44526161087054, 35.31111709079875], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(myMap);

    fetch('http://localhost:3300/locations')
      .then(response => response.json())
      .then(data => {
        data.forEach(locations => {
          var marker = L.marker([locations.location_lat, locations.location_lon]).addTo(myMap);

          marker.bindPopup((`<h4><b>${locations.location_name}</b></h4><hr>
          <b>Latitude:</b> ${locations.location_lat}<br>
          <b>Longitude:</b> ${locations.location_lon}<br><hr>
          ${locations.location_desc || 'No description'}`));
        });
      })
      .catch(error => console.error('Error:', error));
  }
}
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100vw;
}

body {
  padding: 0;
  margin: 0;
}

html, body {
  height: 100%;
  width: 100%;
}
</style>
