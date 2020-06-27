<template>
  <div>
<!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/home">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      栅格化-->
      <el-row :gutter="20">
        <el-col :span="5">
          <!--    搜索与添加区域-->
<!--            v-model 双向绑定-->
<!--            clearable 清空文本框-->
<!--             @clear=  事件绑定-->
          <el-input placeholder="请输入内容"
                    class="input-with-select"
                    clearable
                    @clear="getUserList"
                    v-model="queryInfo.query"
            >
            <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
<!--            点击按钮，会修改 addDiglogVisable 是否打开对话框的状态-->
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!--      表格-->
      <el-table
        :data="userList"
        style="width: 100%"
        stripe
        border
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index"       label="序号" width="50"></el-table-column>
        <el-table-column prop="username"    label="用户名" width="180"></el-table-column>
        <el-table-column prop="email"       label="email" width="180"></el-table-column>
        <el-table-column prop="mobile"      label="手机号" width="180"></el-table-column>
        <el-table-column prop="role_name"   label="角色"   width="180"> </el-table-column>
        <el-table-column label="状态"  width="80">
<!--            作用域插槽的使用-->
<!--           {{scope.row}} 获取这一行的数据-->
            <template slot-scope="scope">
<!--                开关-->
<!--                 @change="userStateChanged(scope.row)" 添加switch改变 监听事件函数-->
                <el-switch
                        @change="userStateChanged(scope.row)"
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
<!--          作用域插槽-->
        <el-table-column label="操作"  width="180">
            <template slot-scope="scope">
<!--                修改按钮-->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
<!--                删除按钮-->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click = "removeUserById(scope.row.id)"></el-button>
<!--                分配角色按钮-->
<!--                在按钮上面弹出详细信息-->
                <el-tooltip content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
<!--        分页区-->
<!--        @handleSizeChange 监听pagesize 改变的函数   事件处理函数-->
<!--        handleCurrentChange 监听pagenum 改变的函数-->
<!--         :current-page 动态绑定pagenum-->
<!--        layout 显示页码布局的-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-card>
<!--      添加用户的对话框-->
<!--      title 标题-->
<!--       :visible.sync 对话框的显示与隐藏-->
<!--      :before-close= 在对话框关闭之前会处理的函数-->
      <el-dialog
              title="添加用户"
              :visible.sync="addDialogVisible"
              width="50%"
              @close="addDialogClosed">
<!--           内容主体区-->
          <el-form :model="addForm"
                   :rules="addFormRules"
                   ref="addFormRef"
                   label-width="70px">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
          </el-form>
<!--         内容的底部区-->
          <span slot="footer" class="dialog-footer">
    <el-button @click="addDiglogVisable = false">取 消</el-button>
    <el-button type="primary" @click="addUserInfo">确 定</el-button>
         </span>
      </el-dialog>
<!--      修改用户的对话框-->
      <el-dialog
              title="修改用户"
              :visible.sync="editDialogVisible"
              width="50%"
              @close="editDialogClosed">
          <!--           内容主体区-->
          <el-form :model="editForm"
                   :rules="addFormRules"
                   ref="editFormRef"
                   label-width="70px">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义校验规则的使用
    // 验证email的合法性校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 判断传递进来的value是否满足正则
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 判断传递进来的value是否满足正则
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 定义参数 请求用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 10 // 当前每页显示多少条数据
      },
      userList: [
        {
          email: '1480272198@qq.com',
          id: 500,
          mg_state: false,
          mobile: '13653392951',
          role_name: '超级管理员',
          username: 'admin'
        }
      ],
      total: 0,
      // 控制 添加用户 对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
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
            trigger: 'blur'
          },
          { //  其他验证规则
            min: 6, // 最少6位
            max: 6, // 最长6位
            message: '长度在 6 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          // {
          //   required: true,
          //   message: '请输入email',
          //   trigger: 'blur'
          // },
          // 自定义邮箱校验规则的使用
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户 的对话框
      editDialogVisible: false,
      // 查询到的用户对象信息
      editForm: {}
    }
  },
  // 生命周期函数，调用对应的函数
  created () {
    this.getUserList()
  },
  // 事件处理函数
  methods: {
    // 定义函数
    async getUserList () {
      // 携带参数 发起get请求，获取返回数据
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变，向后台发送put请求
    async userStateChanged (userinfo) {
      // ` `表示模板渲染
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听 添加用户对话框 的关闭事件,清空对话框函数
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUserInfo () {
      // 表单数据预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // 隐藏对话框
        this.addDialogVisible = false
        // 重新获取用户列表的数据
        this.getUserList()
        this.$message.success('添加用户成功')
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      // 打开对话框字段
      this.editDialogVisible = true
    },
    // 监听 修改用户对话框 的关闭事件,清空对话框函数
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // 如果校验不通过，直接返回
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败！')
        }
        // 隐藏对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        this.$message.success('修改用户成功！')
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById (id) {
      // 1. 询问用户是否删除数据
      // 2. catch 捕捉$confirm里面的错误
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消删除, 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      // 3. 调用删除接口
      const { data: res } = await this.$http.delete(
        'users/' + id
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败!')
      }
      // 4. 调用用户数据list接口
      this.getUserList()
      this.$message.success('删除用户成功!')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
