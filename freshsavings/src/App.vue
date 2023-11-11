<template>
  <main :class="[this.$route.meta.hideNavBar ? 'bg-white' : 'bg-light']" :style="[
    { 'min-height': $route.meta.hideNavBar ? '100vh' : 'calc(100vh - 75px)' },
    { 'margin-top': $route.meta.hideNavBar ? '0' : '74px' },
  ]">
    <NavBar v-if="!this.$route.meta.hideNavBar" />
    <RouterView />
  </main>
  <FooterComponent v-if="!this.$route.meta.hideNavBar" />
</template>

<script>
import HomePage from "./pages/HomePage.vue";
import "bootstrap";
import NavBar from "./components/NavBar.vue";
import FooterComponent from "./components/Footer.vue";


export default {
  name: "App",
  components: {
    HomePage,
    NavBar,
    FooterComponent
  },
  data() {
    return {
      shouldShowNavbar: true
    };
  },
  watch: {
    $route(to) {
      this.shouldShowNavbar = to.name !== "LogIn";
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

#app {
  font-family: Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #FAF9F6;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-wrap: balance;
}
</style>
