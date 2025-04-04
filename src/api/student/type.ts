// 服务端返回学生信息对象中data得数据类型
export interface studentInfoData {
  _id?: string | null
  name: string //姓名
  gender: string //性别
  school: string //学校
  major: string //专业
  grade?: string //年级
  education?: string //学历
  direction: string //学习方向
  id_number?: string //身份号码
  phone: string //电话号码
  parent?: string //家长姓名
  parent_phone?: string //家长联系电话
  address?: string //家庭住址
  qq?: string //QQ号码
  class: string //所在班级
  admission_date?: string //入学时间
  teacher_id: string //教师id
  manager_id: string //学管id
  pictures?: string[] //照片数组
  note?: string //备注信息
  __v?: number
}
// 获取学生列表接口需要携带数据类型
export interface studentListFormData {
  page: number
  size: number
  searchMap: searchMapData
}
// searchMap数据类型
interface searchMapData {
  name: string
  direction: string
  teacher_id: string
  manager_id: string
  class: string
}
// 学生信息返回数据类型
export interface studentResponseData {
  status: number
  data?: studentInfoData
  msg?: string
}
// 全部学生信息返回数据类型
export interface studentAllResponseData {
  status: number
  data?: studentInfoData[]
  msg?: string
}
// 学生信息列表返回数据类型
export interface studentListResponseData {
  status: number
  data?: studentListData
  msg?: string
}
// 学生列表中data数据类型
interface studentListData {
  data: studentInfoData[]
  total: number
}
// 每月学生数量data数据类型
interface monthData {
  _id: string
  count: string
}
// 某一年每个月学生数量返回数据类型
export interface studentYearResponseData {
  status: string
  data: monthData[]
}
