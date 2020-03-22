import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/admin/api/login',
    method: 'get',
    params: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/api/principal',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/home/logout',
    method: 'delete'
  })
}
