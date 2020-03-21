<template>
  <div class="app-container">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <div class="filter-container">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
        </div>
        <el-tree
          ref="dictTree"
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="字典名称" style="width: 200px;" class="filter-item" />
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
          @row-click="rowClick"
        >
          <el-table-column label="字典类型" align="center">
            <template slot-scope="scope">{{ scope.row.type }}</template>
          </el-table-column>
          <el-table-column label="字典值" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button v-if="row.isDeleted!='1'" size="mini" type="danger" @click="handleDelete(row,$index)">
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
      </el-col>
    </el-row>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="temp.value" />
        </el-form-item>
        <el-form-item label="字典描述" prop="description">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
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
import { listDict, createDict, updateDict, deleteDict, getDictTree } from '@/api/sys/dict.js'

export default {
  name: 'Dict',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      currentId: undefined,
      defaultProps: { children: 'children', label: 'label' },
      listQuery: {
        pages: 1,
        size: 20,
        name: ''
      },
      filterText: '',
      dialogFormVisible: false,
      dialogStatus: '',
      treeData: null,
      temp: {
        id: undefined,
        pid: null,
        value: '',
        name: '',
        type: '',
        description: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        roleCode: [{ required: true, message: '请输入角色编号', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDictTree()
  },
  methods: {
    getList() {
      this.listLoading = true
      listDict(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.pages = response.data.pages
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    getDictTree() {
      getDictTree(true).then(response => {
        this.treeDeptData = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: null,
        value: '',
        name: '',
        type: '',
        description: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    rowClick(row) {
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
    handleDelete(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(row.id).then(response => {
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
          createDict(this.temp).then(() => {
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
          updateDict(tempData).then(() => {
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
