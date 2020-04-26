<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="字典名称" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        v-if="hasPerm('dict:add')"
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字典类型" align="center">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="hasPerm('dict:edit')" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button v-if="hasPerm('dict:edit')" type="warning" size="mini" icon="el-icon-goblet-square-full" @click="handleitemDialog(row)" />
          <el-button v-if="hasPerm('dict:delete')" size="mini" type="danger" icon="el-icon-delete" @click="handleModifyStatus(row,$index)" />
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="margin-left:20px;">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="字典描述" prop="description">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="type+'字典子项'" :visible.sync="dialogItemVisible">
      <div class="filter-container">
        <el-input v-model="listItemQuery.label" placeholder="字典名称" style="width: 200px;" class="filter-item" size="small" />
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getItemList"
        >查询</el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="success"
          icon="el-icon-edit"
          size="small"
          @click="handleItemCreate"
        >新增</el-button>
      </div>
      <el-table
        v-loading="listItemLoading"
        :data="listItem"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="标签名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字典值" align="center">
          <template slot-scope="scope">{{ scope.row.value }}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleItemUpdate(row)" />
            <el-button v-if="row.isDeleted!='1'" size="mini" type="danger" icon="el-icon-delete" @click="handleItemUpdate(row,$index)" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogItemFormVisible" width="40%">
      <el-form ref="dataItemForm" :rules="rules" :model="itemForm" label-position="left" label-width="80px" style="margin-left:10px;">
        <el-form-item label="标签名" prop="label">
          <el-input v-model="itemForm.label" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input v-model="itemForm.value" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="itemForm.sort" :min="1" label="排序" />
        </el-form-item>
        <el-form-item label="字典描述" prop="description">
          <el-input v-model="itemForm.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogItemFormVisible = false">
          取消
        </el-button>
        <el-button :loading="confirmLoading" type="primary" @click="dialogStatus==='create'?createItemData():updateItemData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { pageDict, pageItemDict, createDict, updateDict, deleteDict, createDictItem, updateDictItem, deleteDictItem } from '@/api/sys/dict.js'

export default {
  name: 'Dict',
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
      listItem: null,
      total: 0,
      listLoading: true,
      listItemLoading: true,
      confirmLoading: false,
      currentId: undefined,
      defaultProps: { children: 'children', label: 'label' },
      listQuery: {
        current: 1,
        size: 20,
        name: ''
      },
      listItemQuery: {
        pid: null,
        label: null
      },
      type: '',
      dialogFormVisible: false,
      dialogItemVisible: false,
      dialogItemFormVisible: false,
      dialogStatus: '',
      treeData: null,
      temp: {
        id: undefined,
        name: '',
        type: '',
        description: ''
      },
      itemForm: {
        id: undefined,
        pid: null,
        label: '',
        value: '',
        sort: 10,
        description: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'change' }],
        type: [{ required: true, message: '请输入字典类型', trigger: 'change' }],
        label: [{ required: true, message: '请输入标签名', trigger: 'change' }],
        value: [{ required: true, message: '请输入字典值', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      pageDict(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listQuery.current = response.data.current
        this.listQuery.size = response.data.size
        this.listLoading = false
      })
    },
    getItemList() {
      this.listItemLoading = true
      pageItemDict(this.listItemQuery).then(response => {
        this.listItem = response.data.records
        this.listItemLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        description: ''
      }
    },
    resetItemForm() {
      this.itemForm = {
        id: undefined,
        pid: this.listItemQuery.pid,
        label: '',
        value: '',
        sort: 10,
        description: ''
      }
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleItemCreate() {
      this.resetItemForm()
      this.dialogStatus = 'create'
      this.dialogItemFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataItemForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleItemUpdate(row) {
      // 打开子项编辑dialog
      this.itemForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogItemFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataItemForm'].clearValidate()
      })
    },
    handleitemDialog(row) {
      // 字典子项
      this.dialogItemVisible = true
      this.listItemQuery.pid = row.id
      this.type = row.type
      this.getItemList()
    },
    handleDelete(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(row.id).then(response => {
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
    handleItemDelete(row, index) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictItem(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.listItem.splice(index, 1)
        })
      })
    },
    createData() {
      // 新增
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          createDict(this.temp).then(() => {
            this.confirmLoading = false
            this.temp.createDate = new Date()
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    createItemData() {
      // 新增
      this.$refs['dataItemForm'].validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          createDictItem(this.itemForm).then(() => {
            this.confirmLoading = false
            this.listItem.unshift(this.itemForm)
            this.dialogItemFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    updateData() {
      // 修改
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.confirmLoading = true
          updateDict(tempData).then(() => {
            this.confirmLoading = false
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    updateItemData() {
      // 修改
      this.$refs['dataItemForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.itemForm)
          this.confirmLoading = true
          updateDictItem(tempData).then(() => {
            this.confirmLoading = false
            const index = this.listItem.findIndex(v => v.id === this.itemForm.id)
            this.listItem.splice(index, 1, this.itemForm)
            this.dialogItemFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      }).catch(() => {
        this.confirmLoading = false
      })
    }
  }
}
</script>
