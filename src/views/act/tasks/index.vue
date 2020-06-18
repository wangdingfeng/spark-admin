<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
    </div>
    <div v-show="showStatus" class="filter-container">
      <el-input
        v-model="listQuery.businessName"
        placeholder="流程名称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.businessKey"
        placeholder="业务ID"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="业务类型"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in processTypeOptions"
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
      <el-table-column label="任务ID" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="业务ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.businessKey }}</span>
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
      <el-table-column label="当前节点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDeal(row)">处理</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleImage(row)">流程图</el-button>
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
            <el-table-column property="taskId" label="任务ID" />
            <el-table-column property="activityName" label="当前节点" />
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
import { taskPage, recordList } from '@/api/act/tasks.js'
import { getDictList, getDictItem } from '@/utils/dict'

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      recordsLoading: true,
      showStatus: false,
      showTitle: '查询',
      activeName: 'image',
      modelSrc: '',
      processTypeOptions: getDictList('processs_type'),
      dialogImageVisible: false,
      iframeLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        userId: '',
        groupIds: [],
        businessName: '',
        businessKey: '',
        businessType: ''
      },
      gridData: null
    }
  },
  computed: {
    ...mapGetters(['account', 'roles'])
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
      this.listQuery.groupIds = this.roles
      taskPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      this.listQuery.businessName = ''
      this.listQuery.businessType = ''
      this.listQuery.businessKey = ''
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
    },
    getRecordList(row) {
      recordList(row.processInstanceId).then(response => {
        this.recordsLoading = false
        this.gridData = response.data
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleImage(row) {
      this.getRecordList(row)
      this.modelSrc = process.env.VUE_APP_BASE_API + '/flow/flowable/instance/displayModel/' + row.processInstanceId
      this.dialogImageVisible = true
      this.$nextTick(() => {
        this.iframeInit()
      })
    },
    handleDeal(row) {
      const link = getDictItem('processs_type', row.businessType).value1
      this.$router.push({ path: link, query: { taskId: row.id, id: row.businessKey, taskDefinitionKey: row.taskDefinitionKey, processInstanceId: row.processInstanceId }})
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

