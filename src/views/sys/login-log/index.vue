<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" size="small" placeholder="用户名" style="width: 200px;" class="filter-item" />
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
      <el-table-column label="用户账号" align="center">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="登录系统" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.system }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录浏览器" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.locationIp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录地点" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.loginTime | parseTime }} </span>
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
import { pageLoginLog } from '@/api/sys/log.js'

export default {
  name: 'Log',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 20,
        username: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageLoginLog(this.listQuery).then(response => {
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
