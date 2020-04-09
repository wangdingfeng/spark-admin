import request from '@/utils/request'

export function taskPage(params) {
  return request({
    url: '/flow/runtime/tasks',
    method: 'post',
    data: params
  })
}
