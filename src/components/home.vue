<template>
  <div>
    <el-button type="info" @click="logout"> 退出 </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出按钮，返回到登录页
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<!--scoped 防止组件冲突-->
<style lang="less" scoped>
</style>
