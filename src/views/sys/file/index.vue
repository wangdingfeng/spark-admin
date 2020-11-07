<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-upload"
        plain
        @click="handleCreate"
      >上传</el-button>
    </div>
    <div v-show="showStatus" class="filter-container">
      <el-input
        v-model="listQuery.fileName"
        placeholder="文件名称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.fileType"
        placeholder="文件类型"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="文件状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label+'('+item.value+')'"
          :value="item.value"
        />
      </el-select>
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="文件名称" align="center">
        <template slot-scope="scope">{{ scope.row.fileName }}</template>
      </el-table-column>
      <el-table-column label="文件类型" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.fileType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.fileSize | sizeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务ID" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.bizId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.bizType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件状态" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.status | dictLabel('file_status') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownLoad(row)"
          >下载</el-button>
          <el-button
            size="mini"
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
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="160px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="文件" prop="file">
          <el-upload
            class="upload-demo"
            :action="actionUrl"
            :headers="headers"
            :file-list="fileList"
            :on-remove="handleRemove"
            :on-success="hadleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import { filePage, deleteFile } from '@/api/sys/file.js'
import { getDictList } from '@/utils/dict'
import { formatBytes } from '@/utils'

export default {
  name: 'File',
  components: { Pagination },
  directives: { waves },
  filters: {
    sizeFormat(val) {
      return formatBytes(val)
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      headers: { Authorization: 'Bearer ' + getToken() },
      actionUrl: process.env.VUE_APP_BASE_API + '/file/file-info/upload',
      fileList: [],
      statusOptions: getDictList('file_status'),
      showStatus: false,
      showTitle: '查询',
      confirmLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        fileName: '',
        fileType: '',
        status: '1'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      filePage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery.fileName = ''
      this.listQuery.fileType = ''
      this.listQuery.status = ''
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
    },
    handleRemove(file, fileList) {
      console.log(file)
    },
    hadleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$message({
          message: '上传成功，文件ID:' + response.data.id,
          type: 'success'
        })
        this.dialogFormVisible = true
      } else {
        this.$message({
          message: '上传失败',
          type: 'errot'
        })
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.fileList = []
    },
    handleDownLoad(row) {
      const url = process.env.VUE_APP_BASE_API + '/file/file-info/api/' + row.id
      window.open(url, '_blank')
    },
    handleModifyStatus(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    }
  }
}
</script>
