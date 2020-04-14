import request from '@/utils/request'

export function taskPage(params) {
  return request({
    url: '/flow/runtime/tasks',
    method: 'post',
    data: params
  })
}

export function recordList(processInstanceId) {
  return request({
    url: `/flow/runtime/tasks/records/${processInstanceId}`,
    method: 'get'
  })
}
