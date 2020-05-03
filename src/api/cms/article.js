import request from '@/utils/request'

export function listArticle(params) {
  return request({
    url: '/cms/article/page',
    method: 'post',
    data: params
  })
}

export function saveArticle(params) {
  return request({
    url: '/cms/article',
    method: 'post',
    data: params
  })
}

export function publishArticle(params) {
  return request({
    url: '/cms/article',
    method: 'put',
    data: params
  })
}

export function deleteArticle(id) {
  return request({
    url: `/cms/article/${id}`,
    method: 'delete'
  })
}
