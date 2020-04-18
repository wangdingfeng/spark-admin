import request from '@/utils/request'

export function filePage(params) {
  return request({
    url: '/admin/file/page',
    method: 'Get',
    params
  })
}

export function deleteFile(id) {
  return request({
    url: `/admin/file/${id}`,
    method: 'delete'
  })
}
