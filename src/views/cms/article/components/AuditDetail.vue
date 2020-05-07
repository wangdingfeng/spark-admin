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
    <div class="createPost-main-container">
      <div class="article__heading">
        <div class="article__heading__title">{{ article.title }}</div>
      </div>
      <div style="color: #ccc;">
        {{ article.author }} 发布于 {{ article.publishTime }}
        <p>{{ article.contentShort }}</p>
      </div>
      <div ref="content" class="node-article-content" v-html="article.content" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getArticle, auditArticle } from '@/api/cms/article.js'
import { executeTask } from '@/api/act/tasks.js'

export default {
  name: 'ArticleAudit',
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
      article: {
        title: '', // 文章题目
        content: '', // 文章内容
        author: '',
        contentShort: '', // 文章摘要
        link: '', // 文章外链
        publishTime: undefined, // 前台展示时间
        id: undefined,
        importance: 0
      },
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
    this.fetchData(this.auditForm.articleId)
    // 组长审核节点需要先签收任务在操作任务
    if (this.auditForm.taskDefinitionKey === 'group_leader_approve') {
      this.fetchclaim(this.auditForm.taskId)
    }
  },
  methods: {
    fetchclaim(taskId) {
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
    fetchData(id) {
      getArticle(id).then(response => {
        this.article = response.data
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

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}
.btn-header {
  background: #d0d0d0;
  padding: 10px 10px;
  padding-right: 40px;
  text-align: right;
}

.main-article {
  padding: 20px;
  margin: 0 auto;
  display: block;
  width: 740px;
  background: #fff;
}

.article__heading {
  position: relative;
  padding: 0 0 20px;
  overflow: hidden;
}

.article__heading__title {
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 32px;
  line-height: 48px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
}

.node-article-content {
  margin: 20px 0 0;
  @include clearfix;
  font-size: 16px;
  color: #333;
  letter-spacing: 0.5px;
  line-height: 28px;
  margin-bottom: 30px;
  font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman',
    Times, serif;

  & > :last-child {
    margin-bottom: 0;
  }

  b,
  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  p {
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
  }

  ul {
    margin-bottom: 30px;
  }

  li {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;

    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: normal;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    margin-left: 30px;
    margin-bottom: 14px;
  }

  a {
    text-decoration: none;
    background-repeat: repeat-x;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.84) 100%,
      rgba(0, 0, 0, 0) 0
    );
    background-size: 1px 1px;
    background-position: 0 calc(1em + 1px);
    padding: 0 6px;
  }

  code {
    background: rgba(0, 0, 0, 0.05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 16px;
    display: inline-block;
  }

  img {
    border: 0;
  }

  /* 解决 IE6-7 图片缩放锯齿问题 */
  img {
    -ms-interpolation-mode: bicubic;
  }

  blockquote {
    --x-height-multiplier: 0.375;
    --baseline-multiplier: 0.17;
    font-family: medium-content-serif-font, Georgia, Cambria, 'Times New Roman',
      Times, serif;
    letter-spacing: 0.01rem;
    font-weight: 400;
    font-style: italic;
    font-size: 21px;
    line-height: 1.58;
    letter-spacing: -0.003em;
    border-left: 3px solid rgba(0, 0, 0, 0.84);
    padding-left: 20px;
    margin-left: -23px;
    padding-bottom: 2px;
  }

  a {
    text-decoration: none;
  }

  h2,
  h3,
  h4 {
    font-size: 34px;
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin: 53px 0 0;
  }

  h4 {
    font-size: 26px;
  }
}
</style>
