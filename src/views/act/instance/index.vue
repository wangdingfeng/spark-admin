<template>
  <div class="app-container">
    <div v-show="showStatus" class="filter-container">
      <div class="form-group">
        <label class="control-label">流程名称:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.name" placeholder="流程名称" style="width: 200px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">业务ID:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.businessKey" placeholder="流程名称" style="width: 200px;" />
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
        icon="el-icon-refresh-left"
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
      <el-table-column label="定义KEY" align="center">
        <template slot-scope="scope">{{ scope.row.processDefinitionKey }}</template>
      </el-table-column>
      <el-table-column label="流程名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.processDefinitionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.isEnded | tagFilters">
            {{ row.isEnded | endedFilters }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.isSuspended | tagFilters">
            {{ row.isSuspended | suspendedFilters }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" title="查看流程图" icon="el-icon-view" @click="handleImage(row)">查看</el-button>
          <el-button v-if="row.isSuspended != true" size="mini" type="text" title="挂起" icon="el-icon-circle-close" @click="handleModifyStatus(row,'suspend')">挂起</el-button>
          <el-button v-if="row.isSuspended" size="mini" type="text" title="激活" icon="el-icon-circle-check" @click="handleModifyStatus(row,'activate')">激活</el-button>
          <el-button size="mini" type="text" title="删除" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
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
        <el-tab-pane label="流程图" name="image">
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
import { instancePage, instanceAction, deleteInstance } from '@/api/act/instance.js'
import { recordList } from '@/api/act/tasks.js'

export default {
  name: 'InstanceList',
  components: { Pagination },
  directives: { waves },
  filters: {
    tagFilters(status) {
      if (status) {
        return 'danger'
      }
      return 'success'
    },
    endedFilters(status) {
      if (status) {
        return '结束'
      }
      return '进行中'
    },
    suspendedFilters(status) {
      if (status) {
        return '挂起'
      }
      return '激活'
    }
  },
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
      listQuery: {
        current: 1,
        size: 20,
        userId: null,
        name: null,
        businessKey: null
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
      instancePage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery.name = null
      this.listQuery.businessKey = ''
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
    handleModifyStatus(row, action) {
      this.$confirm('是否确认操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        instanceAction(row.processInstanceId, action).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    handleDelete(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInstance(row.processInstanceId).then(response => {
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
