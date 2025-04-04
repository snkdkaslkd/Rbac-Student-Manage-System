<template>
  <div>
    <div style="margin: 20px">
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
    </div>
    <el-table :data="users" style="width: 100%; height: 380px" border>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_time"
        :formatter="resetDate"
      ></el-table-column>
      <el-table-column
        label="所属角色"
        prop="role_id"
        :formatter="resetRole"
      ></el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row._id)">
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row._id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加用户弹窗 -->
    <el-dialog v-model="userFormVisible" title="添加/编辑用户" width="500px">
      <el-form
        :model="user"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="width: 400px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="user.role_id" placeholder="请选择所属角色">
            <el-option
              v-for="option in roleOptions"
              :label="option.name"
              :value="option._id"
              :key="option._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="user.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              user._id == null ? addData(userFormRef) : updateData(userFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="userFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { formateDate } from '@/utils/dateUtils'
import type { roleInfoData } from '@/api/role/type'
import type { userInfoData ,userAllResponseData} from '@/api/user/type'
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
const roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
import { FormInstance, FormRules } from 'element-plus'
const userStore = useUserStore()
const users = ref<userInfoData[] | undefined>([])
// 当前页码
const currentPage = ref(1)
// 每页显示多少条数据
const pageSize = ref(5)
// 数据总条数
const total = ref(0)
// 收集用户信息对象
const user = ref<userInfoData | undefined>({
  _id: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  role_id: '',
})
// 添加/编辑用户弹窗是否展示
const userFormVisible = ref(false)
// 通过自定义校验规则，定义用户名的规则
const validateUserName = (rule: any, value: string, callback: any) => {
  rule = rule
  value = value.trim()
  const length = value && value.length
  // 定义正则 规定用户名只能由大小写英文字母数字或下划线组成
  const reg = /^[a-zA-Z0-9_]+$/
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (length < 4 || length > 12) {
    callback(new Error('长度在 4 到 12 个字符'))
  } else if (!reg.test(value)) {
    callback(new Error('用户名只能由英文字母数字或下划线组成'))
  } else {
    callback()
  }
}
// 通过自定义校验规则，定义电话号码的规则
const validatePhone = (_rule: any, value: string, callback: any) => {
  value = value.trim()
  const phoneReg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}
// 校验规则
const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      validator: validateUserName,
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '请输入3位以上密码', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  phone: [
    { required: true, validator: validatePhone, trigger: ['blur', 'change'] },
  ],
})
// 表单ref对象
const userFormRef = ref<FormInstance>()
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userStore.addUser(user.value).then(() => {
        userFormVisible.value = false
        getUserList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 更新用户信息
const updateData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      userStore.updateUser(user.value).then(() => {
        userFormVisible.value = false
        getUserList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleEdit = (_id) => {
  handleAdd()
  userStore.getUserById(_id).then((response) => {
    user.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除词条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.deleteUser(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getUserList()
      })
    })
    .catch(() => {
      return false
    })
}
const resetDate = (_row: any, _colum: any, cellValue: number) => {
  return formateDate(cellValue)
}
const resetRole = (_row: any, _colum: any, cellValue: string) => {
  const role = roleOptions.value.find((item) => item._id == cellValue) || {}
  // @ts-ignore , ts 不校验下一行代码
  return role.name
}
// 角色列表
const roleOptions = ref<roleInfoData[] | undefined>([])
// 获取角色列表
const getRoleList = () => {
  if (roleStore.roles?.length) {
    roleOptions.value = roleStore.roles
  } else {
    roleStore.roleList().then(() => {
      roleOptions.value = roleStore.roles
    })
  }
}
// 获取用户列表
const getUserList = () => {
  userStore
    .getUserList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      users.value = userStore.users
      total.value = response.total as number
    })
}
onMounted(() => {
  getRoleList()
  getUserList()
})
// 每页显示数据数量方法变化回调
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getUserList()
}
// 当前显示页码发生变化回调
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
}
const handleAdd = () => {
  userFormVisible.value = true
  user.value = {
    _id: null,
    username: '',
    password: '',
    name: '',
    phone: '',
    role_id: '',
  }
  nextTick(() => {
    userFormRef.value.resetFields()
  })
}
</script>

<style scoped></style>
