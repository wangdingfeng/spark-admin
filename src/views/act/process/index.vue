<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="流程名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.key" placeholder="流程key" style="width: 200px;" class="filter-item" />
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
      <el-table-column label="流程ID" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="流程分类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程key" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程部署时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deploymentTime }}</span>
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
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;">
        <el-form-item label="流程id" prop="id">
          <el-input v-model="temp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-input v-model="temp.category" />
        </el-form-item>
        <el-form-item label="流程key" prop="key">
          <el-input v-model="temp.key" />
        </el-form-item>
        <el-form-item label="流程文件" prop="file">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="confirmLoading" type="primary" @click="createData">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { processPage, uploadFile } from '@/api/act/process.js'

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      uploadForm: new FormData(),
      actionUrl: '',
      file: null,
      confirmLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        deploymentName: '',
        deploymentKey: ''
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: '',
        key: '',
        category: ''
      },
      rules: {
        name: [{ required: true, message: '请输入实例名称', trigger: 'change' }],
        category: [{ required: true, message: '请输入分类', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      processPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    fileChange(file, fileList) {
      this.file = file.raw
    },
    handleRemove(file, fileList) {
      this.file = null
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        key: '',
        category: ''
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
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
      })
    },
    createData() {
      // 新增
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.uploadForm.append('file', this.file)
          this.uploadForm.append('name', this.temp.name)
          this.uploadForm.append('key', this.temp.key)
          this.uploadForm.append('category', this.temp.category)
          console.info(this.uploadForm)
          uploadFile(this.uploadForm).then(() => {
            this.confirmLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
