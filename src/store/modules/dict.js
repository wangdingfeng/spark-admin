import { fetchDicts } from '@/api/sys/dict'

const permission = {
  state: {
    dicts: []
  },
  mutations: {
    SET_DICTS: (state, dicts) => {
      state.dicts = dicts
    }
  },
  actions: {
    // 获取数据字典
    GetDicts({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetchDicts().then(response => {
          const data = response.data
          commit('SET_DICTS', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
