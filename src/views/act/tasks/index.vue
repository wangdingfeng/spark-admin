<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="流程名称" style="width: 200px;" class="filter-item" />
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
          <span>{{ scope.row.businessType }}</span>
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
          <span>{{ scope.row.createTime | parseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" title="处理" icon="el-icon-edit" @click="handleImage(row)" />
          <el-button size="mini" type="primary" title="查看流程图" icon="el-icon-view" @click="handleImage(row)" />
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
          <el-table :data="gridData">
            <el-table-column property="taskId" label="任务ID" />
            <el-table-column property="activityName" label="当前节点" />
            <el-table-column label="开始时间">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime | parseDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="完成时间">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime | parseDate }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="流程图" name="image">
          <div class="block">
            <el-image :src="src">
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
import { parseTime } from '@/utils'
import { taskPage, recordList } from '@/api/act/tasks.js'

export default {
  name: 'User',
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
      total: 0,
      listLoading: true,
      activeName: 'records',
      src: '',
      confirmLoading: false,
      dialogImageVisible: false,
      listQuery: {
        current: 1,
        size: 20,
        userId: '',
        groupIds: [],
        name: ''
      },
      gridData: null
    }
  },
  computed: {
    ...mapGetters([
      'account',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
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
    getRecordList(row) {
      recordList(row.processInstanceId).then(response => {
        this.gridData = response.data
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleImage(row) {
      this.getRecordList(row)
      this.src = process.env.VUE_APP_BASE_API + '/flow/runtime/image/' + row.processInstanceId + '?' + Math.random()
      this.dialogImageVisible = true
    }
  }
}
</script>
