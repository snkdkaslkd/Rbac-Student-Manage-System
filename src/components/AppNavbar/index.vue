<template>
  <div class="navbar">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      text-color="#fff"
      :router="true"
      :default-active="$route.path"
      :default-openeds="['/students']"
    >
      <Menu :menuList="menuNodes" />
    </el-menu>
  </div>
</template>
<script setup lang="ts">
// 引入所有菜单项数组
import menuList from '@/config/menuConfig'
// 引入menu子组件
import Menu from './menu/index.vue'
// 引入数据类型
import type { MenuData, MenuChildrenData } from './types/type'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 引入路由
import { useRoute } from 'vue-router'
let $route = useRoute()
// 判断是否拥有当前权限
const hashAuth = (item: MenuData) => {
  // 从全部列表项数组(menuList)中的某一个菜单项里面提取index和isPublic，用于判断当前用户是否拥有此权限
  const { index, isPublic } = item
  // 获取当前登录用户的用户名，因为要判断是否为超级管理员
  const username = userStore.user?.username
  // 获取当前登录用户的权限列表
  const menus = userStore.user?.role.menus
  /* 
    进行判断
    1.如果是超级管理员，那么代表所有的菜单项都要显示 （username == admin）
    2.当前item是否为公共的 isPublic
    3.当前传入的item（菜单项）是否在用户权限列表中存在
    */
  if (username == 'admin' || isPublic || menus?.indexOf(index) != -1) {
    return true
  } else if (item.children) {
    return !!item.children.find(
      (child: MenuChildrenData) => menus.indexOf(child.index) != -1,
    )
  } else {
    return false
  }
}
// 定义变量存储需要显示的权限列表
let menuNodes: any[] = []
// 定义方法计算需要展示的菜单项,存储到menuNodes里面
const getMenuNodes = () => {
  // 循环遍历所有的菜单项数组，取出每一个菜单项，通过上面的hashAuth方法进行判断，如果返回值为true则添加到menuNodes数组中，遍历结束后menuNodes数组中就是需要展示的菜单项数组了
  menuList.forEach((item) => {
    // 先判断一级菜单
    if (!item.children) {
      if (hashAuth(item)) {
        menuNodes.push(item)
      }
    } else {
      // 多级菜单,定义一个二级菜单项数组
      let tempArr = []
      // 循环遍历二级菜单数组
      item.children.forEach((i) => {
        if (hashAuth(i)) {
          tempArr.push(i)
        }
      })

      // 循环遍历结束之后tempArr中存储的就是所有需要展示的二级菜单项，需要赋值给当前拥有二级菜单项的菜单中的children属性中
      let obj = { ...item, children: tempArr }
      menuNodes.push(obj)
    }
  })
}
getMenuNodes()
</script>

<style scoped>
.el-menu {
  border: 0;
}
</style>
