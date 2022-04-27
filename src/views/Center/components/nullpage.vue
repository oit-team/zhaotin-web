<template>
<div></div>
</template>

<script>
export default {
  name: 'Nullpage',
  beforeRouteEnter(to, from, next) {
    next((xq) => {
      xq.$router.replace({
        name: from.name,
        params: to.params,
      })
    })
  },
}
</script>

<style lang='scss' scoped>

</style>
