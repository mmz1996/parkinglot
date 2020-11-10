<template>
  <div class="wrapper">
    <el-container class="layout">
      <el-header>
        <div>
          <h1 class="text">JLU-智慧停车综合管理云平台</h1>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside class="layout-aside" width=auto>
          <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
            <el-radio-button :label="false">展开</el-radio-button>
            <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group> -->
          <el-menu default-active="amap" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <el-menu-item index="amap">
                <i class="el-icon-location"></i>
                <span slot="title">状态</span>
            </el-menu-item>
            <el-menu-item index="management">
              <i class="el-icon-menu"></i>
              <span slot="title">管理</span>
            </el-menu-item>
            <el-menu-item index="log">
              <i class="el-icon-document"></i>
              <span slot="title">日志</span>
            </el-menu-item>
            <el-menu-item index="setting">
              <i class="el-icon-setting"></i>
              <span slot="title">设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="layout-main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  name: 'Home',
  data () {
    return {
      selectItem: 'amap',
      isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created () {
    if (this.$route.name !== 'amap') {
      let path = this.selectItem
      this.$router.push({
        name: path
      })
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
  .wrapper {
    height: 100%;
  }
  .layout {
    height: 100%;
  }
  .container {
    height: 100%;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 120px;
    min-height: 400px;
  }
  .layout-main {
    padding: 0px;
  }
  .layout-aside {
    width: auto;
  }
  .el-menu {
    height: 100%;
    width: 64px;
  }
  .text {
    color: #2493f5;
    line-height: 60px;
    letter-spacing: 6px;
    margin: auto 0;
  }
</style>
