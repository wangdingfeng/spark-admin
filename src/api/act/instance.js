import request from '@/utils/request'

export function instancePage(params) {
  return request({
    url: '/flow/runtime/process-instances',
    method: 'get',
    params
  })
}

export function instanceAction(processInstanceId, action) {
  return request({
    url: `/flow/runtime/process-instances/${processInstanceId}/${action}`,
    method: 'put'
  })
}

export function deleteInstance(processInstanceId) {
  return request({
    url: `/flow/runtime/process-instances/${processInstanceId}`,
    method: 'delete'
  })
}
