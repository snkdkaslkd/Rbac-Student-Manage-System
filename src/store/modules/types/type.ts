import { userInfoData } from '@/api/user/type'
import type { schoolInfoData } from '@/api/school/type'
import type { majorInfoData } from '@/api/major/type'
import type { classInfoData } from '@/api/class/type'
import type { studentInfoData } from '@/api/student/type'
// state函数返回值类型
export interface UserState {
  // token:string|null
  user: userInfoData | null
  users: userInfoData[]
}
// 学校小仓库中state数据类型
export interface SchoolState {
  schools: schoolInfoData[]
}
// 专业小仓库中state数据类型
export interface MajorState {
  majors: majorInfoData[]
}
// 班级小仓库state数据类型
export interface ClassState {
  classes: classInfoData[]
}
// 学生小仓库state数据类型
export interface StudentState {
  students: studentInfoData[]
}
