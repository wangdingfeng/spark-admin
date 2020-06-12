import request from '@/utils/request'

export function pageQuartz(params) {
  return request({
    url: '/quartz/job/page',
    method: 'post',
    params
  })
}

export function deleteQuartz(id) {
  return request({
    url: `/quartz/job/${id}`,
    method: 'delete'
  })
}

export function addQuartz(params) {
  return request({
    url: '/quartz/job/',
    method: 'post',
    data: params
  })
}

export function updateQuartz(params) {
  return request({
    url: '/quartz/job/',
    method: 'put',
    data: params
  })
}

export function changeStatus(id, status) {
  return request({
    url: `/quartz/job/status/${id}/${status}`,
    method: 'patch'
  })
}

export function runQuartz(id) {
  return request({
    url: `/quartz/job/run/${id}`,
    method: 'get'
  })
}

export function pageLog(params) {
  return request({
    url: '/quartz/job-log/page',
    method: 'post',
    params
  })
}
