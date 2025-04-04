<template>
  <div>
    <el-form
      :model="updateRole"
      ref="roleFormRef"
      label-width="100px"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="updateRole.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-tree
        :data="authList"
        show-checkbox
        node-key="index"
        :default-expand-all="true"
        :default-checked-keys="checkedKeys"
        @check-change="handleCheckChange"
      />
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { roleInfoData } from '@/api/role/type'
import type { FormRules } from 'element-plus'
import { reactive, onMounted, ref } from 'vue'
import menuList from '@/config/menuConfig'
interface Tree {
  name: string
  index: string
}
let updateRole: roleInfoData = reactive({
  name: '',
  menus: [],
})
// 接收父组件传递过来的数据
const props = defineProps(['role'])
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})
// 树形控件所需数据列表
const authList = ref([])
// 树形控件选中项数组
let checkedKeys = reactive([])
onMounted(() => {
  updateRole = reactive({ ...props.role })
  authList.value = getAuthNodes(menuList)
  checkedKeys = props.role.menus
})

// 根据menuList生成树形控件需要展示的数据格式数组
const getAuthNodes = (menuList: any) => {
  return menuList.map((item: any) => {
    if (!item.children) {
      return {
        index: item.index,
        label: item.title,
      }
    } else {
      return {
        index: item.index,
        label: item.title,
        children: getAuthNodes(item.children),
      }
    }
  })
}
// 树形控件复选框点击事件回调
const handleCheckChange = (
  data: Tree,
  checked: boolean,
  _indeterminate: boolean,
) => {
  if (checked) {
    if (data.index != '/students' && checkedKeys.indexOf(data.index) == -1) {
      checkedKeys.push(data.index)
    }
  } else {
    if (checkedKeys.indexOf(data.index) != -1) {
      checkedKeys.splice(checkedKeys.indexOf(data.index), 1)
    }
  }
}
// 为父组件提供数据,但是当前父组件是无法直接使用此方法的
const getMens = () => {
  updateRole.menus = checkedKeys
  return updateRole
}
// 组件中的数据默认是对外关闭的，可以将需要提供给外部的数据通过defineExpose提供出去
defineExpose({
  getMens,
})
</script>

<style scoped></style>
