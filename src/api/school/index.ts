import request from '@/utils/request'
import type {
  schoolAllResponseData,
  schoolInfoData,
  schoolListFormData,
  schoolListResponseData,
  schoolResponseData,
} from './type'
enum API {
  SCHOOL_ALL_URL = '/manage/school/all',
  SCHOOL_LIST_URL = '/manage/school/list',
  SCHOOL_ADD_URL = '/manage/school/add',
  SCHOOL_GET_ID_URL = '/manage/school/find',
  SCHOOL_UPDATE_URL = '/manage/school/update',
  SCHOOL_DELETE_URL = '/manage/school/delete',
}

// 获取所有学校
export const reqSchoolAll = () =>
  request.get<any, schoolAllResponseData>(API.SCHOOL_ALL_URL)
// 获取分页学校列表
export const reqSchoolList = (data: schoolListFormData) =>
  request.post<any, schoolListResponseData>(API.SCHOOL_LIST_URL, data)
// 添加学校
export const reqSchoolAdd = (data: schoolInfoData) =>
  request.post<any, schoolResponseData>(API.SCHOOL_ADD_URL, data)
// 根据id查询学校
export const reqSchoolById = (_id: string) =>
  request.get<any, schoolResponseData>(API.SCHOOL_GET_ID_URL + `?_id=${_id}`)
// 更新学校信息
export const reqSchoolUpdate = (data: schoolInfoData) =>
  request.post<any, schoolResponseData>(API.SCHOOL_UPDATE_URL, data)
// 删除学校
export const reqSchoolDelete = (schoolId: string) =>
  request.post<any, schoolResponseData>(API.SCHOOL_DELETE_URL, { schoolId })
