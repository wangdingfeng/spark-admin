import request from '@/utils/request'

export function listData(params) {
  return request({
    url: '/admin/user/page',
    method: 'post',
    params
  })
}

export function createUser(params) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: params
  })
}

export function deleteUser(id) {
  return request({
    url: `/admin/user/${id}`,
    method: 'delete'
  })
}

export function getRolIds(id) {
  return request({
    url: `/admin/user/roles/${id}`,
    method: 'get'
  })
}

export function restPassword(id) {
  return request({
    url: `/admin/user/rest/password/${id}`,
    method: 'get'
  })
}

export function updatetUserInfo(params) {
  return request({
    url: `/admin/user`,
    method: 'patch',
    data: params
  })
}
