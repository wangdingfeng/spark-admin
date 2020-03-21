<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.clientId" placeholder="clientId" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="clientId" align="center">
        <template slot-scope="scope">{{ scope.row.clientId }}</template>
      </el-table-column>
      <el-table-column label="clientSecret" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clientSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="scope" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column label="authorizedGrantTypes" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorizedGrantTypes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="accessTokenValidity" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accessTokenValidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="refreshTokenValidity" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.refreshTokenValidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.isDeleted!='1'" size="mini" type="danger" @click="handleModifyStatus(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pages"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;">
        <el-form-item label="clientId" prop="clientId">
          <el-input v-model="temp.clientId" />
        </el-form-item>
        <el-form-item label="clientSecret" prop="clientSecret">
          <el-input v-model="temp.clientSecret" />
        </el-form-item>
        <el-form-item label="scope" prop="scope">
          <el-input v-model="temp.scope" />
        </el-form-item>
        <el-form-item label="authorizedGrantTypes" prop="authorizedGrantTypes">
          <el-input v-model="temp.authorizedGrantTypes" />
        </el-form-item>
        <el-form-item label="webServerRedirectUri" prop="webServerRedirectUri">
          <el-input v-model="temp.webServerRedirectUri" />
        </el-form-item>
        <el-form-item label="accessTokenValidity" prop="accessTokenValidity">
          <el-input v-model="temp.accessTokenValidity" />
        </el-form-item>
        <el-form-item label="refreshTokenValidity" prop="refreshTokenValidity">
          <el-input v-model="temp.refreshTokenValidity" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { page, saveOauth, updateOauth, deleteOauth } from '@/api/sys/oauth.js'

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pages: 1,
        size: 20,
        clientId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        clientId: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        accessTokenValidity: 0,
        refreshTokenValidity: 0
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        clientId: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        clientSecret: [{ required: true, message: '请输入真实姓名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.pages = response.data.pages
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        clientId: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        accessTokenValidity: 21600,
        refreshTokenValidity: 28800
      }
    },
    handleFilter() {
      this.listQuery.pages = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOauth(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    },
    createData() {
      // 新增
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveOauth(this.temp).then(() => {
            this.temp.createDate = new Date()
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      // 修改
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateOauth(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
