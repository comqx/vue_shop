<template>
  <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--    卡片视图-->
      <el-card>
          <!--      栅格化-->
          <el-row :gutter="20">
<!--              添加角色按钮区-->
              <el-col :span="4">
                  <!--            点击按钮，会修改 addDiglogVisable 是否打开对话框的状态-->
                  <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
              </el-col>
          </el-row>
          <!--      表格-->
          <!--      border 表格加边框线-->
          <!--      stripe 表格隔行变色-->
          <el-table
                  :data="roleList"
                  style="width: 100%"
                  stripe
                  border>
<!--             type="expand"    展开列-->
              <el-table-column type="expand" label="展开"  width="60">
                  <template slot-scope="scope">
<!--                      :class 动态绑定，三元表达式：如果i1=0，那么使用bdtop作为class，如果不为0，则为默认的class bdbottom-->
<!--                    一级权限-->
                      <el-row
                              :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter' ]"
                              v-for="(item1,i1) in scope.row.children"
                              :key="item1.id">
                          <el-col :span="5">
                              <el-tag closable
                                      @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!--                              二级权限和三级权限-->
                          <el-col :span="19">
                              <!--                             通过for循环 嵌套渲染二级权限-->
                              <!--            二级权限之间添加分割线，如果i2为0，不添加top分割线-->
                              <el-row :class="[i2 ===0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                  <el-col :span="6">
<!--                                      closable 可删除的标签按钮-->
                                      <el-tag type="success"
                                              closable
                                              @close="removeRightById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                                      <i class="el-icon-caret-right"></i>
                                  </el-col>
<!--                                  通过for循环，实现三级权限渲染-->
                                  <el-col :span="18">
                                      <el-tag type="warning"
                                              v-for="item3 in item2.children"
                                              :key="item3.id"
                                              closable
                                      @close="removeRightById(scope.row,item3.id)">
                                          {{ item2.authName }}
                                      </el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
<!--                      <pre> {{scope.row}}</pre>-->
                  </template>
              </el-table-column>
<!--              索引列-->
              <el-table-column type="index"       label="序号" width="50"></el-table-column>
              <el-table-column prop="roleName"    label="角色名称"></el-table-column>
              <el-table-column prop="roleDesc"    label="角色描述"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="primary" size="mini" icon="el-icon-edit" @click="showRoleInfo(scope.row.id)">编辑</el-button>
                      <el-button type="danger" size="mini" icon="el-icon-delete" @click = "removeRoleById(scope.row.id)">删除</el-button>
                      <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>
      <!--      添加角色的对话框-->
      <!--      title 标题-->
      <!--       :visible.sync 对话框的显示与隐藏-->
      <el-dialog
              title="添加角色"
              :visible.sync="addDialogVisible"
              width="50%"
              @close="addDialogClosed">
          <!--           内容主体区-->
          <el-form :model="addRoleForm"
                   :rules="addRoleFormRules"
                   ref="addRoleFormRef"
                   label-width="70px">
              <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="addRoleForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="addRoleForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <!--         内容的底部区-->
          <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleInfo">确 定</el-button>
         </span>
      </el-dialog>

      <!--      修改角色的对话框-->
      <!--      editDialogClosed 监听 修改角色对话框 的关闭事件,清空对话框函数-->
      <el-dialog
              title="修改用户"
              :visible.sync="editDialogVisible"
              width="50%"
              @close="editDialogClosed">
          <!--           内容主体区-->
          <el-form :model="editRoleForm"
                   ref="editRoleFormRef"
                   label-width="70px">
              <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editRoleForm.roleName" disabled></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editRoleForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
      </el-dialog>

      <!--      分配权限的对话框-->
      <!--      distributionDialogClosed 监听 分配权限对话框 的关闭事件,清空对话框内容函数-->
      <el-dialog
              title="分配权限"
              :visible.sync="setRightDialogVisible"
              @close="setRightDialogClosed"
              width="50%">
          <!--           内容主体区-->
<!--          树结构-->
<!--          default-expand-all 展开全部节点-->
<!--          default-checked-keys 默认勾选的节点-->
<!--          show-checkbox 节点可选-->
<!--          node-key="id" 选中的值为id-->
          <el-tree
                  :data="rightsList"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="treeRef"
                  :default-checked-keys="defKeyList"
                  :props="treeProps">
          </el-tree>
<!--          按钮部分-->
          <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="rolesBindRightsFunc">确 定</el-button>
  </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 所有角色列表的数据
      roleList: [],
      addDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        username: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          { //  其他验证规则
            min: 3, // 最少3位
            max: 10, // 最长10位
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      editRoleForm: {},
      // 编辑按钮弹出框
      editDialogVisible: false,
      // 分配权限弹出框
      setRightDialogVisible: false,
      // 所有权限点的数据
      rightsList: [
        {
          authName: '商品管理',
          id: 101,
          level: '0',
          path: 'goods',
          pid: 0
        }
      ],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的key 节点
      defKeyList: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色信息list
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 置空添加角色弹出框
    addDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRoleInfo () {
      // 1. 表单数据预验证
      console.log(this.$refs)
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        // 2. 可以发起添加操作的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        // 3. 隐藏对话框
        this.addDialogVisible = false
        // 4. 重新获取用户列表的数据
        this.getRoleList()
        this.$message.success('添加角色成功')
      })
    },
    // 置空添加角色弹出框
    editDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    async showRoleInfo (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      this.editRoleForm = res.data
      // 打开对话框字段
      this.editDialogVisible = true
    },
    // 修改角色
    editRoleInfo () {
      this.$refs.editRoleFormRef.validate(async valid => {
        // 1. 如果校验不通过，直接返回
        if (!valid) return
        // console.log(this.editRoleForm)
        // 2. 指定参数，发起修改操作的网络请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 3. 隐藏对话框
        this.editDialogVisible = false
        // 4. 刷新数据列表
        this.getRoleList()
        this.$message.success('修改角色成功！')
      })
    },
    // 删除角色
    async removeRoleById (id) {
      // 1. 询问用户是否删除数据
      // 2. catch 捕捉$confirm里面的错误
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        'roles/' + id
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败!')
      }
      // 4. 调用用户数据list接口
      this.getRoleList()
      this.$message.success('删除角色成功!')
    },
    // 根据id删除对应的权限id
    async removeRightById (role, rightid) {
      // 1. 弹框提示用户是否要删除
      // 2. catch 捕捉$confirm里面的错误
      const confirmResult = await this.$confirm('此操作将永久删除该权限点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消删除, 则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      // 3. 删除操作
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限id失败!')
      }
      // 4. 获取最新的数据
      // this.getRoleList()  防止全部页面刷新，不建议使用全部数据获取
      role.children = res.data
    },
    // 获取权限点
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 1. 获取权限点tree
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 2. 获取到的权限点数据保存到list中
      this.rightsList = res.data
      // 2.1 获取全部的三级节点
      this.getLeafKeys(role, this.defKeyList)
      // 3. 打开弹出框
      this.setRightDialogVisible = true
    },
    // 通过递归的方式，获取角色三级权限所有的id，并保存到defKeyList数组中
    getLeafKeys (node, arr) {
      // 如果不包含children属性,则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeyList = []
    },
    // 分配权限函数
    async rolesBindRightsFunc () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 数组拼接成字符串以','分割
      const idStr = keys.join(',')
      // 发起请求
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.err('分配角色权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }

}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px; // 间隔
}
.bdtop{
    border-top:1px solid #eee; // 顶边框
}
.bdbottom{
    border-bottom: 1px solid #eee; // 底边框
}
/* 纵向  居中对齐*/
.vcenter {
    display: flex;
    align-items: center;
}
</style>
