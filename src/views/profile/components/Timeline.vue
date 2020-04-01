<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2020/03/22',
          title: '项目开源',
          content: '此项目原来只是用作学习项目，但是学习的资源也是来源于开源的项目，抱着给大家分享的态度，所以将此项目开源'
        },
        {
          timestamp: '2020/03/24',
          title: '新功能添加',
          content: '添加API请求日志记录'
        },
        {
          timestamp: '2019/03/26',
          title: '新功能添加',
          content: '项目中字典功能的添加，但是前端页面上取字典静待完善'
        },
        {
          timestamp: '2019/03/27',
          title: '未发现bug修改',
          content: '一直用login登录没有发现注册服务存在跨域问题，解决网关的跨域问题，简化了代码，前端直接请求oauth/token获取token'
        }
      ]
    }
  }
}
</script>
