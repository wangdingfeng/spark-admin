# Spark 火花平台

> 根据[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template/blob/master/README-zh.md)改变而来。

#其他的功能在不断的完善中......火花平台完全开源，我不是巨人，我只是站在了巨人的肩膀上

## 开发

```bash
# 克隆项目
git clone https://gitee.com/dataact/jeeweb-vue-admin.git

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