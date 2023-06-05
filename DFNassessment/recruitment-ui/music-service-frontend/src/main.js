import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import ArtistsComponent from "./components/ArtistsComponent.vue";
import AlbumsComponent from "./components/AlbumsComponent.vue";
import SongsComponent from "./components/SongsComponent.vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const routes = [
  { path: "/", component: ArtistsComponent },
  { path: "/artists", component: ArtistsComponent },
  { path: "/albums", component: AlbumsComponent },
  { path: "/songs", component: SongsComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
