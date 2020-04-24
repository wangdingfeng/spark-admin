import request from '@/utils/request'

export function histasksPage(params) {
  return request({
    url: '/flow/runtime/tasks/his',
    method: 'get',
    params
  })
}
