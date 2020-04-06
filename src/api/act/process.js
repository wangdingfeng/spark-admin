import request from '@/utils/request'

export function processPage(params) {
  return request({
    url: '/flow/runtime/process-definitions',
    method: 'Get',
    params
  })
}

export function uploadFile(params) {
  return request({
    url: '/flow/runtime/process-definitions/file',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    processData: false, // 必写
    contentType: false// 必写
  }
  )
}

