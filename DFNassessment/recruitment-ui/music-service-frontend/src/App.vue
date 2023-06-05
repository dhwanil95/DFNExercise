<template>
  <!-- Main component's div with an id of 'app' -->
  <div id="app" class="m-0 p-0">
    <!-- Header section of the page -->
    <div class="header pb-4">
      <!-- Title of the page -->
      <h2 class="card-title">MUSIC INFORMATION</h2>
    </div>
    <!-- A card containing the tabs and their content -->
    <div class="card">
      <!-- Navigation tabs for Artists, Albums and Songs -->
      <ul class="nav nav-tabs pt-3">
        <!-- Artists navigation tab -->
        <li class="nav-item">
          <router-link class="nav-link" to="/artists">Artists</router-link>
        </li>
        <!-- Albums navigation tab -->
        <li class="nav-item">
          <router-link class="nav-link" to="/albums">Albums</router-link>
        </li>
        <!-- Songs navigation tab -->
        <li class="nav-item">
          <router-link class="nav-link" to="/songs">Songs</router-link>
        </li>
      </ul>
      <!-- Card body containing the tab content -->
      <div class="card-body">
        <!-- Container for tab content, which is populated by the router -->
        <div class="tab-content pt-3">
          <!-- Router outlet where the content of the current route is displayed -->
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Styles applied to the HTML and body tags */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Main app component style */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Styling for the navigation tabs */
.nav-tabs {
  display: flex;
  justify-content: start;
  list-style-type: none;
  padding: 0;
}

/* Styling for each individual navigation link */
.nav-tabs .nav-item .nav-link {
  border: 1px solid #ddd;
  border-radius: 15px 15px 0 0;
  font-weight: bold;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 0 5px 0 0;
  text-decoration: none;
  color: #003366;
}

/* Styling for the active navigation link */
.nav-tabs .nav-item .nav-link.active {
  color: red;
  border-bottom-color: white;
  background-color: white;
}

/* Styling for the link of the currently active route */
.router-link-exact-active {
  color: red !important;
}

/* Styling for the title of the page */
.card-title {
  font-weight: normal;
  text-transform: capitalize;
  font-size: 2.5em;
  text-align: center;
  color: #dddddd;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Styling for the tab content section */
.tab-content {
  border-radius: 0 0 15px 15px;
  border-top: none;
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 0;
  flex-grow: 1;
  height: 100%;
}

/* Styling for the card that contains the tabs and their content */
.card {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border: none;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Styling for the header section of the page */
.header {
  height: 80px;
  justify-content: center;
  align-items: center;
  background: #003366;
  display: flex;
  margin: 0;
  color: #dddddd;
}

/* Responsive styles for screens with a maximum width of 600px */
@media only screen and (max-width: 600px) {
  /* Smaller header height for smaller screens */
  .header {
    height: 60px;
  }

  /* Smaller title font size for smaller screens */
  .card-title {
    font-size: 2em;
  }

  /* Smaller navigation link padding and font size for smaller screens */
  .nav-tabs .nav-item .nav-link {
    font-size: 0.8em;
    padding: 8px;
  }
}
</style>
