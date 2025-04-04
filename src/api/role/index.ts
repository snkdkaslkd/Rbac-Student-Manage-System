import request from '@/utils/request'
import type { getRoleListResponseData, roleInfoData } from './type'
// 角色列表
export const getRoleList = () =>
  request.get<any, getRoleListResponseData>('/manage/role/list')
// 添加角色
export const addRole = (data: roleInfoData) =>
  request.post<any, getRoleListResponseData>('/manage/role/add', data)
// 更新角色
export const updateRole = (data: roleInfoData) =>
  request.post<any, getRoleListResponseData>('/manage/role/update', data)
