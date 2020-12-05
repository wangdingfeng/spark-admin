<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <div class="filter-container">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </div>
        <el-tree
          ref="deptTree"
          class="filter-tree"
          :data="treeDeptData"
          :expand-on-click-node="false"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <div v-show="showStatus" class="filter-container">
          <div class="form-group">
            <label class="control-label">账户名:</label>
            <div class="control-inline">
              <el-input v-model="listQuery.username" placeholder="账户" style="width: 200px;" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label">昵称:</label>
            <div class="control-inline">
              <el-input v-model="listQuery.nickname" placeholder="昵称" style="width: 200px;" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label">用户状态:</label>
            <div class="control-inline">
              <el-select v-model="listQuery.status" placeholder="用户状态" clearable style="width: 160px">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label+'('+item.value+')'" :value="item.value" />
              </el-select>
            </div>
          </div>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            plain
            @click="handleFilter"
          >查询</el-button>
          <el-button
            v-waves
            class="filter-item"
            type="warning"
            icon="el-icon-delete"
            plain
            @click="reset"
          >重置</el-button>
        </div>
        <div class="table-opts">
          <div class="table-opts-left">
            <el-button
              v-if="hasPerm('user:add')"
              class="filter-item"
              style="margin-left: 10px;"
              type="success"
              icon="el-icon-edit"
              plain
              @click="handleCreate"
            >新增</el-button>
            <el-button
              v-if="hasPerm('user:add')"
              class="filter-item"
              style="margin-left: 10px;"
              type="success"
              icon="el-icon-download"
              plain
              @click="exportExcel"
            >导出</el-button>
            <el-button
              v-waves
              class="filter-item"
              type="warning"
              icon="el-icon-refresh"
              plain
              @click="restPassd"
            >重置密码</el-button>
          </div>
          <div class="el-button-group table-opts-right">
            <el-button icon="el-icon-search" circle @click="showClick" />
            <el-button icon="el-icon-refresh" circle @click="handleFilter" />
          </div>
        </div>
        <el-table
          ref="userTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="加载中"
          :header-cell-style="{background: '#f8f8f9'}"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="昵称" align="center">
            <template slot-scope="scope">{{ scope.row.nickname }}</template>
          </el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.sex | dictLabel('sex') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status | typeFilter"
              >{{ scope.row.status | dictLabel('user_status') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row,$index}">
              <el-button
                v-if="hasPerm('user:edit')"
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              >编辑</el-button>
              <el-button
                v-if="hasPerm('user:delete') && row.username !== 'admin'"
                type="text"
                size="mini"
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
      </el-col>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="margin-left:10px;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号:" prop="username">
              <el-input v-model="temp.username" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名:" prop="nickname">
              <el-input v-model="temp.nickname" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话:" prop="phone">
              <el-input v-model="temp.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="temp.sex" size="mini">
                <el-radio-button
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.value"
                >{{ item.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select v-model="temp.status" placeholder="选择状态" style="width:100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="部门:" prop="deptId">
          <treeselect
            v-model="temp.deptId"
            :multiple="false"
            :options="treeDeptData"
            clear-value-text="清除"
            placeholder=" "
            style="width:100%"
            @select="selectDepart"
          />
        </el-form-item>
        <el-form-item label="角色:" prop="roles">
          <el-select
            v-model="roles"
            multiple
            placeholder="请选择"
            style="width:100%"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in roleSelData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remarks">
          <el-input
            v-model="temp.remarks"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">取消</el-button>
        <el-button
          icon="el-icon-check"
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import * as user from '@/api/sys/user.js'
import { getDeptTree } from '@/api/sys/dept.js'
import { getRoleAll } from '@/api/sys/role.js'
import { getDictList } from '@/utils/dict'
import { downloadExcel } from '@/utils'

export default {
  name: 'User',
  components: { Pagination, Treeselect },
  directives: { waves },
  filters: {
    typeFilter(status) {
      const typeMap = {
        '0': 'info',
        '1': 'success',
        '2': 'danger',
        '3': 'warning'
      }
      return typeMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      confirmLoading: false,
      showStatus: true,
      disabled: true,
      listQuery: {
        current: 1,
        size: 20,
        username: '',
        nickname: '',
        status: '',
        deptId: null
      },
      statusOptions: getDictList('user_status'),
      sexOptions: getDictList('sex'),
      filterText: '',
      treeDeptData: null,
      defaultProps: { children: 'children', label: 'label' },
      roleSelData: null,
      dialogFormVisible: false,
      dialogStatus: '',
      roles: [],
      temp: {
        id: undefined,
        username: '',
        nickname: '',
        email: '',
        phone: '',
        deptId: 0,
        deptName: '',
        status: '1',
        remarks: '',
        sex: 1,
        roles: []
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入真实姓名', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        deptId: [{ required: true, message: '请输入部门', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 树过滤器
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getDeptTree()
    this.getRoleData()
  },
  methods: {
    getList() {
      this.listLoading = true
      user.listData(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery.username = ''
      this.listQuery.nickname = ''
      this.listQuery.status = ''
      this.listQuery.deptId = null
    },
    getDeptTree() {
      getDeptTree(true).then(response => {
        this.treeDeptData = response.data
      })
    },
    getRoleData() {
      getRoleAll().then(response => {
        this.roleSelData = response.data
      })
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: '',
        deptId: null,
        deptName: '',
        email: '',
        phone: '',
        status: '1',
        sex: 1,
        roles: []
      }
      this.roles = []
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectDepart(val) {
      this.temp.deptName = val.label
    },
    handleNodeClick(data) {
      // 点击部门树触发事件
      if (data.id === 0) {
        this.listQuery.deptId = null
      } else {
        this.listQuery.deptId = data.id
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.status = this.temp.status.toString()
      // 获取用户角色
      user.getRolIds(this.temp.id).then(response => {
        this.roles = response.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.disabled = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user.deleteUser(row.id).then(response => {
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
          this.temp.roles = this.roles
          this.confirmLoading = true
          user.createUser(this.temp)
            .then(response => {
              this.confirmLoading = false
              this.temp.id = response.data.id
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
          this.temp.roles = this.roles
          this.confirmLoading = true
          const tempData = Object.assign({}, this.temp)
          user.updateUser(tempData)
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
    },
    restPassd() {
      const allRowData = this.$refs.userTable.selection
      if (!allRowData.length) {
        this.$message({
          message: '请选择一行数据',
          type: 'warning'
        })
        return
      }
      const ids = []
      allRowData.forEach((u) => {
        ids.push(u.id)
      })
      this.$confirm('确定重置密码么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user.restPassword(ids.join(',')).then(response => {
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    exportExcel() {
      // 导出exce
      downloadExcel(user.download(this.listQuery), '用户信息.xlsx')
    }
  }
}
</script>
