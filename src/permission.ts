import router from './router'
import pinia from './store'
// 引入用户小仓库
import useUserStore from './store/modules/user'
let userStore = useUserStore(pinia)

router.beforeEach((to, _from, next) => {
  const user = userStore.user
  if (user && user._id) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})
