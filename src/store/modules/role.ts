import { defineStore } from 'pinia'
import { getRoleList, addRole, updateRole } from '@/api/role'
import { RoleState } from './types/roleType'
import type { roleInfoData, getRoleListResponseData } from '@/api/role/type'
// 创建角色小仓库
let useRoleStore = defineStore('Role', {
  state: (): RoleState => {
    return {
      roles: [],
    }
  },
  actions: {
    async roleList() {
      let result: getRoleListResponseData = await getRoleList()
      if (result.status == 0) {
        this.roles = result.data
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async useAddRole(data: roleInfoData) {
      let result: getRoleListResponseData = await addRole(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async useUpdateRole(data: roleInfoData) {
      let result: getRoleListResponseData = await updateRole(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
export default useRoleStore
