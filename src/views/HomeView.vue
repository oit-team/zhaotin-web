<template>
  <div class="home">
    <img class="mx-auto" alt="Vue logo" src="@/assets/logo.png" />

    <el-popover
      placement="bottom"
      width="200"
      trigger="hover"
    >
      <div>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
      </div>
      <template #reference>
        <el-button>菜单</el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>
