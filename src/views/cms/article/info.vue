<template>
  <div>
    <article-info :id="articleId" />
  </div>
</template>

<script>
import ArticleInfo from './components/ArticleInfo'

export default {
  name: 'ArticlePage',
  components: { ArticleInfo },
  data() {
    return {
      articleId: null
    }
  },
  created() {
    this.articleId = this.$route.params && this.$route.params.id
  }
}
</script>

