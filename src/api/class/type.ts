// 服务器返回班级信息中data的数据类型
export interface classInfoData {
  _id?: string
  classname: string
  teacher_id: string
  manager_id: string
  __v?: string
}
// 班级列表请求需要携带数据类型
export interface classListFormData {
  page: number
  size: number
  searchMap: searchMapData
}
// 条件筛选数据类型
interface searchMapData {
  teacher_id?: string
  manager_id: string
}
// 班级信息接口返回数据类型
export interface classResponseData {
  status: number
  data?: classInfoData
  msg?: string
}
// 所有班级数据类型
export interface classAllResponseData {
  status: number
  data?: classInfoData[]
  msg?: string
}
// 分页显示班级列表数据类型
export interface classListResponseData {
  status: number
  data?: classListData
  msg?: string
}
// 班级列表中data的数据类型
interface classListData {
  data: classInfoData[]
  total: number
}
