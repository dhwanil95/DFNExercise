<template>
  <!-- Define the component's template -->
  <div>
    <!-- Filter input fields and associated buttons -->
    <div class="filter-container">
      <input
        class="filter-input"
        type="text"
        v-model="filters.id"
        placeholder="Filter by ID"
      />
      <input
        class="filter-input"
        type="text"
        v-model="filters.name"
        placeholder="Filter by Name"
      />
      <input
        class="filter-input"
        type="text"
        v-model="filters.artist"
        placeholder="Filter by Artist Name"
      />
      <input
        class="filter-input"
        type="text"
        v-model="filters.year_released"
        placeholder="Filter by Year Released"
      />

      <!-- Button to apply the filters -->
      <button class="filter-button" @click="fetchData(true)">Filter</button>

      <!-- Button to clear the filters -->
      <button class="filter-button clear-button" @click="clearFilters">
        Clear Filters
      </button>
    </div>

    <!-- Button to open the sorting modal -->
    <button class="filter-button" @click="openSortModal">Implement Sort</button>

    <!-- Ag-Grid component for paginated data display -->
    <PaginatedAgGrid
      :data="filteredData"
      :columnDefs="albumsColumnDefs"
      apiEndpoint="http://localhost:5000/albums"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :modifier="modifyAlbumsData"
      @update-page-size="updatePageSize"
      @page-changed="fetchData"
    />

    <!-- Modal for sorting -->
    <SortModal
      v-if="isSortModalOpen"
      :availableFields="albumsColumnDefs.map((column) => column.field)"
      @apply-sort="applySort"
      @close="closeSortModal"
    />
  </div>
</template>

<script>
import api from "../api";
import PaginatedAgGrid from "../shared/PaginatedAgGrid.vue";
import { ref, computed, onMounted } from "vue";
import "./style.css";
import SortModal from "../shared/SortModal.vue";
import axios from "axios";

export default {
  name: "AlbumsComponent",
  components: {
    PaginatedAgGrid,
    SortModal,
  },
  data() {
    return {
      isSortModalOpen: false, // Boolean to control the visibility of the sorting modal
      albumsColumnDefs: [
        // Definition of the columns for the ag-grid
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name" },
        { field: "artist", headerName: "Artist" },
        { field: "year_released", headerName: "Year Released" },
      ],
      artists: {}, // Object to hold the artists data
    };
  },
  methods: {
    // Method to process the response from the API and map the artist ID to artist name
    async modifyAlbumsData(response) {
      try {
        return response.data.map((album) => ({
          id: album.id,
          name: album.name,
          artist: this.artists[album.artist_id] || "", // Use the stored album data
          year_released: album.year_released,
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    // Method to open the sort modal
    openSortModal() {
      this.isSortModalOpen = true;
    },

    // Method to close the sort modal
    closeSortModal() {
      this.isSortModalOpen = false;
    },

    // Method to update the page size and fetch data accordingly
    updatePageSize(newPageSize) {
      this.pageSize = newPageSize;
      this.fetchData(1, newPageSize);
    },
  },
  async created() {
    // Fetch album data when the component is created and store it in the component's data
    const artistsResponse = await axios.get("http://localhost:5000/artists");

    // Reduce the array of artists into an object where the artist ID is the key and artist name is the value
    this.artists = artistsResponse.data.reduce((obj, artist) => {
      obj[artist.id] = artist.name;
      return obj;
    }, {});

    // Fetch the initial album data
    this.fetchData();
  },
  setup() {
    // Set up reactive data properties
    const filters = ref({ id: "", name: "", artist: "", year_released: "" });
    const data = ref([]);
    const sortParams = ref({ field: null, order: null }); // new reference for sort parameters
    const artists = ref({}); // New reference for storing album data

    // Fetch data from the API, applying any filters and sort parameters
    const fetchData = async (filtered = false) => {
      let requestParams = {};

      if (sortParams.value.field) {
        requestParams._sort = sortParams.value.field;
        requestParams._order = sortParams.value.order;
      }

      if (filtered) {
        for (let field in filters.value) {
          if (filters.value[field] !== "" && field !== "artist") {
            requestParams[field] = filters.value[field];
          }
        }
      }

      const albumsResponse = await api.get("albums", { params: requestParams });

      data.value = albumsResponse.data.map((album) => ({
        id: album.id,
        name: album.name,
        artist: artists.value[album.artist_id] || "", // Use the stored album data
        year_released: album.year_released,
      }));
    };

    // Apply the selected sort parameters and fetch data
    const applySort = (newSortParams) => {
      sortParams.value = newSortParams;
      fetchData();
    };

    // Clear all filters and fetch data
    const clearFilters = () => {
      filters.value = { id: "", name: "", artist: "", year_released: "" };
      sortParams.value = { field: null, order: null }; // reset sortParams to default
      fetchData();
    };

    // Compute the filtered data based on the current filters
    const filteredData = computed(() => {
      let result = data.value;
      for (let field in filters.value) {
        if (filters.value[field] !== "") {
          result = result.filter((item) => {
            const value = item[field];
            return value.toString().includes(filters.value[field]);
          });
        }
      }
      return result;
    });

    // When the component is mounted, fetch the artists data and the initial album data
    onMounted(async () => {
      const artistsResponse = await api.get("artists");
      artists.value = artistsResponse.data.reduce((obj, artist) => {
        obj[artist.id] = artist.name;
        return obj;
      }, {});
      fetchData();
    });

    return { data, filters, fetchData, applySort, clearFilters, filteredData };
  },
};
</script>
