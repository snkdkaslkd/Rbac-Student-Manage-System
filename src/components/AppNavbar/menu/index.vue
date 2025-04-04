<template>
  <div>
    <template v-for="item in menuList" :key="item.index">
      <!-- 如果当前item没有chiildren熟悉代表是一级菜单 -->
      <el-menu-item v-if="!item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <!-- 如果只有2级菜单，那么使用下面代码可以，但是如果有多级菜单则不适用 -->
        <!-- <el-menu-item index="4-1">学校管理</el-menu-item> -->
        <Menu :menuList="item.children" />
      </el-sub-menu>
    </template>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Menu',
  props: ['menuList'],
}
</script>

<style scoped></style>
