<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h4>
          Locations
          <RouterLink to="/locations/add" class="btn btn-primary float-end">
            Add Location
          </RouterLink>
        </h4>
      </div>
      <div class="card-body">
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(location, index) in locations" :key="index">
              <td>{{ location.id }}</td>
              <td>{{ location.location_name }}</td>
              <td>{{ location.location_lat }}</td>
              <td>{{ location.location_lon }}</td>
              <td>{{ location.location_desc }}</td>
              <td>
                <RouterLink :to="'locations/' + location.id + '/edit'" class="btn btn-success">
                  Edit
                </RouterLink>
                <button type="button" @click="deletelocation(location.id)" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-if="locations.length === 0">
            <tr>
              <td colspan="6">No data available or loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'locations',
  data() {
    return {
      locations: [],
      successMessage: "",
    };
  },
  mounted() {
    this.getlocations();
  },
  methods: {
    getlocations() {
      axios.get('http://localhost:3300/locations').then(res => {
        this.locations = res.data;
      });
    },
    deletelocation(locationID) {
      axios.delete(`http://localhost:3300/locations/${locationID}`)
        .then(res => {
          this.successMessage = 'location successfully deleted.';
          this.getlocations();
        })
        .catch(error => {
          console.error('Error deleting location:', error);
          this.successMessage = 'Error deleting location.';
        });
    }
  }
};
</script>
