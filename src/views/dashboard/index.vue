<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ hoursTips }}</div>
    <panel-group />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'Dashboard',
  components: { PanelGroup },
  computed: {
    ...mapGetters([
      'name'
    ]),
    hoursTips() {
      const date = new Date()
      if (date.getHours() >= 0 && date.getHours() < 12) {
        return '上午好:' + this.name + ',又是活力满满的一天'
      } else if (date.getHours() < 18) {
        return '下午好' + this.name + '孔子曰：中午不睡,下午瞌睡'
      } else {
        return '晚上好' + this.name + '结束一天的疲惫，洗个澡吧'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
