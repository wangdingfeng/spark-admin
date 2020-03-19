const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  token: state => state.user.token,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  name: state => state.user.name,
  routers: state => state.user.routers,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
