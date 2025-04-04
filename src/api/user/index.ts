// 引入自己封装的axios对象
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
  pwdData,
  checkPwdResponseData,
  userAllResponseData,
  userListResponseData,
  userListFormData,
  userInfoData,
} from './type'
// 与用户相关的请求地址
enum API {
  LOGIN_URL = '/login',
  USERINFO_URL = '/user/info',
  LOGOUT_URL = '/logout',
  CHECK_PWD_URL = '/manage/user/pwd',
  UPDATE_PWD_URL = '/manage/user/pwd',
  USER_ALL_URL = '/manage/user/all',
  USER_LIST_URL = '/manage/user/list',
  USER_ADD_URL = '/manage/user/add',
  USER_GET_ID_URL = '/manage/user/find',
  USER_UPDATE_URL = '/manage/user/update',
  USER_DELETE_URL = '/manage/user/delete',
}
// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
// 获取用户信息
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)
// 退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
// 校验原密码是否正确
export const reqCheckPwd = (data: pwdData) =>
  request.post<any, checkPwdResponseData>(API.CHECK_PWD_URL, data)
// 修改密码
export const reqUpdatePwd = (data: pwdData) =>
  request.put<any, checkPwdResponseData>(API.UPDATE_PWD_URL, data)
// 获取所有用户
export const reqUserAll = () =>
  request.get<any, userAllResponseData>(API.USER_ALL_URL)
// 获取分页用户列表
export const reqUserList = (data: userListFormData) =>
  request.post<any, userListResponseData>(API.USER_LIST_URL, data)
// 添加用户
export const reqUserAdd = (data: userInfoData) =>
  request.post<any, loginResponseData>(API.USER_ADD_URL, data)
// 根据id查询用户
export const reqUserById = (_id: string) =>
  request.get<any, loginResponseData>(API.USER_GET_ID_URL + `?_id=${_id}`)
// 更新用户信息
export const reqUserUpdate = (data: userInfoData) =>
  request.post<any, loginResponseData>(API.USER_UPDATE_URL, data)
// 删除用户
export const reqUserDelete = (userId: string) =>
  request.post<any, loginResponseData>(API.USER_DELETE_URL, { userId })
