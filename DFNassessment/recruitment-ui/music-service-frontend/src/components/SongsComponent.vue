<template>
  <!-- Input fields for filtering data -->
  <div class="filter-container">
    <!-- Filter by ID -->
    <input
      class="filter-input"
      type="text"
      v-model="filters.id"
      placeholder="Filter by ID"
    />
    <!-- Filter by Name -->
    <input
      class="filter-input"
      type="text"
      v-model="filters.name"
      placeholder="Filter by Name"
    />
    <!-- Filter by Album Name -->
    <input
      class="filter-input"
      type="text"
      v-model="filters.album"
      placeholder="Filter by Album Name"
    />
    <!-- Filter by Track -->
    <input
      class="filter-input"
      type="text"
      v-model="filters.track"
      placeholder="Filter by Track"
    />
    <!-- Button to execute the filter -->
    <button class="filter-button" @click="fetchData(true)">Filter</button>
    <!-- Button to clear the filter fields -->
    <button class="filter-button clear-button" @click="clearFilters">
      Clear Filters
    </button>
  </div>

  <!-- Button to open the sort modal -->
  <button class="filter-button" @click="openSortModal">Implement Sort</button>

  <!-- Paginated Grid Component to display song data -->
  <PaginatedAgGrid
    :data="filteredData"
    :columnDefs="songsColumnDefs"
    apiEndpoint="http://localhost:5000/songs"
    :currentPage="currentPage"
    :pageSize="pageSize"
    :onRowDataUpdate="handleRowDataUpdate"
    :modifier="modifySongsData"
    :processedData="processedSongData"
    @data-to-song="handleDataInSong"
    @update-page-size="updatePageSize"
    @page-changed="fetchData"
  />

  <!-- Modal to implement sorting -->
  <SortModal
    v-if="isSortModalOpen"
    :availableFields="songsColumnDefs.map((column) => column.field)"
    @apply-sort="applySort"
    @close="closeSortModal"
  />
</template>

<script>
import api from "../api";
import PaginatedAgGrid from "../shared/PaginatedAgGrid.vue";
import { ref, computed, onMounted } from "vue";
import "./style.css";
import SortModal from "../shared/SortModal.vue";
import axios from "axios";

export default {
  name: "SongsComponent",
  components: {
    PaginatedAgGrid,
    SortModal,
  },
  data() {
    // Initial data and state setup
    return {
      isSortModalOpen: false,
      pageSize: 10,
      processedSongData: [],
      songsColumnDefs: [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Name" },
        { field: "album", headerName: "Album Name" },
        { field: "track", headerName: "Track" },
      ],
      albums: {},
    };
  },
  methods: {
    async handleDataInSong(data) {
      // Fetch album names for song data and add to the songs data
      const albumIds = data.map((song) => song.album_id);
      const albumResponse = await axios.get("http://localhost:5000/albums", {
        params: {
          id: albumIds,
        },
      });
      const albums = albumResponse.data.reduce((obj, album) => {
        obj[album.id] = album.name;
        return obj;
      }, {});
      const returnData = data.map((song) => ({
        id: song.id,
        name: song.name,
        album: albums[song.album_id] || "",
        track: song.track,
      }));
      this.processedSongData = returnData;
    },
    handleRowDataUpdate(data) {
      // Update the processed song data when row data updates
      this.processedSongData = data;
    },
    async modifySongsData(response) {
      // Modify the songs data to include the album names
      try {
        return response.data.map((song) => ({
          id: song.id,
          name: song.name,
          album: this.albums[song.album_id] || "",
          track: song.track,
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    openSortModal() {
      // Open the sorting modal
      this.isSortModalOpen = true;
    },
    closeSortModal() {
      // Close the sorting modal
      this.isSortModalOpen = false;
    },
    updatePageSize(newPageSize) {
      // Update the number of rows per page and fetch data accordingly
      this.pageSize = newPageSize;
      this.fetchData(1, newPageSize);
    },
  },
  async created() {
    // Fetch album data and set up initial data when component is created
    const albumResponse = await axios.get("http://localhost:5000/albums");

    this.albums = albumResponse.data.reduce((obj, album) => {
      obj[album.id] = album.name;
      return obj;
    }, {});

    this.fetchData();
  },
  setup() {
    // Set up reactive variables and methods
    const filters = ref({ id: "", name: "", album: "", track: "" });
    const data = ref([]);
    const sortParams = ref({ field: null, order: null });
    const albums = ref({});

    // Fetch data according to filters and sorting parameters
    const fetchData = async (filtered = false) => {
      let requestParams = {};

      // Apply sorting parameters if available
      if (sortParams.value.field) {
        requestParams._sort = sortParams.value.field;
        requestParams._order = sortParams.value.order;
      }

      // Apply filters if available
      if (filtered) {
        for (let field in filters.value) {
          if (filters.value[field] !== "" && field !== "artist") {
            requestParams[field] = filters.value[field];
          }
        }
      }

      const songsResponse = await api.get("songs", { params: requestParams });

      data.value = songsResponse.data.map((song) => ({
        id: song.id,
        name: song.name,
        album: albums.value[song.album_id] || "",
        track: song.track,
      }));
    };

    // Apply new sorting parameters and fetch data accordingly
    const applySort = (newSortParams) => {
      sortParams.value = newSortParams;
      fetchData();
    };

    // Clear filters and fetch data without filters
    const clearFilters = () => {
      filters.value = { id: "", name: "", album: "", track: "" };
      sortParams.value = { field: null, order: null }; // reset sortParams to default
      fetchData();
    };

    // Compute filtered data according to the current filters
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

    // On component mount, fetch album data and song data
    onMounted(async () => {
      const albumsResponse = await api.get("albums");
      albums.value = albumsResponse.data.reduce((obj, album) => {
        obj[album.id] = album.name;
        return obj;
      }, {});
      fetchData();
    });

    return { data, filters, fetchData, applySort, clearFilters, filteredData };
  },
};
</script>
