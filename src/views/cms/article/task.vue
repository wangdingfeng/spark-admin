<template>
  <div>
    <component :is="component" />
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
      component: 'AuditDetail'
    }
  },
  created() {
    if (this.$route.query) {
      if (this.$route.query.taskDefinitionKey === 'submit_approval') {
        this.component = 'BackDetail'
      }
    }
  }
}
</script>

