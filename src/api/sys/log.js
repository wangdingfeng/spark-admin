import request from '@/utils/request'

export function pageLog(params) {
  return request({
    url: '/admin/log/page',
    method: 'post',
    params
  })
}

export function pageLoginLog(params) {
  return request({
    url: '/admin/login-log/page',
    method: 'post',
    params
  })
}
