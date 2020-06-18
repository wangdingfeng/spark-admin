<template>
  <div v-show="isShow" class="createPost-container">
    <div class="btn-header">
      <el-button
        v-loading="loading"
        style="margin-left: 10px;"
        type="success"
        @click="auditPass"
      >审核通过</el-button>
      <el-button v-loading="loading" type="warning" @click="auditFaile">审核拒绝</el-button>
    </div>
    <article-info :id="paramsData.articleId" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleInfo from './ArticleInfo'
import { auditArticle } from '@/api/cms/article.js'
import { executeTask } from '@/api/act/tasks.js'

export default {
  name: 'ArticleAudit',
  components: { ArticleInfo },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    paramsData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      auditForm: {
        articleId: null,
        taskId: '',
        result: false,
        processInstanceId: '',
        comment: '',
        taskDefinitionKey: ''
      }
    }
  },
  computed: {
    ...mapGetters(['account'])
  },
  created() {
    this.auditForm = Object.assign(this.auditForm, this.paramsData)
    // 组长审核节点需要先签收任务在操作任务
    if (this.auditForm.taskDefinitionKey === 'group_leader_approve') {
      this.fetchclaim(this.auditForm.taskId)
    }
  },
  methods: {
    fetchclaim(taskId) {
      // 签收任务
      const executeData = {
        taskId: taskId,
        action: 'claim',
        assignee: this.account
      }
      executeTask(executeData).then(response => {
        this.$message({
          type: 'success',
          message: response.msg
        })
      })
    },
    auditPass() {
      this.$confirm('是否确认操作通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.auditForm.result = true
        auditArticle(this.auditForm).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loading = false
          // 调用全局挂载的方法
          this.$store.dispatch('tagsView/delView', this.$route)
          // 返回上一步路由
          this.$router.go(-1)
        })
      })
    },
    auditFaile() {
      this.$prompt('审核意见:', '填写审核意见', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea'
      }).then(({ value }) => {
        this.loading = true
        this.auditForm.result = false
        this.auditForm.comment = value
        auditArticle(this.auditForm).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loading = false
          // 调用全局挂载的方法
          this.$store.dispatch('tagsView/delView', this.$route)
          // 返回上一步路由
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@mixin clearfix {
  &:before {
    display: table;
    content: '';
    clear: both;
  }

  &:after {
    display: table;
    content: '';
    clear: both;
  }
}
.createPost-container {
  position: relative;
}
.btn-header {
  background: #d0d0d0;
  padding: 10px 10px;
  padding-right: 40px;
  text-align: right;
}
</style>
