<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
      <el-button
        v-if="hasPerm('role:add')"
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
        v-model="listQuery.roleName"
        placeholder="角色名称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.roleCode"
        placeholder="角色编号"
        style="width: 200px;"
        class="filter-item"
      />
      <treeselect
        v-model="listQuery.deptId"
        :multiple="false"
        :options="treeDeptData"
        clear-value-text="清除"
        placeholder="部门"
        style="width:240px"
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
      <el-button
        v-waves
        class="filter-item"
        type="warning"
        icon="el-icon-delete"
        plain
        @click="reset"
      >重置</el-button>
    </div>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="加载中"
            :header-cell-style="{background: '#f8f8f9'}"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="角色名称" align="center">
              <template slot-scope="scope">{{ scope.row.roleName }}</template>
            </el-table-column>
            <el-table-column label="角色编号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.roleCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.deptName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色描述" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="200"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{row,$index}">
                <el-button
                  v-if="hasPerm('role:edit')"
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleUpdate(row)"
                >编辑</el-button>
                <el-button
                  v-if="hasPerm('role:edit')"
                  type="text"
                  size="mini"
                  icon="el-icon-s-check"
                  @click="rowClick(row)"
                >授权</el-button>
                <el-button
                  v-if="hasPerm('user:delete')"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(row,$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-loading="authLoading" class="box-card" shadow="never" element-loading-text="加载中">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配{{ nowRoleText }}</span>
            </el-tooltip>
            <el-button
              v-if="hasPerm('role:edit')"
              :loading="menuLoading"
              icon="el-icon-check"
              size="small"
              style="float: right; padding: 6px 9px"
              type="primary"
              plain
              @click="saveAuth"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="treeData"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="100px"
        style="margin-left:10px;"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="formData.roleName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编号" prop="roleCode">
              <el-input v-model="formData.roleCode" placeholder="不允许为中文">
                <template slot="prepend">ROLE_</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据范围" prop="dsType">
              <el-select v-model="formData.dsType" placeholder="选择数据范围" style="width:100%">
                <el-option
                  v-for="item in dsTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="formData.dsType === '3' " :span="12">
            <el-form-item label="数据权限" prop="dsScope">
              <treeselect
                v-model="formData.dsScopeArry"
                multiple
                :options="treeDeptData"
                placeholder="请选择数据权限"
                clear-value-text="清除"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="部门" prop="deptId">
          <treeselect
            v-model="formData.deptId"
            :multiple="false"
            :options="treeDeptData"
            clear-value-text="清除"
            placeholder=" "
            style="width:100%"
            @select="selectDepart"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入备注"
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
import {
  listRole,
  createRole,
  updateRole,
  deleteRole,
  getRoleAuth,
  saveRoleAuth
} from '@/api/sys/role.js'
import { getMenuTree } from '@/api/sys/menu.js'
import { getDeptTree } from '@/api/sys/dept.js'
import { resetData } from '@/utils'
import { getDictList } from '@/utils/dict'

export default {
  name: 'Role',
  components: { Pagination, Treeselect },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      menuLoading: false,
      treeLoading: false,
      authLoading: false,
      confirmLoading: false,
      showStatus: true,
      showTitle: '查询',
      currentId: undefined,
      nowRoleText: '',
      dsTypeOptions: getDictList('role_ds_type'),
      defaultProps: { children: 'children', label: 'label' },
      listQuery: {
        current: 1,
        size: 20,
        roleName: '',
        roleCode: '',
        deptId: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      treeData: null,
      treeDeptData: null,
      menuIds: [],
      formData: {
        id: null,
        roleName: '',
        roleCode: '',
        deptId: '',
        deptName: '',
        dsType: null,
        dsScope: null,
        dsScopeArry: null,
        description: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        roleCode: [
          { required: true, message: '请输入角色编号', trigger: 'change' },
          { validator: this.validRoleCode, trigger: 'blur' }
        ],
        dsType: [
          { required: true, message: '请输入权限范围', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getAuthTree()
    this.getDeptTree()
  },
  methods: {
    getList() {
      this.listLoading = true
      listRole(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      resetData(this.listQuery, { current: 1, size: 20 })
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
    },
    getAuthTree() {
      getMenuTree().then(response => {
        this.treeData = response.data
      })
    },
    getDeptTree() {
      getDeptTree(true).then(response => {
        this.treeDeptData = response.data
      })
    },
    validRoleCode(rule, value, callback) {
      // 检验角色编号
      if (value) {
        if (/[^\A-\Z0-9-_]/g.test(value)) {
          callback(new Error('只允许输入大写、数字、下划线组合!'))
        } else {
          callback()
        }
      }
      callback()
    },
    rowClick(row) {
      this.currentId = row.id
      this.$refs.menu.setCheckedKeys([])
      this.authLoading = true
      this.nowRoleText = '(当前角色:' + row.roleName + ')'
      getRoleAuth(this.currentId).then(response => {
        this.menuIds = response.data
        this.authLoading = false
      })
    },
    selectDepart(val) {
      this.formData.deptName = val.label
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      resetData(this.formData)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      row.dsType = row.dsType ? '' + row.dsType : null
      row.dsScopeArry = row.dsScope ? row.dsScope.split(',') : null
      this.formData = Object.assign({}, row) // copy obj
      this.formData.roleCode = this.formData.roleCode.replace('ROLE_', '')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(response => {
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
          const tempData = Object.assign({}, this.formData)
          tempData.roleCode = 'ROLE_' + tempData.roleCode
          tempData.dsScope = tempData.dsScopeArry ? tempData.dsScopeArry.join(',') : null
          createRole(tempData)
            .then(response => {
              this.confirmLoading = false
              tempData.id = response.data.id
              this.list.unshift(tempData)
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
          const tempData = Object.assign({}, this.formData)
          tempData.roleCode = 'ROLE_' + tempData.roleCode
          tempData.dsScope = tempData.dsScopeArry ? tempData.dsScopeArry.join(',') : null
          this.confirmLoading = true
          updateRole(tempData)
            .then(() => {
              this.confirmLoading = false
              const index = this.list.findIndex(v => v.id === this.formData.id)
              this.list.splice(index, 1, tempData)
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
    saveAuth() {
      this.menuLoading = true
      this.formData.id = this.currentId
      const role = { id: this.currentId, menuIds: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        role.menuIds.push(data.id)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        role.menuIds.push(data)
      })
      saveRoleAuth(role)
        .then(response => {
          this.menuLoading = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
        .catch(err => {
          this.menuLoading = false
          console.log(err.response.data.message)
        })
    }
  }
}
</script>
