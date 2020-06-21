import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Form, FormItem, Input, Button,
  Message
  } from 'element-ui'
// 导入弹框组件，挂载到vue上面
Vue.prototype.$message = Message

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
