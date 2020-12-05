<template>
  <div class="app-container">
    <div v-show="showStatus" class="filter-container">
      <div class="form-group">
        <label class="control-label">流程名称:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.businessName" placeholder="流程名称" style="width: 200px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">业务ID:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.businessKey" placeholder="业务ID" style="width: 200px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">业务编号:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.businessCode" placeholder="业务编号" style="width: 200px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">业务类型:</label>
        <div class="control-inline">
          <el-select
            v-model="listQuery.businessType"
            placeholder="业务类型"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in processTypeOptions"
              :key="item.value"
              :label="item.label+'('+item.value+')'"
              :value="item.value"
            />
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
      <div class="table-opts-left" />
      <div class="el-button-group table-opts-right">
        <el-button icon="el-icon-search" circle @click="showClick" />
        <el-button icon="el-icon-refresh" circle @click="handleFilter" />
      </div>
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
      <el-table-column label="任务ID" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="业务编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessType | dictLabel('processs_type') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已办节点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" title="查看流程图" icon="el-icon-view" @click="handleImage(row)">详情</el-button>
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
    <el-dialog title="流程跟踪" :visible.sync="dialogImageVisible" width="55%">
      <el-tabs v-model="activeName">
        <el-tab-pane label="实时流程图" name="image">
          <div style="height:500px">
            <iframe ref="iframe" v-loading="iframeLoading" :src="modelSrc" class="iframe" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="流程记录" name="records">
          <el-table v-loading="recordsLoading" :data="gridData">
            <el-table-column property="activityName" label="当前节点" />
            <el-table-column property="assignee" label="操作用户" />
            <el-table-column label="开始时间">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime | parseTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="完成时间">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime | parseTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="持续时间(ms)">
              <template slot-scope="scope">
                <el-tag type="success"> {{ scope.row.durationInMillis }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { histasksPage } from '@/api/act/histasks.js'
import { recordList } from '@/api/act/tasks.js'
import { getDictList } from '@/utils/dict'
import { resetData } from '@/utils'

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      modelSrc: '',
      dialogImageVisible: false,
      recordsLoading: true,
      showStatus: true,
      iframeLoading: false,
      activeName: 'image',
      processTypeOptions: getDictList('processs_type'),
      listQuery: {
        current: 1,
        size: 20,
        userId: '',
        businessName: '',
        businessKey: '',
        businessType: ''
      },
      gridData: null
    }
  },
  computed: {
    ...mapGetters([
      'account'
    ])
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
      this.listQuery.userId = this.account
      histasksPage(this.listQuery).then(response => {
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
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    getRecordList(row) {
      recordList(row.processInstanceId).then(response => {
        this.recordsLoading = false
        this.gridData = response.data
      })
    },
    handleImage(row) {
      this.getRecordList(row)
      this.modelSrc = process.env.VUE_APP_BASE_API + '/flow/flowable/instance/displayModel/' + row.processInstanceId
      this.dialogImageVisible = true
      this.$nextTick(() => {
        this.iframeInit()
      })
    }
  }
}
</script>
