import request from '@/utils/request'

export function listData(params) {
  return request({
    url: '/admin/menu/list',
    method: 'get',
    params
  })
}
