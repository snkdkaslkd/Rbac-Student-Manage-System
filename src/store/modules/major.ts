import { defineStore } from 'pinia'
import {
  reqMajorAll,
  reqMajorById,
  reqMajorDelete,
  reqMajorList,
  reqMajorUpdate,
  reqMajorAdd,
} from '@/api/major'
import type {
  majorInfoData,
  majorAllResponseData,
  majorListFormData,
  majorListResponseData,
  majorResponseData,
} from '@/api/major/type'
import { MajorState } from './types/type'
// 专业小仓库
let useMajorStore = defineStore('Major', {
  state: (): MajorState => {
    return {
      majors: [],
    }
  },
  actions: {
    async getMajorAll() {
      let result: majorAllResponseData = await reqMajorAll()
      if (result.status == 0) {
        this.majors = result.data
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getMajorList(data: majorListFormData) {
      let result: majorListResponseData = await reqMajorList(data)
      if (result.status == 0) {
        this.majors = result.data?.data
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async addMajor(data: majorInfoData) {
      let result: majorResponseData = await reqMajorAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getMajorById(_id: string) {
      let result: majorResponseData = await reqMajorById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async updateMajor(data: majorInfoData) {
      let result: majorResponseData = await reqMajorUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async deleteMajor(majorId: string) {
      let result: majorResponseData = await reqMajorDelete(majorId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
export default useMajorStore
