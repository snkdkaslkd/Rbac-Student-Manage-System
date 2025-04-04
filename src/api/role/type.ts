export interface getRoleListResponseData {
  status: number
  data?: roleInfoData[]
  msg?: string
}
// 角色信息中data得数据类型
export interface roleInfoData {
  _id?: string
  name: string
  menus?: string[]
  create_time?: number
  __v?: number
  auth_time?: number
  auth_name?: string
}
