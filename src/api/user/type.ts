// 登录接口需要携带参数的数据类型
export interface loginFormData {
  username: string
  password: string
}
// 登录接口返回的数据类型中data选项的数据类型
// interface dataType{
//     token?:string|null
// }

// 登录接口返回数据类型
export interface loginResponseData {
  status: number
  data?: userInfoData
  msg?: string
}
// 服务端返回用户信息中data的数据类型
export interface userInfoData {
  _id: string
  username: string
  name: string
  password: string
  phone: string
  role_id: string
  create_time?: number
  token?: string
  __v?: number
  role?: userRoleData
}
// 角色对象数据类型
interface userRoleData {
  _id: string
  name?: string
  menus: string[]
  create_time: number
  __v?: number
  auth_time?: string
  auth_name?: string
}
// 服务器返回用户信息的数据类型
export interface userInfoResponseData {
  status: number
  data: userInfoData
}
// 校验原密码是否正确接口携带数据类型
export interface pwdData {
  userId: string
  password: string
}
// 校验密码接口返回类型
export interface checkPwdResponseData {
  status: number
  data?: userInfoData
  msg?: string
}
// 获取用户列表（分页）携带参数类型
export interface userListFormData {
  page: number
  size: number
}
// 获取所有用户接口返回数据类型
export interface userAllResponseData {
  status?: number
  data?: userInfoData[]
  msg?: string
}
// 获取用户列表接口返回数据类型（分页）
export interface userListResponseData {
  status?: number
  data?: userListData
  msg?: string
}
// 用户列表data数据类型
interface userListData {
  data: userInfoData[]
  roles: []
  total: number
}
