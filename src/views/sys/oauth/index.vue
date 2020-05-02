<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        plain
        @click="handleCreate"
      >新增</el-button>
    </div>
    <div v-show="showStatus" class="filter-container">
      <el-input
        v-model="listQuery.clientId"
        placeholder="授权ID"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        plain
        @click="handleFilter"
      >查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="授权ID" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.clientId }}</template>
      </el-table-column>
      <el-table-column label="密钥" align="center" width="180">
        <template>
          <span>****************</span>
        </template>
      </el-table-column>
      <el-table-column label="授权作用域" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权模式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorizedGrantTypes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="令牌时效(s)" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.accessTokenValidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="刷新时效(s)" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.refreshTokenValidity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.isDeleted!='1'"
            type="text"
            icon="el-icon-delete"
            @click="handleModifyStatus(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 600px; margin-left:40px;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="授权ID:" prop="clientId">
              <el-input v-model="temp.clientId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密钥:" prop="clientSecret">
              <el-input v-model="temp.clientSecret" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="授权模式:" prop="authorizedGrantTypesArray">
              <el-checkbox-group v-model="temp.authorizedGrantTypesArray">
                <el-checkbox v-for="type in grantTypesOptions" :key="type.key" :label="type.key">{{ type.display_name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="授权作用域:" prop="scope">
              <el-input v-model="temp.scope" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="令牌时效:" prop="accessTokenValidity">
              <el-input-number v-model="temp.accessTokenValidity" :min="1" label="令牌时效" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷新时效:" prop="refreshTokenValidity">
              <el-input-number v-model="temp.refreshTokenValidity" :min="1" label="刷新时效" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="自动放行:" prop="autoapprove">
              <el-radio-group v-model="temp.autoapprove">
                <el-radio-button key="true" label="true">是</el-radio-button>
                <el-radio-button key="false" label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="重定向地址:" prop="webServerRedirectUri">
              <el-input v-model="temp.webServerRedirectUri" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          :loading="confirmLoading"
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { page, saveOauth, updateOauth, deleteOauth } from '@/api/sys/oauth.js'

const grantTypesOptions = [
  { key: 'password', display_name: '密码模式' },
  { key: 'refresh_token', display_name: '刷新模式' },
  { key: 'authorization_code', display_name: '授权码模式' },
  { key: 'client_credentials', display_name: '客户端模式' },
  { key: 'implicit', display_name: '简化模式' }
]

const grantTypesValue = grantTypesOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Oauth',
  components: { Pagination },
  directives: { waves },
  filters: {
    scopeFilter(type) {
      return grantTypesValue[type]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      grantTypesOptions,
      listLoading: true,
      confirmLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        clientId: ''
      },
      showStatus: false,
      showTitle: '查询',
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        clientId: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        authorizedGrantTypesArray: [],
        webServerRedirectUri: '',
        autoapprove: 'false',
        accessTokenValidity: 0,
        refreshTokenValidity: 0
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        clientId: [
          { required: true, message: '请输入授权ID', trigger: 'change' }
        ],
        clientSecret: [
          { required: true, message: '请输入密钥', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请输入授权作用域', trigger: 'change' }
        ],
        authorizedGrantTypesArray: [
          { type: 'array', required: true, message: '请输入授权模式', trigger: 'change' }
        ]
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
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery.clientId = ''
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        clientId: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        authorizedGrantTypesArray: [],
        webServerRedirectUri: '',
        autoapprove: 'false',
        accessTokenValidity: 21600,
        refreshTokenValidity: 28800
      }
    },
    handleFilter() {
      this.listQuery.current = 1
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
      this.temp = Object.assign({}, row)
      // 改变赋值方式
      this.$set(this.temp, 'authorizedGrantTypesArray', (this.temp.authorizedGrantTypes || '').split(','))
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.temp.authorizedGrantTypes = this.temp.authorizedGrantTypesArray.join(',')
          saveOauth(this.temp)
            .then(() => {
              this.confirmLoading = false
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
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    updateData() {
      // 修改
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.authorizedGrantTypes = this.temp.authorizedGrantTypesArray.join(',')
          const tempData = Object.assign({}, this.temp)
          this.confirmLoading = true
          updateOauth(tempData)
            .then(() => {
              this.confirmLoading = false
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
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
