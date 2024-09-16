<template>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h4>Add Location</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="">ID</label>
            <input type="text" v-model="model.id" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="">Name</label>
            <input type="text" v-model="model.location_name" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="">Latitude</label>
            <input type="text" v-model="model.location_lat" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="">Longitude</label>
            <input type="text" v-model="model.location_lon" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="">Description</label>
            <input type="text" v-model="model.location_desc" class="form-control" />
          </div>
          <div class="mb-3">
            <button type="button" @click="savelocations" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
      
      <div v-if="showSuccessMessage" class="alert alert-success mt-3">
        Location successfully added!
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'locationAdd',
    data() {
      return {
        model: {
          id: '',
          location_name: '',
          location_lat: '',
          location_lon: '',
          location_desc: '',
        },
        showSuccessMessage: false,
      };
    },
    methods: {
      savelocations() {
        axios
          .post('http://localhost:3300/locations', this.model)
          .then((res) => {
            console.log(res.data);
            this.showSuccessMessage = true;
            this.model = {
              id: '',
              location_name: '',
              location_lat: '',
              location_lon: '',
              location_desc: '',
            };
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          })
          .catch((error) => {
            console.error('location add error:', error);
          });
      },
    },
  };
  </script>
  