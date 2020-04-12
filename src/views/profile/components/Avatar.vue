<template>
  <el-dialog
    class="update-avatar"
    title="选择头像"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-tabs v-model="activeName" class="avatar-tabs">
      <el-tab-pane label="晴天娃娃" name="first">
        <template v-for="(avatar, index) in sunny">
          <div :key="index" class="avatar-wrapper">
            <img alt="点击选择" :src="resolveAvatar(avatar)" @click="change(avatar)">
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="其他" name="second">
        <template v-for="(avatar, index) in others">
          <div :key="index" class="avatar-wrapper">
            <img alt="点击选择" :src="resolveAvatar(avatar)" @click="change(avatar)">
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { updatetUserInfo } from '@/api/sys/user.js'
const sunny = [
  'sunny/1.jpg', 'sunny/2.jpg', 'sunny/3.jpg', 'sunny/4.jpg', 'sunny/5.jpg', 'sunny/6.jpg',
  'sunny/7.jpg', 'sunny/8.jpg', 'sunny/9.jpg', 'sunny/10.jpg', 'sunny/11.jpg', 'sunny/12.jpg'
]
const others = [
  'others/1.jpg', 'others/2.jpg', 'others/3.jpg', 'others/4.jpg', 'others/5.jpg', 'others/6.jpg',
  'others/7.jpg', 'others/8.jpg', 'others/9.jpeg'
]
export default {
  name: 'Avatar',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'first',
      screenWidth: 0,
      updating: false,
      width: this.initWidth(),
      sunny,
      others
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
    resolveAvatar(avatar) {
      return require(`@/assets/avatar/${avatar}`)
    },
    change(avatar) {
      if (this.updating) {
        this.$message({
          message: '正在更新',
          type: 'warning'
        })
        return
      }
      this.updating = true
      updatetUserInfo({ avatar }).then(() => {
        this.$emit('success', avatar)
        this.updating = false
      }).catch((r) => {
        console.error(r)
        this.$message({
          message: '更新失败',
          type: 'error'
        })
        this.updating = false
      })
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '55%'
      } else {
        return '820px'
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .update-avatar {
    padding: 0 1rem 1rem 1rem!important;
    .avatar-tabs {
      .avatar-wrapper {
        display: inline-block;
        img {
          width: 5rem;
          border-radius: 50%;
          display: inline-block;
          margin: .5rem;
          cursor: pointer;
        }
      }
    }
  }
</style>
