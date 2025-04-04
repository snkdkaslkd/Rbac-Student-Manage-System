<template>
  <div class="header">
    <a href="#">
      <img src="@/assets/vue.svg" class="logo" />
      <span class="title">学员管理系统</span>
    </a>
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ userStore.user?.username }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="date">{{ currentTime }}</span>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500px">
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="userForm.oldPass" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="userForm.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updatePwd(userFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { formateTime } from '@/utils/dateUtils'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { reqCheckPwd, reqUpdatePwd } from '@/api/user'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
let currentTime = ref<string>('')
let $router = useRouter()
let timer = null //循环定时器id
const getTime = () => {
  timer = setInterval(() => {
    currentTime.value = formateTime(Date.now())
  }, 1000)
}
onMounted(() => {
  getTime()
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
const handleCommand = (command: string | number | object) => {
  switch (command) {
    case 'a':
      // 修改密码
      handleUpdatePwd()
      break
    case 'b':
      // 退出登录
      handleLogout()
      break

    default:
      break
  }
}
// 退出登录
const handleLogout = () => {
  userStore.removeUser()
  if (!userStore.user) {
    $router.replace('/login')
  }
}
/* 自定义校验规则 */
const validateOldPass = (rule: any, value: any, callback: any) => {
  rule = rule
  reqCheckPwd({ userId: userStore.user?._id as string, password: value }).then(
    (response) => {
      if (response.status == 0) {
        callback()
      } else {
        callback(new Error(response.msg))
      }
    },
  )
}

const validatePass = (rule: any, value: any, callback: any) => {
  rule = rule
  if (value !== userForm.pass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 修改密码弹窗是否展示
const dialogFormVisible = ref(false)
// 修改密码弹出表单数据对象
const userForm = reactive({
  oldPass: '',
  pass: '',
  checkPass: '',
})
// 校验规则
const rules = reactive<FormRules>({
  oldPass: [{ required: true, validator: validateOldPass, trigger: 'blur' }],
  pass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  checkPass: [{ required: true, validator: validatePass, trigger: 'change' }],
})
// 修改密码弹窗表单ref对象
const userFormRef = ref<FormInstance>()
// 提交方法

const updatePwd = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      reqUpdatePwd({
        userId: userStore.user?._id as string,
        password: userForm.pass,
      }).then((response) => {
        if (response.status == 0) {
          handleLogout()
          dialogFormVisible.value = false
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// 修改密码
const handleUpdatePwd = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    userFormRef.value.resetFields()
  })
}
</script>

<style scoped>
.logo {
  width: 25px;
  height: 25px;
  padding: 12px 10px 0 40px;
}

.title {
  position: absolute;
  color: #fff;
}

.el-dropdown {
  float: right;
  margin-right: 40px;
  height: 50px;
  line-height: 50px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.date {
  float: right;
  color: #fff;
  margin-right: 50px;
}
</style>
