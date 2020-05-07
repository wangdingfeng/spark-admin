import request from '@/utils/request'

export function listArticle(params) {
  return request({
    url: '/cms/article/page',
    method: 'post',
    data: params
  })
}

export function getArticle(id) {
  return request({
    url: `/cms/article/${id}`,
    method: 'get'
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

export function auditArticle(params) {
  return request({
    url: '/cms/article/audit',
    method: 'post',
    data: params
  })
}

export function backEditArticle(params) {
  return request({
    url: '/cms/article/back',
    method: 'post',
    data: params
  })
}
