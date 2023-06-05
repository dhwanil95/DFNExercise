<template>
  <!-- Root element -->
  <div>
    <!-- Page size selection component -->
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between">
        <div>
          <br />
          <label for="pageSize" class="me-2 align-self-center"
            >Page Size:</label
          >
          <!-- Dropdown for selecting the page size -->
          <select
            id="pageSize"
            class="form-select"
            style="width: auto"
            v-model="pageSize"
            @change="updatePageSize"
          >
            <!-- Options for page sizes -->
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
    <!-- ag-Grid component for displaying data -->
    <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      @grid-ready="onGridReady"
    >
    </ag-grid-vue>
    <!-- Pagination buttons -->
    <div class="row mt-3">
      <div class="col-12 d-flex justify-content-center">
        <!-- Button to navigate to the first page -->
        <button @click="goToFirstPage()" :disabled="currentPage === 1">
          First
        </button>
        <!-- Button to navigate to the previous page -->
        <button @click="goToPreviousPage()" :disabled="currentPage === 1">
          Prev
        </button>
        <!-- Button to navigate to the next page -->
        <button @click="goToNextPage()" :disabled="currentPage === lastPage">
          Next
        </button>
        <!-- Button to navigate to the last page -->
        <button @click="goToLastPage()" :disabled="currentPage === lastPage">
          Last
        </button>
      </div>
    </div>
    <!-- Pagination status text -->
    <div class="row mt-3">
      <div class="col-12 d-flex justify-content-center">
        <!-- Current page status -->
        <span>{{ paginationText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

export default {
  name: "PaginatedAgGrid",
  components: {
    AgGridVue,
  },

  // Prop validation and default values
  props: {
    data: {
      type: Array,
      required: true,
    },
    apiEndpoint: {
      type: String,
      required: true,
    },
    modifier: {
      type: Function,
      default: (response) => response.data,
    },
  },
  data() {
    return {
      columnDefs: [],
      rowData: [],
      pageSize: 10,
      currentPage: 1,
      lastPage: 1,
      totalItems: 0,
      gridApi: null,
      columnApi: null,
      selectedTab: "",
    };
  },
  computed: {
    // Computed properties for the grid and pagination status
    gridOptions() {
      return {
        pagination: false, // remove built-in client-side pagination
        defaultColDef: {
          sortable: true,
          filter: true,
          cellStyle: {
            backgroundColor: "#fafafa",
            color: "#333",
            border: "1px solid #ddd",
          },
          headerCellStyle: {
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #ddd",
          },
        },
      };
    },

    // Computed property for displaying the current pagination status
    paginationText() {
      const firstItem = (this.currentPage - 1) * this.pageSize + 1;
      const lastItem = Math.min(
        this.currentPage * this.pageSize,
        this.totalItems
      );
      return `Showing ${firstItem} to ${lastItem} of ${this.totalItems}`;
    },
  },
  methods: {
    // Method for updating the page size
    updatePageSize() {
      this.$emit("update-page-size", this.pageSize);
      this.fetchData(this.currentPage);
      if (this.currentPage > this.lastPage) {
        this.fetchData(this.lastPage);
      }
    },

    // Method for fetching the data
    async fetchData(page) {
      try {
        const response = await axios.get(this.apiEndpoint, {
          params: {
            _page: page,
            _limit: this.pageSize,
          },
        });
        if (this.selectedTab == "songs") {
          const albumIds = response.data.map((song) => song.album_id);
          const albumResponse = await axios.get(
            "http://localhost:5000/albums",
            {
              params: {
                id: albumIds,
              },
            }
          );
          const albums = albumResponse.data.reduce((obj, album) => {
            obj[album.id] = album.name;
            return obj;
          }, {});
          this.rowData = response.data.map((song) => ({
            id: song.id,
            name: song.name,
            album: albums[song.album_id] || "",
            track: song.track,
          }));
        } else if (this.selectedTab == "albums") {
          const artistIds = response.data.map((album) => album.artist_id);
          const artistResponse = await axios.get(
            "http://localhost:5000/artists",
            {
              params: {
                id: artistIds,
              },
            }
          );
          const artists = artistResponse.data.reduce((obj, artist) => {
            obj[artist.id] = artist.name;
            return obj;
          }, {});
          this.rowData = response.data.map((album) => ({
            id: album.id,
            name: album.name,
            artist: artists[album.artist_id] || "",
            year_released: album.year_released,
          }));
        } else {
          this.rowData = response.data;
        }
        this.totalItems = parseInt(response.headers["x-total-count"]);
        this.lastPage = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = page;
        this.isLoading = false;
        this.setColumnDefs();
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
    },

    paginationChange(page, pageSize) {
      this.currentPage = page;
      this.pageSize = pageSize;
      this.fetchData(page, pageSize);
    },

    // Navigation methods for the pagination
    goToFirstPage() {
      this.fetchData(1);
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.fetchData(this.currentPage); // fetch new data when changing page
      }
    },
    goToNextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage += 1;
        this.fetchData(this.currentPage); // fetch new data when changing page
      }
    },

    goToLastPage() {
      this.fetchData(this.lastPage);
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },

    // Helper methods for text formatting
    capitalize(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    uppercase(str) {
      return str.toUpperCase().replace(/_/g, " ");
    },
    setColumnDefs() {
      // Set column definitions based on the first row of the dat
      if (this.data.length > 0) {
        const firstRow = this.data[0];
        this.columnDefs = Object.keys(firstRow).map((key) => ({
          headerName: this.uppercase(key),
          field: key,
        }));
        if (
          this.columnDefs[2]?.headerName == "ALBUM" &&
          this.columnDefs[3]?.headerName == "TRACK"
        ) {
          this.selectedTab = "songs";
        }
        if (
          this.columnDefs[2]?.headerName == "ARTIST" &&
          this.columnDefs[3]?.headerName == "YEAR RELEASED"
        ) {
          this.selectedTab = "albums";
        }
      }
    },
  },

  // Fetch the data on component mount
  mounted() {
    this.fetchData(1);
  },

  // Watch the data prop for changes
  watch: {
    data: {
      immediate: true,
      handler() {
        this.rowData = this.data.slice(0, this.pageSize);
        this.setColumnDefs();
      },
    },
  },
};
</script>

<style scoped>
.ag-theme-alpine {
  height: calc(100vh - 200px);
  width: 100%;
  font-size: 14px;
}

.ag-header-cell {
  color: #fff;
  background-color: #333;
  text-align: center;
  font-weight: bold;
  border-right: 1px solid #ddd;
  border-bottom: 2px solid #ddd;
  padding: 10px;
  text-transform: capitalize;
}

.ag-row {
  color: #333;
  text-align: center;
  background-color: #fafafa;
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.ag-cell {
  border-right: 1px solid #ddd;
  padding: 10px;
}

/* Media queries for responsiveness */
@media only screen and (max-width: 600px) {
  .ag-theme-alpine {
    height: 500px;
  }
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.mt-3 {
  margin-top: 1.5rem;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.align-self-center {
  align-self: center;
}
</style>
