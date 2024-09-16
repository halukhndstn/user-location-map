<template>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h4>Edit Location</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="locationName">Name of Place</label>
            <input type="text" v-model="model.location_name" id="locationName" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="locationLat">Latitude of Place</label>
            <input type="text" v-model="model.location_lat" id="locationLat" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="locationLon">Longitude of Place</label>
            <input type="text" v-model="model.location_lon" id="locationLon" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="locationDesc">Description of Place</label>
            <input type="text" v-model="model.location_desc" id="locationDesc" class="form-control" />
          </div>
          <div class="mb-3">
            <button type="button" @click="updatelocation" class="btn btn-primary">Save</button>
          </div>
          
        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'locationEdit',
    data() {
      return {
        locationID: "",
        model: {
          id: "",
          location_name: "",
          location_lat: "",
          location_lon: "",
          location_desc: "",
        },
        successMessage: "",
      };
    },
  
    mounted() {
      this.locationID = this.$route.params.id;
      this.getlocationData(this.locationID);
    },
  
    methods: {
      getlocationData(locationID) {
        axios.get(`http://localhost:3300/locations/${locationID}`)
          .then(res => {
            if (res.data) {
              this.model.id = res.data.id;
              this.model.location_name = res.data.location_name;
              this.model.location_lat = res.data.location_lat;
              this.model.location_lon = res.data.location_lon;
              this.model.location_desc = res.data.location_desc;
            }
          })
          .catch(error => {
            console.error('Error fetching location data:', error);
          });
      },
  
      updatelocation() {
        if (!this.locationID) {
          console.error('location ID is undefined.');
          return;
        }
  
        axios.put(`http://localhost:3300/locations/${this.locationID}`, this.model)
          .then(res => {
            console.log('location updated successfully:', res.data);
            this.successMessage = 'Place successfully updated.';
          })
          .catch(error => {
            console.error('location update error:', error);
            this.successMessage = 'Error updating location.';
          });
      },
    },
  };
  </script>
  