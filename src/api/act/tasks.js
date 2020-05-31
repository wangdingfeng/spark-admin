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

export function getTask(params) {
  return request({
    url: `/flow/runtime/tasks`,
    method: 'get',
    params: params
  })
}

export function countAct(params) {
  return request({
    url: '/flow/runtime/tasks/count',
    method: 'get',
    params: params
  })
}

export function executeTask(params) {
  return request({
    url: `/flow/runtime/tasks/${params.taskId}`,
    method: 'post',
    data: params
  })
}
