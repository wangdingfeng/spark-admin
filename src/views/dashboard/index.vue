<template>
  <div class="dashboard-container">
    <el-row :gutter="15">
      <el-alert
        title="Spark 开发平台基于 Spring Cloud Hoxton 、Spring Boot 2.2、 OAuth2 、Security、flowable、vue-element前后端分离的脚手架平台"
        type="success"
        :closable="false"
      >
        <a target="_blank" href="https://github.com/wangdingfeng/spark-platform">
          <img
            style="height: 100%;"
            src="https://img.shields.io/github/stars/wangdingfeng/spark-platform"
          >
          <img
            style="height: 100%;"
            src="https://img.shields.io/github/forks/wangdingfeng/spark-platform"
          >
        </a>
      </el-alert>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="user-block">
          <img class="img-circle" :src="avatar">
          <span class="description"><i class="el-icon-tableware" />{{ hoursTips }}</span>
          <span class="username"><i class="el-icon-user" /> {{ roleNames.join(' | ') }}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <panel-group :index-data="indexData" :task-num="taskNum" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <line-chart :chart-data="lineChartData" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-card class="card" shadow="never">
          <div slot="header">
            <span>服务名 : 端口</span>
            <div style="float: right;">描述</div>
          </div>
          <table class="table">
            <tr>
              <td>spark-auth : 9000</td>
              <td>Spring Cloud eureka注册中心</td>
            </tr>
            <tr>
              <td>spark-gateway : 9001</td>
              <td>Spring Cloud Gateway网关</td>
            </tr>
            <tr>
              <td>spark-control : 9002</td>
              <td>Spring Boot Admin监控</td>
            </tr>
            <tr>
              <td>spark-tx-manager : 9003</td>
              <td>分布式事务</td>
            </tr>
            <tr>
              <td>spark-auth : 9010</td>
              <td>授权服务 oauth2</td>
            </tr>
            <tr>
              <td>spark-admin : 9020</td>
              <td>通用用户权限管理模块</td>
            </tr>
            <tr>
              <td>spark-flowable : 9030</td>
              <td>工作流模块</td>
            </tr>
            <tr>
              <td>spark-cms : 9040</td>
              <td>内容管理模块</td>
            </tr>
            <tr>
              <td>spark-quartz : 9050</td>
              <td>定时任务调度模块</td>
            </tr>
            <tr>
              <td>spark-file : 9080</td>
              <td>文件服务模块</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getData } from '@/api/index.js'
import { countAct } from '@/api/act/tasks.js'

export default {
  name: 'Dashboard',
  components: { PanelGroup, LineChart },
  data() {
    return {
      indexData: {},
      taskNum: 0,
      lineChartData: {}
    }
  },
  computed: {
    ...mapGetters(['name', 'roleNames', 'account', 'roles']),
    avatar() {
      return require(`@/assets/avatar/${this.$store.state.user.avatar}`)
    },
    hoursTips() {
      const date = new Date()
      if (date.getHours() >= 0 && date.getHours() < 12) {
        return '上午好，' + this.name + '，又是活力满满的一天'
      } else if (date.getHours() < 18) {
        return '下午好，' + this.name + '，子曰：中午不睡,下午瞌睡'
      } else {
        return '晚上好，' + this.name + '，结束一天的疲惫，洗个澡吧'
      }
    }
  },
  created() {
    this.getIndexData()
  },
  methods: {
    getIndexData() {
      getData().then(response => {
        this.indexData = response.data
        this.lineChartData = response.data.visitsVo
      })
      countAct({ userId: this.account }).then(response => {
        this.taskNum = response.data
      })
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
  .table {
    width: 100%;
    color: #666;
    border-collapse: collapse;
    background-color: #fff;

    td {
      position: relative;
      min-height: 20px;
      padding: 9px 15px;
      font-size: 14px;
      line-height: 20px;
      border: 1px solid #e6e6e6;

      &:first-child {
        width: 50%;
        text-align: left;
      }
    }
  }
  .user-block {
    margin-top: 18px;
    padding: 10px;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    height: 108px;
    .username,
    .description {
      font-size: 16px;
      display: block;
      margin-left: 110px;
      padding: 10px 0;
    }

    .username{
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border: 2px solid rgba(120, 130, 140, 0.13);
      border-radius: 50%;
      width: 6rem;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
</style>
