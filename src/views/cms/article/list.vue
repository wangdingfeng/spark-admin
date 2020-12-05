<template>
  <div class="app-container">
    <div v-show="showStatus" class="filter-container">
      <div class="form-group">
        <label class="control-label">文章标题:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.title" placeholder="文章标题" style="width: 180px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">作者:</label>
        <div class="control-inline">
          <el-input v-model="listQuery.author" placeholder="作者" style="width: 180px;" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">是否原创:</label>
        <div class="control-inline">
          <el-select v-model="listQuery.isOriginal" placeholder="是否原创" clearable style="width: 180px">
            <el-option v-for="item in isOriginalOptions" :key="item.value" :label="item.label+'('+item.value+')'" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">状态:</label>
        <div class="control-inline">
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 180px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label+'('+item.value+')'" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">发布时间:</label>
        <div class="control-inline">
          <el-date-picker v-model="publishTimeArgs" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 260px" />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">创建时间:</label>
        <div class="control-inline">
          <el-date-picker v-model="createDateArgs" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 260px" />
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
      <div class="table-opts-left">
        <router-link to="/article/create">
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="success"
            icon="el-icon-edit"
            plain
          >新增</el-button>
        </router-link>
      </div>
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
      <el-table-column label="文章标题" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/article/info/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重要性" align="center" width="120">
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="是否原创" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.isOriginal | dictLabel('yes_no') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.publishTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.status | dictLabel('article_status') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/article/edit/'+row.id">
            <el-button v-if="row.status === '0'" size="mini" type="text" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button v-if="row.status === '0'" size="mini" type="text" icon="el-icon-upload2" @click="handlePublish(row)">发布</el-button>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getDictList } from '@/utils/dict'
import { resetData } from '@/utils'

import {
  listArticle,
  publishArticle,
  deleteArticle
} from '@/api/cms/article.js'

export default {
  name: 'File',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      showStatus: true,
      isOriginalOptions: getDictList('yes_no'),
      statusOptions: getDictList('article_status'),
      publishTimeArgs: [],
      createDateArgs: [],
      listQuery: {
        current: 1,
        size: 20,
        title: null,
        author: null,
        isOriginal: null,
        status: null,
        publishTimeStr: null,
        createDateStr: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.publishTimeStr = this.publishTimeArgs.join(',')
      this.listQuery.createDateStr = this.createDateArgs.join(',')
      listArticle(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    reset() {
      resetData(this.listQuery, { current: 1, size: 20 })
      this.publishTimeArgs = []
      this.createDateArgs = []
    },
    showClick() {
      // 控制查询条件显示隐藏
      this.showStatus = !this.showStatus
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handlePublish(row) {
      this.$confirm('是否发布文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = '2'
        publishArticle(row).then(response => {
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleModifyStatus(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(row.id).then(response => {
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
