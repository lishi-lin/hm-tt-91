// 文章获取数据
import request from '@/utils/request'
// 封装渲染列表的方法
export function getArticles (params) {
  return request({
    /**
 * 获取推荐文章的数据
 * axios中 query参数放置在 params上
 * body参数放置在data上
 * **/
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
// 获取文章搜索的建议
export function suggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}
// 获取文章搜索结果
export function serachArticle (params) {
  return request({
    url: 'search',
    params
  })
}
// 获取文章详情
export function getArticleinfo (id) {
  return request({
    url: `/articles/${id}`
  })
}
