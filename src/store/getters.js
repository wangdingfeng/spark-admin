const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  token: state => state.user.token,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  roles: state => state.user.roles,
  roleNames: state => state.user.roleNames,
  buttons: state => state.user.buttons,
  account: state => state.user.account,
  name: state => state.user.name,
  routers: state => state.user.routers,
  dicts: state => state.dict.dicts,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
