<template>
  <!-- <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
  </div> -->
  <router-view />
</template>
<script>
export default {
  created() {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState({ ...this.$store.state, ...JSON.parse(sessionStorage.getItem('store')) })
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@import './assets/iconfont/iconfont.css'
</style>
