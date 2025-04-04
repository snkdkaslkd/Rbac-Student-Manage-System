// 服务端返回学校信息中data选项的数据类型
export interface schoolInfoData {
  _id?: string
  schoolname: string
  __v?: number
  value?: string
}
// 获取学校列表接口需要携带参数类型
export interface schoolListFormData {
  page: number
  size: number
}
// 学校信息接口返回数据类型
export interface schoolResponseData {
  status: number
  data?: schoolInfoData
  msg?: string
}
// 获取所有学校接口返回数据类型
export interface schoolAllResponseData {
  status: number
  data?: schoolInfoData[]
  msg?: string
}
// 获取学校列表返回数据类型（分页）
export interface schoolListResponseData {
  status: number
  data?: schoolListData
  msg?: string
}
// 学校列表data数据类型
interface schoolListData {
  data: schoolInfoData[]
  total: number
}
