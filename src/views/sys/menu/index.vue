<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="菜单名称" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="菜单类型" />
      <el-table-column prop="i_frame" label="是否外链" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="component" label="组件路径" />
      <el-table-column prop="permission" label="权限" />
      <el-table-column prop="hidden" label="是否隐藏" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="createDate" label="创建时间" width="200" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.isDeleted!='1'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import { listData } from '@/api/sys/menu.js'
export default {
  name: 'Menu',
  directives: { waves },
  data() {
    return {
      listLoading: false,
      listQuery: {
        name: ''
      },
      tableData: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listData(this.listQuery).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    handleCreate() {
      console.info('111')
    },
    handleUpdate(row) {

    },
    handleModifyStatus(row, status) {

    }
  }
}
</script>
