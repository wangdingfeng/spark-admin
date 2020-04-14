import {
  login,
  logout,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import routerFormat from '@/utils/router'
import {
  constantRouterMap,
  notFoundRouter
} from '@/router'
const user = {
  state: {
    token: getToken(),
    name: '',
    account: '',
    avatar: '',
    roles: [],
    roleNames: [],
    buttons: [],
    routers: constantRouterMap,
    addRouters: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE_NAMES: (state, roleNames) => {
      state.roleNames = roleNames
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers // 路由访问
      state.routers = constantRouterMap.concat(routers).concat(notFoundRouter) // 菜单显示,404最后加入
    },
    LOGOUT: (state) => {
      state.addRouters = []
      state.routers = []
      state.name = ''
      state.roles = []
      state.roleNames = []
      state.buttons = []
      state.token = ''
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          setToken(response.value)
          commit('SET_TOKEN', response.value)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_NAME', data.sysUser.nickname)
          commit('SET_ACCOUNT', data.sysUser.username)
          commit('SET_ROLES', data.roles)
          commit('SET_ROLE_NAMES', data.roleNames)
          commit('SET_AVATAR', data.sysUser.avatar)
          commit('SET_BUTTONS', data.permissions)
          commit('SET_ROUTERS', routerFormat(data.menus))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('LOGOUT', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('LOGOUT', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
