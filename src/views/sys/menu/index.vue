<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="菜单名称" style="width: 200px;" class="filter-item" clearable />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        plain
        @click="getList"
      >查询</el-button>
      <el-button
        v-if="hasPerm('menu:add')"
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-edit"
        plain
        @click="handleCreate"
      >新增</el-button>
      <el-button type="text" style="float:right" class="filter-item" @click="unfold">{{ expandText }}<i class="el-icon-edit" /></el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      element-loading-text="加载中"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="菜单类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '0'">目录</span>
          <span v-else-if="scope.row.type === '1'">菜单</span>
          <span v-else>按钮</span>
        </template>
      </el-table-column>
      <el-table-column prop="iFrame" label="是否外链">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" :show-overflow-tooltip="true" width="180" />
      <el-table-column prop="component" label="组件路径" width="180" />
      <el-table-column prop="permission" label="权限" />
      <el-table-column prop="hidden" label="是否隐藏">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="hasPerm('menu:edit')" type="text" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="hasPerm('menu:delete')" type="text" size="mini" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 700px; margin-left:50px;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="temp.type" size="mini">
            <el-radio-button v-for="(type, index) in menuTypeList" :key="index" :label="index">{{ type }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <treeselect v-model="temp.pid" :normalizer="normalizer" :multiple="false" :options="treeData" clear-value-text="清除" placeholder=" " style="width:100%" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="temp.type.toString() !== '2'" label="图标" prop="icon">
              <el-input v-model="temp.icon">
                <el-button slot="append" icon="el-icon-brush" @click="chooseIcons" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-show="temp.type.toString() !== '2'" label="是否外链" prop="iFrame">
              <el-radio-group v-model="temp.iFrame" size="mini">
                <el-radio-button label="true">是</el-radio-button>
                <el-radio-button label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否隐藏" prop="hidden">
              <el-radio-group v-model="temp.hidden" size="mini">
                <el-radio-button label="true">是</el-radio-button>
                <el-radio-button label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-show="temp.type.toString() !== '2'" label="路由地址" prop="path">
              <el-input v-model="temp.path" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="temp.iFrame.toString() === 'false' && temp.type.toString() === '1'" label="组件路径" prop="component">
              <el-input v-model="temp.component" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-show="temp.type.toString() !== '0'" label="权限" prop="permission">
          <el-input v-model="temp.permission" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="temp.sort" :min="1" label="排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :loading="confirmLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <Icons
      :dialog-visible="iconVisible"
      @close="iconVisible = false"
      @choose="chooseIcon"
    />
  </div>
</template>
<script>
import waves from '@/directive/waves'
import Icons from './Icons'
import { listData, saveMenu, updateMenu, deleteMenu } from '@/api/sys/menu.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Menu',
  directives: { waves },
  components: { Icons, Treeselect },
  data() {
    return {
      listLoading: false,
      confirmLoading: false,
      iconVisible: false,
      listQuery: {
        name: ''
      },
      tableData: [],
      expandText: '展开全部',
      isShowTable: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        pid: '',
        name: '',
        icon: '',
        type: '0',
        iFrame: false,
        path: '',
        component: null,
        permission: '',
        hidden: false,
        sort: 10
      },
      treeData: [{
        id: 0,
        name: '根目录',
        children: []
      }],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      menuTypeList: ['目录', '菜单', '按钮'],
      rules: {
        name: [{ required: true, message: '请输入菜单名', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.expandText = '展开全部'
      listData(this.listQuery).then(response => {
        this.tableData = response.data
        // 树节点添加根目录
        this.treeData[0].children = response.data
        this.listLoading = false
      })
    },
    unfold() {
      // 展开
      this.$nextTick(function() {
        this.isShowTable = !this.isShowTable
        this.isShowTable ? this.expandText = '关闭全部' : this.expandText = '展开全部'
        this.expandAll()
      })
    },
    expandAll() {
      // 获取点击的箭头元素
      const els = document.getElementsByClassName('el-table__expand-icon')
      for (let i = 0; i < els.length; i++) {
        els[i].click()
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: null,
        name: '',
        icon: '',
        type: '0',
        iFrame: false,
        component: null,
        path: '',
        permission: '',
        hidden: false,
        sort: 10
      }
    },
    chooseIcons() {
      this.iconVisible = true
    },
    chooseIcon(icon) {
      this.temp.icon = icon
      this.iconVisible = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    handleDelete(row) {
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    createData() {
      // 新增
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.iFrame) this.temp.component = null
          if (this.temp.type === '0') this.temp.component = 'Layout'
          this.confirmLoading = true
          saveMenu(this.temp).then(() => {
            this.confirmLoading = false
            this.getList()
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.iFrame) this.temp.component = null
          if (this.temp.type === 0) this.temp.component = 'Layout'
          this.confirmLoading = true
          updateMenu(this.temp).then(() => {
            this.confirmLoading = false
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    normalizer(node) {
      // 修改tree数据形式
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>
