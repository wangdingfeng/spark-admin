<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tableName" placeholder="表名" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
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
      <el-table-column label="表名" align="center">
        <template slot-scope="scope">{{ scope.row.tableName }}</template>
      </el-table-column>
      <el-table-column label="建表引擎" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.engine }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据行数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableRows }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自增主键当量值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.autoIncrement }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.createTime | parseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.updateTime | parseDate }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-share" @click="handleColumn(row)" />
          <el-button size="mini" type="danger" icon="el-icon-edit" @click="handleCreate(row)" />
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
    <el-dialog title="表字段信息" :visible.sync="dialogItemVisible">
      <el-table
        v-loading="listColumnLoading"
        :data="listColumn"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="列名" align="center">
          <template slot-scope="scope">{{ scope.row.columnName }}</template>
        </el-table-column>
        <el-table-column label="数据类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.columnType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否为空" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isNullable }}</span>
          </template>
        </el-table-column>
        <el-table-column label="默认值" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.columnDefault }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.columnComment }}</span>
          </template>
        </el-table-column>
        <el-table-column label="索引类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.columnKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主键自增" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.extra }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="创建" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="left" label-width="160px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模块名" prop="modelName">
          <el-input v-model="formData.modelName" />
        </el-form-item>
        <el-form-item label="父类包名" prop="parentPackage">
          <el-input v-model="formData.parentPackage" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="confirmLoading" type="primary" @click="createData">
          下载
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
import { tablePage, columnList } from '@/api/sys/gen.js'

export default {
  name: 'Gen',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseDate(time) {
      return parseTime(time, '{y}-{m}-{d} {h}:{i}')
    }
  },
  data() {
    return {
      list: null,
      listColumn: null,
      total: 0,
      listLoading: true,
      dialogItemVisible: false,
      listColumnLoading: false,
      dialogFormVisible: false,
      confirmLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        tableName: ''
      },
      formData: {
        tableName: '',
        modelName: '',
        parentPackage: '',
        author: ''
      },
      rules: {
        modelName: [{ required: true, message: '请输入模块名', trigger: 'change' }],
        parentPackage: [{ required: true, message: '请输入包名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      tablePage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    getColumnList(tableName) {
      this.listColumnLoading = true
      console.info(tableName)
      columnList({ tableName }).then(response => {
        this.listColumn = response.data
        this.listColumnLoading = false
      })
    },
    resetFormData() {
      this.formData = {
        tableName: '',
        modelName: '',
        parentPackage: '',
        author: ''
      }
    },
    handleColumn(row) {
      this.dialogItemVisible = true
      this.getColumnList(row.tableName)
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate(row) {
      this.resetFormData()
      this.formData.tableName = row.tableName
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$download('/admin/gen/zip', {
            tableName: this.formData.tableName,
            modelName: this.formData.modelName,
            parentPackage: this.formData.parentPackage,
            author: this.formData.author
          }, `${this.formData.tableName}_code.zip`)
        }
      })
    }
  }
}
</script>
