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
    url: '/admin/user/save',
    method: 'post',
    params
  })
}
