// 服务器返回专业信息中data的数据类型
export interface majorInfoData {
  _id?: string
  majorname: string
  __v?: string
  value?: string
}
// 专业列表请求需要携带数据类型
export interface majorListFormData {
  page: number
  size: number
}
// 专业信息接口返回数据类型
export interface majorResponseData {
  status: number
  data?: majorInfoData
  msg?: string
}
// 所有专业数据类型
export interface majorAllResponseData {
  status: number
  data?: majorInfoData[]
  msg?: string
}
// 分页显示专业列表数据类型
export interface majorListResponseData {
  status: number
  data?: majorListData
  msg?: string
}
// 专业列表中data的数据类型
interface majorListData {
  data: majorInfoData[]
  total: number
}
