<template>
  <el-dialog
    title="菜单图标"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-tabs v-model="activeName" style="margin-top: -1rem;">
      <el-tab-pane label="通用类" name="first">
        <ul>
          <li v-for="icon in icons.svgIcons" :key="icon">
            <span :class="{'active':activeIndex === icon}">
              <svg-icon :icon-class="icon" :title="icon" @click.native="chooseIcon(icon)" />
            </span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">
        取消
      </el-button>
      <el-button type="primary" plain @click="confirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import svgIcons from './svg-icons'

export default {
  name: 'Icons',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: {
        svgIcons
      },
      activeIndex: '',
      choosedIcon: '',
      activeName: 'first',
      screenWidth: 0,
      width: this.initWidth()
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '60%'
      } else {
        return '900px'
      }
    },
    close() {
      this.$emit('close')
      this.activeName = 'first'
      this.choosedIcon = this.activeIndex = ''
    },
    chooseIcon(icon) {
      this.activeIndex = icon
      this.choosedIcon = icon
      this.$message({
        message: '已选择图标' + icon,
        type: 'success'
      })
    },
    confirm() {
      if (!this.choosedIcon) {
        this.$message({
          message: '没有选择图标',
          type: 'warning'
        })
        return
      }
      this.$emit('choose', this.choosedIcon)
      this.activeName = 'first'
      this.choosedIcon = this.activeIndex = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  ul {
    overflow-y: auto;
    padding-left: .5rem;
    margin-top: -.8rem;
  .icon-item {
      margin: 20px;
      height: 85px;
      text-align: center;
      width: 100px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }
    li {
      list-style: none;
      float: left;
      width: 80px;
      text-align: center;
      cursor: pointer;
      color: #555;
      transition: color .3s ease-in-out,background-color .3s ease-in-out;
      position: relative;
      margin: 3px 0;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      padding: 10px 0 0;
    }
    .svg-icon {
      width: 1.5em;
      height: 1.5em;
    }
  }
</style>
