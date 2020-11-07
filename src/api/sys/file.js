import request from '@/utils/request'

export function filePage(params) {
  return request({
    url: '/file/file-info/page',
    method: 'Get',
    params
  })
}

export function deleteFile(id) {
  return request({
    url: `/file/file-info/${id}`,
    method: 'delete'
  })
}
