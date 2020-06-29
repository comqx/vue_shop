<template>
  <el-container class="home_container">
<!--    头部-->
    <el-header>
      <div>
        <img src="./../assets/logo.png" alt="">
<!--        <span>电商后台管理系统</span>-->
        <el-button type="text"  @click="returnHome">电商后台管理系统</el-button>
      </div>
      <el-button type="info" @click="logout"> 退出 </el-button>
    </el-header>
<!--    页面主体-->
    <el-container>
<!--      左侧-->
<!--      :width 动态数据绑定，如果isCollapse 为true，64px，如果为false，200px -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
<!--        侧边栏上面的折叠按钮-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
<!--        侧边栏菜单区-->
<!--        :collapse-transition 取消动画-->
<!--        :collapse 是否折叠-->
<!--        unique-opened 只打开一项，只写关键字表示 :unique-opened="true" -->
<!--        router 为侧边栏开启路由模式，通过index属性当做跳转地址，然后通过自定义index地址来实现跳转路径-->
<!--        :default-active 在session中保存左侧菜单栏的激活状态-->
        <el-menu
          background-color="#323742"
          text-color="#fff"
          active-text-color="#5d97cd"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
<!--          一级菜单 for循环生成-->
<!--          :index 是动态值绑定-->
          <el-submenu :index="item.id + ''"  v-for="item in menuList" :key="item.id">
<!--            一级菜单的模板区-->
            <template slot="title">
<!--              图标区-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本区-->
              <span>{{ item.authName }}</span>
            </template>
<!--            二级菜单-->
<!--            路由的跳转地址 :index="'/',subItem.path" -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!--              图标区-->
                <i class="el-icon-menu"></i>
                <!--              文本区-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧页面-->
      <el-main>
<!--      路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [

      ],
      // 字体对象
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-lock_fill',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活的链接
      activePath: ''
    }
  },
  created () {
    this.getMenuList() // 获取所有的左侧菜单
    // 从sessionStorage获取被激活的链接地址
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 返回首页
    returnHome () {
      // 前端路由
      this.$router.push('/welcome')
    },
    // 退出按钮，返回到登录页
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<!--scoped 防止组件冲突-->
<style lang="less" scoped>
//  header布局样式
  .el-header {
    background-color: #363d3f;
    display: flex;  //
    justify-content: space-between; // 左右贴边对齐
    padding-left: 0; // 左边的padding清空
    align-items: center;
    color: #fffdef;
    font-size: 20px; // 字体大小
    > div{ // 下一级标签选择
      display: flex; // 居中对齐
      align-items: center;
      img {
        width: 60px;
      }
      .el-button { // 下一级标签选择
        color: #fffdef;
        font-size: 17px; // 字体大小
        margin-left: 15px;
      }
    }
  }
//  aside 左侧布局样式
  .el-aside {
    background-color: #3a3f4b;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #edeff2;
  }
  .home_container {
    height: 100%; // 充满全屏
  }
  // icon图标距离右边加10px
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #485164; //背景色
    font-size: 10px; //文字大小
    line-height: 24px; // 文字行高
    color: #fffdef; // 文字颜色
    text-align: center; // 文字居中对齐
    letter-spacing: 0.2em; // 文字间距
    cursor: pointer; // 鼠标放上去变成小手
  }
  /*body > .el-container {*/
  /*  margin-bottom: 40px;*/
  /*}*/

  /*.el-container:nth-child(5) .el-aside,*/
  /*.el-container:nth-child(6) .el-aside {*/
  /*  line-height: 260px;*/
  /*}*/

  /*.el-container:nth-child(7) .el-aside {*/
  /*  line-height: 320px;*/
  /*}*/
</style>
