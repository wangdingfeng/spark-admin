# Spark 平台 前端页面

> 根据[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template/blob/master/README-zh.md)改变而来。

#spark 平台前端

### 项目地址
 平台  | spark-platform（后端）|spark-admin（前端）
---|---|---
GitHub | [https://github.com/wangdingfeng/spark-platform](https://github.com/wangdingfeng/spark-platform)|[https://github.com/wangdingfeng/spark-admin](https://github.com/wangdingfeng/spark-admin)
Gitee  | [https://gitee.com/dreamfeng/spark-platform](https://gitee.com/dreamfeng/spark-platform)|[https://gitee.com/dreamfeng/spark-admin](https://gitee.com/dreamfeng/spark-admin)

![输入图片说明](https://images.gitee.com/uploads/images/2020/0322/161129_9b6c5726_1890906.png "屏幕截图.png")

## 开发

```bash
# 克隆项目
git clone https://gitee.com/dreamfeng/spark-admin.git

# 安装依赖
npm install

# 建议不要用 cnpm 安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:sit

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# --report to build with bundle size analytics
npm run build:prod

# --generate a bundle size analytics. default: bundle-report.html
npm run build:prod --generate_report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

详细文档可以参考（vue-element-admin）：
[vue-element-admin](http://panjiachen.github.io/vue-element-admin) 是一个后台集成解决方案，它基于 [vue]
