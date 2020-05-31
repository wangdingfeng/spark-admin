import request from '@/utils/request'

export function getData() {
  return request({
    url: '/admin/getData',
    method: 'get'
  })
}
