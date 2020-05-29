<template>
  <iframe
    ref="iframe"
    v-loading.fullscreen.lock="fullscreenLoading"
    :src="src"
    class="iframe"
  />
</template>

<script>
export default {
  name: 'MyModel',
  data() {
    return {
      fullscreenLoading: false,
      src: process.env.VUE_APP_BASE_API + '/flow/flowable/index.html'
    }
  },
  created() {
    this.fullscreenLoading = true
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.fullscreenLoading = false
        })
      } else {
        iframe.onload = () => {
          this.fullscreenLoading = false
        }
      }
    }
  }
}
</script>

<style>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
