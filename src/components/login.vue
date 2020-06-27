<template>
  <div class ="login_container">
    <div class="login_box">
<!--      头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
<!--      登录表单区-->
<!--      :model 数据绑定-->
<!--      ref 引用-->
<!--      :rules 校验规则绑定-->
      <el-form  ref="loginFormRef" :model="loginForm"  :rules="loginFormRules" label-width="0px" class="login_form">
<!--        用户名-->
        <el-form-item prop="username">
<!--          v-model 数据绑定-->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          > </el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item  prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          > </el-input>
        </el-form-item>
<!--        按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true, // 是否必须填写
            message: '请输入用户名',
            trigger: 'blur' // 鼠标失去焦点触发
          },
          { //  其他验证规则
            min: 3, // 最少3位
            max: 10, // 最长10位
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur' // 鼠标失去焦点
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6到15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置输入框信息
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录预验证
    // await 只能用作async被修饰的方法，修饰成异步的函数
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return // 校验是否有值
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的token，保存到客户端的 sessionStorage 中
        //  1.1 项目中除了登录之外的其他api接口，必须在登录之后才能访问
        //  1.2 token只应在当前网页打开期间生效，所以讲token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token) // 保存token,到session storage
        // 2. 通过编程式导航挑战到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!--scoped 防止组件冲突-->
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
  .login_box{ // 设置盒子的位置
    width: 450px; // 宽度
    height: 300px; // 大小
    background-color: #fff; // 颜色
    border-radius: 3px; //
    position: absolute; // 位置
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      width: 130px; // 宽度
      height: 130px; // 大小
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%); // 位移
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
