<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <el-link type="primary" class="change-avatar" @click="dialogVisible = true">更新头像</el-link>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}({{ user.account }})</div>
        <div class="user-role text-center text-muted">{{ user.role }}</div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>介绍(Author:Spark)</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            Spark 是一款使用Spring Cloud Hoxton.RELEASE、Spring Cloud OAuth2 构建的权限管理系统，前端采用 vue-element-admin。
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>技能</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="50" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="90" />
          </div>
          <div class="progress-item">
            <span>Spring Cloud</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JAVA</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>
    <avatar
      :dialog-visible="dialogVisible"
      @close="dialogVisible = false"
      @success="changeSuccess"
    />
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import Avatar from './Avatar'

export default {
  components: { PanThumb, Avatar },
  props: {
    user: {
      type: Object,
      avatar: '',
      default: () => {
        return {
          name: '',
          account: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    avatar() {
      return require(`@/assets/avatar/${this.user.avatar}`)
    }
  },
  methods: {
    changeSuccess(avatar) {
      this.dialogVisible = false
      this.$message({
        message: '更新成功',
        type: 'success'
      })
      this.user.avatar = avatar
      this.$store.commit('SET_AVATAR', avatar)
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
