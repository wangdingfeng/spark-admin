import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/auth/oauth/token',
    method: 'get',
    params: {
      grant_type: 'password',
      client_id: 'spark-admin',
      client_secret: 'spark-admin-secret',
      scope: 'all',
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/user/principal',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/home/logout',
    method: 'delete'
  })
}
