<template>
  <div>
    <audit-detail :is-show="isAuditShow" :params-data="paramsData" />
    <BackDetail :is-show="isBackShow" :params-data="paramsData" />
  </div>
</template>

<script>
import AuditDetail from './components/AuditDetail'
import BackDetail from './components/BackDetail'

export default {
  name: 'ArticleTask',
  components: { AuditDetail, BackDetail },
  data() {
    return {
      isAuditShow: true,
      isBackShow: false,
      paramsData: {
        articleId: null,
        taskId: '',
        taskDefinitionKey: '',
        processInstanceId: ''
      }
    }
  },
  created() {
    if (this.$route.query) {
      Object.assign(this.paramsData, this.$route.query)
      this.paramsData.articleId = this.$route.query.id
      if (this.paramsData.taskDefinitionKey === 'submit_approval') {
        this.isBackShow = true
        this.isAuditShow = false
      }
    }
  }
}
</script>

