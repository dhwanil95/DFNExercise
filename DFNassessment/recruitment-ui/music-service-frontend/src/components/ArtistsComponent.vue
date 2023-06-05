<template>
  <!-- Define the component's template -->
  <div>
    <!-- Filter input fields and associated buttons -->
    <div class="filter-container">
      <!-- Input fields to filter by ID and Name -->
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
    <PaginatedAgGrid :data="data" apiEndpoint="http://localhost:5000/artists" />

    <!-- Modal for sorting -->
    <SortModal
      v-if="isSortModalOpen"
      :availableFields="columnDefs.map((column) => column.field)"
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

export default {
  name: "ArtistsComponent",
  components: {
    PaginatedAgGrid,
    SortModal,
  },

  // Define the reactive data properties
  data() {
    return {
      isSortModalOpen: false, // Boolean to control the visibility of the sorting modal
      columnDefs: [{ field: "id" }, { field: "name" }], // Definition of the columns for the ag-grid
    };
  },
  methods: {
    // Method to open the sort modal
    openSortModal() {
      this.isSortModalOpen = true;
    },

    // Method to close the sort modal
    closeSortModal() {
      this.isSortModalOpen = false;
    },
    applySort(sortParams) {
      const { field, order } = sortParams;

      // Make the API call with the sort parameters
      api
        .get("artists", { params: { _sort: field, _order: order } })
        .then((response) => {
          // Handle the response and update the data
          this.data = response.data;
        })
        .catch((error) => {
          // Handle the error
          console.error("Error applying sort:", error);
        });
    },
  },
  setup() {
    // Define the setup function to prepare reactive properties and functions
    const filters = ref({ id: "", name: "" }); // Filters for the grid data
    const data = ref([]); // Array to hold the grid data
    const sortParams = ref({ field: null, order: null });

    // Fetch data from the API, applying any filters
    const fetchData = async (filtered = false) => {
      let filterParams = {};

      if (filtered) {
        // Include only those fields that are not an empty string
        for (let field in filters.value) {
          if (filters.value[field] !== "") {
            filterParams[field] = filters.value[field];
          }
        }
      }
      const [artistsResponse] = await Promise.all([
        api.get("artists", { params: filterParams }),
      ]);
      data.value = artistsResponse.data.map((artist) => ({
        id: artist.id,
        name: artist.name,
      }));
    };

    // Compute the filtered data based on the current filters
    const filteredData = computed(() => {
      if (filters.value.name !== "") {
        return data.value.filter((item) =>
          item.name.includes(filters.value.name)
        );
      } else {
        return data.value;
      }
    });

    // Clear all filters and fetch data
    const clearFilters = () => {
      filters.value = { id: "", name: "" };
      sortParams.value = { field: null, order: null }; // reset sortParams to default
      fetchData();
    };

    // When the component is mounted, fetch the initial data
    onMounted(() => fetchData());

    return { data, filters, fetchData, clearFilters, filteredData };
  },
};
</script>
