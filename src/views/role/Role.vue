<template>
  <div>
    <div style="margin: 20px">
      <el-button type="primary" @click="handleAdd">创建角色</el-button>
      <el-button
        type="primary"
        :disabled="currentRow == null ? true : false"
        @click="roleAuthVisible = true"
      >
        设置角色权限
      </el-button>
    </div>
    <el-table
      :data="roleList"
      height="380"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
      border
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column property="name" label="角色名称" />
      <el-table-column
        property="create_time"
        label="创建时间"
        :formatter="resetData"
      />
      <el-table-column
        property="auth_time"
        label="授权时间"
        :formatter="resetData"
      />
      <el-table-column property="auth_name" label="授权人" />
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog v-model="roleFormVisible" title="添加角色" width="500px">
      <el-form
        :model="role"
        ref="roleFormRef"
        label-width="100px"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addData(roleFormRef)">
            确定
          </el-button>
          <el-button @click="roleFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置角色权限弹窗 -->
    <!-- 添加角色对话框 -->
    <el-dialog v-model="roleAuthVisible" title="设置角色权限" width="500px">
      <Auth :role="currentRow" ref="authRef" v-if="roleAuthVisible" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateData">确定</el-button>
          <el-button @click="roleAuthVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
// 引入子组件
import Auth from './components/Auth.vue'
import { onMounted, ref, reactive, nextTick } from 'vue'
// 引入格式化日期数据方法
import { formateDate } from '@/utils/dateUtils'
import type { FormInstance, FormRules } from 'element-plus'
// 角色数据类型
import type { roleInfoData } from '@/api/role/type'
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
const roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
let roleList = ref(null)
// 添加角色对话框中表单ref对象
const roleFormRef = ref<FormInstance>()

// 权限组件ref对象
const authRef = ref()
const getRoleList = () => {
  roleStore.roleList().then(() => {
    roleList.value = roleStore.roles
  })
}
// 添加角色按钮
const handleAdd = () => {
  roleFormVisible.value = true
  nextTick(() => {
    roleFormRef.value.resetFields()
  })
}
const currentRow = ref<roleInfoData>()
const handleCurrentChange = (val: any) => {
  currentRow.value = val
}
onMounted(() => {
  getRoleList()
})
const resetData = (_row, _column, cellValue, _index) => {
  return formateDate(cellValue)
}
// 添加角色对话框是否显示
const roleFormVisible = ref(false)
// 设置角色权限对话框是否显示
const roleAuthVisible = ref(false)

// 收集角色对象
const role = reactive({
  name: '',
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})
// 添加角色确定按钮回调事件
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      roleStore.useAddRole(role).then(() => {
        // 关闭弹窗
        roleFormVisible.value = false
        // 重新获取角色列表，刷新数据
        getRoleList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 设置角色权限
const updateData = () => {
  const newRole = authRef.value.getMens()
  currentRow.value.menus = newRole.menus
  currentRow.value.name = newRole.name
  currentRow.value.auth_name = userStore.user.username
  //   console.log("currentRow",currentRow.value);

  roleStore.useUpdateRole(currentRow.value).then(() => {
    roleAuthVisible.value = false
    getRoleList()
  })
}
</script>

<style scoped></style>
