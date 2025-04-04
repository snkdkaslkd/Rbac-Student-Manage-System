import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'

// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let request = axios.create({
  // baseURL: "/mock",
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
// 加载效果对象
const loading = {
  loadingInstance: null, //加载效果的实例对象
  open() {
    if (this.loadingInstance == null) {
      this.loadingInstance = ElLoading.service({
        text: '拼命加载中...',
        background: 'rgba(0,0,0,0.5)',
        target: '.main',
      })
    }
  },
  close() {
    if (this.loadingInstance != null) {
      this.loadingInstance.close()
      this.loadingInstance = null
    }
  },
}
// 获取最新权限列表
const getMenus = () => {
  let userStore = useUserStore()
  // 当前登录的用户的角色id
  const roleId = userStore.user?.role_id
  // 当前登录的用户权限列表
  const userMenus = userStore.user?.role?.menus
  if (userStore.user.username == 'admin') {
    return
  }
  // 发送请求获取当前用户的最新权限列表
  request({
    url: '/menus',
    method: 'post',
    data: {
      roleId,
    },
  }).then((response) => {
    // 最新的权限列表
    const menus = response.data.menus
    if (userMenus?.length == menus.length) {
      userMenus?.forEach((item) => {
        if (menus.indexOf(item) == -1) {
          userStore.removeUser()
          ElMessage({
            message: '当前登录的用户权限被修改，请重新登录',
          })
          window.location.href = '/login'
        }
      })
    } else {
      userStore.removeUser()
      ElMessage({
        message: '当前登录的用户权限被修改，请重新登录',
      })
      window.location.href = '/login'
    }
  })
}
// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (config.url != '/menus' && config.url != '/login') {
      loading.open()
      getMenus()
    }
    return config
  },
  function (error) {
    // Do something with request error
    loading.close()
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    loading.close()
    if (response.data.status != 0) {
      ElMessage({
        message: response.data.msg,
        type: 'warning',
      })
    }
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    loading.close()
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无法访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器错误'
        break

      default:
        msg = '断网了'
        break
    }
    ElMessage({
      message: msg,
      type: 'error',
    })
    return Promise.reject(error)
  },
)
export default request
