import request from '@/utils/request'

export function pageLog(params) {
  return request({
    url: '/admin/log/page',
    method: 'post',
    params
  })
}

