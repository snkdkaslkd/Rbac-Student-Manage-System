import { defineStore } from 'pinia'
import type {
  loginFormData,
  loginResponseData,
  userAllResponseData,
  userInfoData,
  userListFormData,
  userListResponseData,
} from '@/api/user/type'
import {
  reqLogin,
  reqUserAdd,
  reqUserAll,
  reqUserList,
  reqUserById,
  reqUserUpdate,
  reqUserDelete,
} from '@/api/user'
import { UserState } from './types/type'
let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      // token:localStorage.getItem("VUE3-TOKEN")
      user: JSON.parse(localStorage.getItem('VUE3-USER') as string),
      users: [],
    }
  },
  actions: {
    async userLogin(data: loginFormData) {
      // 调用api方法发送登录请求
      let result: loginResponseData = await reqLogin(data)
      // 如果登录成功
      if (result.status == 0) {
        /* // 将后端相应的数据中的token存储到仓库中
                this.token = (result.data.token as string)
                // 进行本地存储
                localStorage.setItem("VUE3-TOKEN",(result.data.token as string)) */

        this.user = result.data as userInfoData
        localStorage.setItem('VUE3-USER', JSON.stringify(result.data) as string)
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('VUE3-USER')
    },
    // 获取所有用户
    async getUserAll() {
      let result: userAllResponseData = await reqUserAll()
      if (result.status == 0) {
        this.users = result.data as userInfoData[]
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 分页获取用户列表
    async getUserList(data: userListFormData) {
      let result: userListResponseData = await reqUserList(data)
      if (result.status == 0) {
        this.users = result.data?.data as userInfoData[]
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 添加用户
    async addUser(data: userInfoData) {
      let result: loginResponseData = await reqUserAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 根据id查询用户
    async getUserById(_id: string) {
      let result: loginResponseData = await reqUserById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 更新用户信息
    async updateUser(data: userInfoData) {
      let result: loginResponseData = await reqUserUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 删除用户
    async deleteUser(userId: string) {
      let result: loginResponseData = await reqUserDelete(userId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
// 对外暴露
export default useUserStore
