<template>
  <div
    class="modal"
    tabindex="-1"
    role="dialog"
    v-bind:class="{ show: isOpen }"
    style="display: block"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Implement Sort</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="sortField">Sort Field:</label>
            <select id="sortField" class="form-control" v-model="selectedField">
              <option value="">Select Field</option>
              <!-- Iterate over available fields and populate options -->
              <option
                v-for="field in availableFields"
                :key="field"
                :value="field"
              >
                {{ field }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="sortOrder">Sort Order:</label>
            <select id="sortOrder" class="form-control" v-model="selectedOrder">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="applySort">
            Apply Sort
          </button>
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SortModal",
  props: ["isOpen", "availableFields"],
  data() {
    return {
      selectedField: "",
      selectedOrder: "asc",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    applySort() {
      if (this.selectedField) {
        const sortParams = {
          field: this.selectedField,
          order: this.selectedOrder,
        };
        // Emit event with sortParams to be handled by the parent component
        this.$emit("apply-sort", sortParams);
        this.closeModal();
      }
    },
  },
};
</script>
