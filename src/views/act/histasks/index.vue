<template>
  <div class="app-container">
    <div class="filter-header">
      <el-button plain icon="el-icon-coordinate" @click="showClick">{{ showTitle }}</el-button>
    </div>
    <div v-show="showStatus" class="filter-container">
      <el-input v-model="listQuery.businessName" placeholder="流程名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.businessKey" placeholder="业务ID" style="width: 200px;" class="filter-item" />
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
      <el-table-column label="已办节点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="text" title="查看流程图" icon="el-icon-view" @click="handleImage(row)">流程信息</el-button>
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
    <el-dialog title="流程跟踪" :visible.sync="dialogImageVisible">
      <el-tabs v-model="activeName">
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
        <el-tab-pane label="流程图" name="image">
          <div class="block">
            <el-image :src="src">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
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

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      src: '',
      dialogImageVisible: false,
      recordsLoading: true,
      showStatus: false,
      showTitle: '查询',
      activeName: 'records',
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
      this.listQuery.businessName = ''
      this.listQuery.businessType = ''
      this.listQuery.businessKey = ''
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
      this.showTitle = this.showStatus === true ? '隐藏' : '查询'
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
      this.src = process.env.VUE_APP_BASE_API + '/flow/runtime/image/' + row.processInstanceId
      this.dialogImageVisible = true
    }
  }
}
</script>
