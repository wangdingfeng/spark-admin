<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
      <el-button
        v-if="hasPerm('quartz:add')"
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        plain
        @click="handleCreate"
      >新增</el-button>
    </div>
    <div v-show="showStatus" class="filter-container">
      <el-input v-model="listQuery.name" placeholder="任务名" style="width: 200px;" class="filter-item" />
      <el-select
        v-model="listQuery.jobGroup"
        placeholder="任务组"
        clearable
        class="filter-item"
        style="width: 180px"
      >
        <el-option
          v-for="item in groupDict"
          :key="item.value"
          :label="item.label+'('+item.value+')'"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.concurrent"
        placeholder="任务类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in typeDict"
          :key="item.value"
          :label="item.label+'('+item.value+')'"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.concurrent"
        placeholder="是否并发"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in yesNoDict"
          :key="item.value"
          :label="item.label+'('+item.value+')'"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusDict"
          :key="item.value"
          :label="item.label+'('+item.value+')'"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        size="small"
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
      <el-table-column
        label="行号"
        type="index"
        width="50"
      />
      <el-table-column label="任务名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="任务组" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobGroup | dictLabel('quartz_group') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type | dictLabel('quartz_type') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调用目标串" align="center" width="280">
        <template slot-scope="scope">
          <span>{{ scope.row.invokeTarget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cron表达式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cronExpression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行错误策略" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.misfirePolicy | dictLabel('quartz_misfire_policy') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否并发" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.concurrent | dictLabel('yes_no') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status | dictLabel('quartz_status') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="140">
        <template slot-scope="scope">
          <span> {{ scope.row.createDate | parseTime }} </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            v-if="hasPerm('quartz:edit')"
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >编辑</el-button>
          <el-button
            v-if="hasPerm('quartz:edit') && row.status === '1'"
            type="text"
            size="mini"
            icon="el-icon-video-pause"
            @click="handleQuartzStatus(row,$index)"
          >暂停</el-button>
          <el-button
            v-if="hasPerm('quartz:edit') && row.status === '0'"
            type="text"
            size="mini"
            icon="el-icon-video-play"
            @click="handleQuartzStatus(row,$index)"
          >开启</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-refresh"
            @click="handleRun(row)"
          >运行</el-button>
          <router-link :to="{path:'quartz-log',query:{id: row.id}}">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-document"
            >日志</el-button>
          </router-link>
          <el-button
            v-if="hasPerm('quartz:delete')"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="100px" style="margin-left:10px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="type">
              <el-select v-model="form.type" placeholder="选择任务类型">
                <el-option
                  v-for="item in typeDict"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="选择任务组">
                <el-option
                  v-for="item in groupDict"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="调用目标串" prop="invokeTarget">
          <el-input v-model="form.invokeTarget" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" auto-complete="off">
            <el-button v-if="!showCronBox" slot="append" icon="el-icon-arrow-up" title="打开图形配置" @click="showCronBox = true" />
            <el-button v-else slot="append" icon="el-icon-arrow-down" title="关闭图形配置" @click="showCronBox = false" />
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top: -10px; margin-bottom:0px;">
          <cron v-if="showCronBox" v-model="form.cronExpression" />
          <span style="color: #E6A23C; font-size: 12px;">corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行错误策略" prop="misfirePolicy">
              <el-select v-model="form.misfirePolicy" placeholder="选择执行错误策略">
                <el-option
                  v-for="item in cronExpressionDict"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-select v-model="form.concurrent" placeholder="选择是否并发">
                <el-option
                  v-for="item in yesNoDict"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="confirmLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import cron from './components/cron'
import { pageQuartz, deleteQuartz, changeStatus, addQuartz, updateQuartz, runQuartz } from '@/api/sys/quartz.js'
import { getDictList } from '@/utils/dict'

export default {
  name: 'Quartz',
  components: { Pagination, cron },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const typeMap = {
        '0': 'warning',
        '1': 'success'
      }
      return typeMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      showCronBox: false,
      confirmLoading: false,
      dialogFormVisible: false,
      groupDict: getDictList('quartz_group'),
      typeDict: getDictList('quartz_type'),
      statusDict: getDictList('quartz_status'),
      cronExpressionDict: getDictList('quartz_misfire_policy'),
      yesNoDict: getDictList('yes_no'),
      dialogStatus: '',
      showStatus: false,
      showTitle: '查询',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      form: {
        id: undefined,
        name: '',
        jobGroup: '',
        type: '',
        invokeTarget: '',
        cronExpression: '',
        misfirePolicy: '',
        concurrent: ''
      },
      listQuery: {
        current: 1,
        size: 20,
        name: null,
        jobGroup: null,
        concurrent: null,
        status: null
      },
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        jobGroup: [{ required: true, message: '请输入任务组', trigger: 'change' }],
        type: [{ required: true, message: '请输入标签名', trigger: 'change' }],
        invokeTarget: [{ required: true, message: '请输入标签名', trigger: 'change' }],
        cronExpression: [{ required: true, message: '请输入目标串', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageQuartz(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
    },
    resetForm() {
      this.form = {
        id: undefined,
        name: '',
        jobGroup: '',
        type: '0',
        invokeTarget: '',
        cronExpression: '',
        misfirePolicy: '0',
        concurrent: '1',
        status: '1'
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
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
        deleteQuartz(row.id).then(response => {
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
    handleRun(row) {
      this.$confirm('是否运行一次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        runQuartz(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '运行成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleQuartzStatus(row, index) {
      // 更新状态
      this.$confirm('是否确认此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const status = row.status === '1' ? '0' : '1'
        row.status = status
        changeStatus(row.id, status).then(response => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1, row)
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          addQuartz(this.form).then(response => {
            this.confirmLoading = false
            this.form.createDate = new Date()
            this.form.id = response.data.id
            this.list.unshift(this.form)
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          this.confirmLoading = true
          updateQuartz(tempData).then(() => {
            this.confirmLoading = false
            const index = this.list.findIndex(v => v.id === this.form.id)
            this.list.splice(index, 1, this.form)
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
