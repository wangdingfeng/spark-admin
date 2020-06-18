<template>
  <div v-show="isShow" class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+articleStatus">
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.link" />
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >重新提交</el-button>
        <el-button v-loading="loading" type="warning" @click="backOver">关闭流程</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="Title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>标题</MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="作者:" class="postInfo-container-item">
                    <el-input v-model="postForm.author" />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.publishTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      placeholder="Select date and time"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="90px" label="重要性:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="概括:">
          <el-input
            v-model="postForm.contentShort"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the content"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { backEditArticle, getArticle } from '@/api/cms/article.js'

const defaultForm = {
  status: '0',
  title: '', // 文章题目
  author: '',
  content: '', // 文章内容
  contentShort: '', // 文章摘要
  link: '', // 文章外链
  publishTime: undefined, // 前台展示时间
  id: undefined,
  platforms: '["a-platform"]',
  platformsArray: ['a-platform'],
  isOriginal: '',
  importance: 0
}

export default {
  name: 'BackArticleDetail',
  components: { Tinymce, MDinput, Sticky, PlatformDropdown, SourceUrlDropdown },
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
      postForm: Object.assign({}, defaultForm),
      loading: false,
      articleStatus: 'draft',
      auditForm: {
        articleId: null,
        taskId: '',
        result: false,
        processInstanceId: '',
        taskDefinitionKey: '',
        article: null
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.contentShort.length
    }
  },
  created() {
    this.fetchData(this.paramsData.articleId)
    Object.assign(this.auditForm, this.paramsData)
  },
  methods: {
    fetchData(id) {
      getArticle(id).then(response => {
        this.postForm = response.data
        this.postForm.platformsArray = JSON.parse(response.data.platforms)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.auditForm.result = true
          this.postForm.platforms = JSON.stringify(this.postForm.platformsArray)
          this.auditForm.article = this.postForm
          backEditArticle(this.auditForm).then(response => {
            this.$notify({
              title: '重新提交',
              message: '重新提交成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
            // 调用全局挂载的方法
            this.$store.dispatch('tagsView/delView', this.$route)
            // 返回上一步路由
            this.$router.go(-1)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    backOver() {
      this.auditForm.result = false
      this.postForm.platforms = JSON.stringify(this.postForm.platformsArray)
      this.auditForm.article = this.postForm
      backEditArticle(this.auditForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success',
          showClose: true,
          duration: 1000
        })
        // 调用全局挂载的方法
        this.$store.dispatch('tagsView/delView', this.$route)
        // 返回上一步路由
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';

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

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
