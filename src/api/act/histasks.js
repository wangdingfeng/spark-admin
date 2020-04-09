import request from '@/utils/request'

export function histasksPage(params) {
  return request({
    url: `/flow/runtime/tasks/his/${params.userId}`,
    method: 'get',
    params
  })
}
