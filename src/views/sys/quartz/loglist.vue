<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="任务名称" align="center">
        <template slot-scope="scope">{{ scope.row.jobName }}</template>
      </el-table-column>
      <el-table-column label="任务组名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobGroup | dictLabel('quartz_group') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.invokeTarget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status | dictLabel('quartz_log_status') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.endTime | parseTime }} </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.createTime | parseTime }} </span>
        </template>
      </el-table-column>
      <el-table-column label="运行时间(ms)" align="center">
        <template slot-scope="scope">
          <el-tag type="warning"> {{ scope.row.times }} </el-tag>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { pageLog } from '@/api/sys/quartz.js'
import { getDictList } from '@/utils/dict'

export default {
  name: 'Log',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const typeMap = {
        '1': 'danger',
        '0': 'success'
      }
      return typeMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      statusDict: getDictList('quartz_log_status'),
      listQuery: {
        current: 1,
        size: 20,
        jobId: null,
        status: null
      }
    }
  },
  created() {
    if (this.$route.query) {
      this.listQuery.jobId = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageLog(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>
