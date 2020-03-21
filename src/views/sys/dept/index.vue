<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.fullName" placeholder="部门名称" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
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
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      element-loading-text="加载中"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="fullName" label="全称" width="180" />
      <el-table-column prop="simpleName" label="简称" />
      <el-table-column prop="deptType" label="部门类型">
        <template slot-scope="scope">
          <span v-if="scope.row.deptType === 0">公司</span>
          <span v-else>部门</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="createDate" label="创建时间" width="200" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.isDeleted!='1'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="全称" prop="fullName">
              <el-input v-model="temp.fullName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="simpleName">
              <el-input v-model="temp.simpleName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上级菜单" prop="pid">
          <treeselect v-model="temp.pid" :normalizer="normalizer" :multiple="false" :options="treeData" clear-value-text="清除" placeholder=" " style="width:100%" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门类型" prop="deptType">
              <el-radio-group v-model="temp.deptType" size="mini">
                <el-radio-button label="0">公司</el-radio-button>
                <el-radio-button label="1">部门</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="temp.sort" :min="1" label="排序" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { listDept, saveDept, updateDept, deleteDept } from '@/api/sys/dept.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Dept',
  directives: { waves },
  components: { Treeselect },
  data() {
    return {
      listLoading: false,
      listQuery: {
        fullName: ''
      },
      tableData: null,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        pid: '',
        fullName: '',
        simpleName: '',
        deptType: null,
        sort: 10
      },
      treeData: [{
        id: 0,
        simpleName: '根目录',
        children: []
      }],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        fullName: [{ required: true, message: '请输入全称', trigger: 'change' }],
        simpleName: [{ required: true, message: '请输入简称', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listDept(this.listQuery).then(response => {
        this.tableData = response.data
        // 树节点添加根目录
        this.treeData[0].children = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: 0,
        fullName: '',
        simpleName: '',
        deptType: 0,
        sort: 10
      }
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDept(row.id).then(response => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    createData() {
      // 新增
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDept(this.temp).then(() => {
            this.getList()
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateDept(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    normalizer(node) {
      // 修改tree数据形式
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.simpleName,
        children: node.children
      }
    }
  }
}
</script>
