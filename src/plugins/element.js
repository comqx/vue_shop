import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Form,
  FormItem,
  Input,
  Button,
  Header,
  Message,
  Container,
  Main,
  Aside,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Select,
  Option,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree
} from 'element-ui'

// 导入弹框组件，挂载到vue上面
Vue.prototype.$message = Message
// 消息弹出框
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

// home页面的头部，页面主体（左侧，右侧）组件
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)

// 左侧 菜单栏
Vue.use(Menu)
Vue.use(Submenu)
// Vue.use(MenuItemGroup)
Vue.use(MenuItem)

// 面包屑导航
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
// 卡片视图
Vue.use(Card)
// 搜索框
Vue.use(Select)
Vue.use(Option)
// 栅格化
Vue.use(Row)
Vue.use(Col)
// 表格
Vue.use(Table)
Vue.use(TableColumn)
// 开关
Vue.use(Switch)
// 提示信息
Vue.use(Tooltip)
// 分页组件
Vue.use(Pagination)
// 对话框
Vue.use(Dialog)

Vue.use(Tag)
Vue.use(Tree)
