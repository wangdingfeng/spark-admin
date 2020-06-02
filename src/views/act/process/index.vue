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
      <el-input v-model="listQuery.name" placeholder="流程名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.key" placeholder="流程key" style="width: 200px;" class="filter-item" />
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
      <el-table-column label="流程ID" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
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
      <el-table-column label="流程资源名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.resourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deploymentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="text" icon="el-icon-share" @click="handleImage(row)">流程图</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownLoad(row)"
          >下载</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleModifyStatus(row,$index)">删除</el-button>
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
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-input v-model="temp.category" />
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
            <div slot="tip" class="el-upload__tip">只能上传bpmn/bpmn20.xml文件</div>
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
    <el-dialog title="流程图片" :visible.sync="dialogImageVisible" width="55%">
      <div style="height:500px">
        <iframe ref="iframe" v-loading="iframeLoading" :src="modelSrc" class="iframe" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { processPage, uploadFile, deleteProcess } from '@/api/act/process.js'

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
      showStatus: false,
      showTitle: '查询',
      file: null,
      confirmLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        name: '',
        key: ''
      },
      dialogFormVisible: false,
      dialogImageVisible: false,
      iframeLoading: false,
      modelSrc: '',
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
    iframeInit() {
      this.iframeLoading = true
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.iframeLoading = false
        })
      } else {
        iframe.onload = () => {
          this.iframeLoading = false
        }
      }
    },
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
    reset() {
      this.listQuery.name = ''
      this.listQuery.key = ''
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
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
    handleImage(row) {
      this.modelSrc = process.env.VUE_APP_BASE_API + '/flow/flowable/process/displayModel/' + row.id
      this.dialogImageVisible = true
      this.$nextTick(() => {
        this.iframeInit()
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcess(row.deploymentId).then(response => {
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
          this.uploadForm.append('file', this.file)
          this.uploadForm.append('name', this.temp.name)
          this.uploadForm.append('key', this.temp.key)
          this.uploadForm.append('category', this.temp.category)
          this.confirmLoading = true
          uploadFile(this.uploadForm).then(() => {
            this.confirmLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleDownLoad(row) {
      const url = process.env.VUE_APP_BASE_API + '/flow/runtime/process-definitions/resource/downloadXml/' + row.id
      window.open(url, '_blank')
    }
  }
}
</script>

<style>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>

