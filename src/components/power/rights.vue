<template>
  <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--    卡片视图-->
      <el-card>
<!--          &lt;!&ndash;      栅格化&ndash;&gt;-->
<!--          <el-row :gutter="20">-->
<!--              <el-col :span="5">-->
<!--                  &lt;!&ndash;    搜索与添加区域&ndash;&gt;-->
<!--                  &lt;!&ndash;            v-model 双向绑定&ndash;&gt;-->
<!--                  &lt;!&ndash;            clearable 清空文本框&ndash;&gt;-->
<!--                  &lt;!&ndash;             @clear=  事件绑定&ndash;&gt;-->
<!--                  <el-input placeholder="请输入内容"-->
<!--                            class="input-with-select"-->
<!--                            clearable-->
<!--                            @clear="getRightsList"-->
<!--                            v-model="queryInfo.query">-->
<!--                      <el-button-->
<!--                              slot="append"-->
<!--                              icon="el-icon-search"-->
<!--                              @click="getRightsList">-->
<!--                      </el-button>-->
<!--                  </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                  &lt;!&ndash;            点击按钮，会修改 addDiglogVisable 是否打开对话框的状态&ndash;&gt;-->
<!--                  <el-button type="primary" @click="addDialogVisible = true">添加权限</el-button>-->
<!--              </el-col>-->
<!--          </el-row>-->
          <!--      表格-->
          <!--      border 表格加边框线-->
          <!--      stripe 表格隔行变色-->
          <el-table
                  :data="rightsList"
                  style="width: 100%"
                  stripe
                  border>
              <el-table-column type="index"       label="序号" width="50"></el-table-column>
              <el-table-column prop="authName"    label="权限名称" width="180"></el-table-column>
              <el-table-column prop="path"       label="路径" width="180"></el-table-column>
              <el-table-column label="权限等级" width="80">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                  </template>
              </el-table-column>
          </el-table>
<!--          &lt;!&ndash;        分页&ndash;&gt;-->
<!--          &lt;!&ndash;        @handleSizeChange 监听pagesize 改变的函数   事件处理函数&ndash;&gt;-->
<!--          &lt;!&ndash;        handleCurrentChange 监听pagenum 改变的函数&ndash;&gt;-->
<!--          &lt;!&ndash;         :current-page 动态绑定pagenum&ndash;&gt;-->
<!--          &lt;!&ndash;        layout 显示页码布局的&ndash;&gt;-->
<!--          <el-pagination-->
<!--                  @size-change="handleSizeChange"-->
<!--                  @current-change="handleCurrentChange"-->
<!--                  :current-page="queryInfo.pagenum"-->
<!--                  :page-sizes="[1, 2, 5, 10]"-->
<!--                  :page-size="queryInfo.pagesize"-->
<!--                  layout="total, sizes, prev, pager, next, jumper"-->
<!--                  :total="total">-->
<!--          </el-pagination>-->
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: ''
      },
      rightsList: [
        {
          authName: '商品管理',
          id: 101,
          level: '0',
          path: 'goods',
          pid: 0
        }
      ]
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
