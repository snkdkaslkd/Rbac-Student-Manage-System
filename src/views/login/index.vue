<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="100px"
      class="login-form"
    >
      <h2>登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          placehold="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placehold="请输入密码"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(loginFormRef)">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
let useStore = useUserStore()
const loginForm = reactive({
  username: '',
  password: '',
})
let router = useRouter()
// 表单元素对象
const loginFormRef = ref<FormInstance>()
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
    {
      min: 3,
      max: 5,
      message: '长度在3到5位之间',
      trigger: ['blur', 'change'],
    },
  ],
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        await useStore.userLogin(loginForm)
        ElMessage({
          message: '登录成功！',
          type: 'success',
        })
        router.replace('/')
      } catch (error) {
        console.log('登录失败', error)
      }
    } else {
      return false
    }
  })
}
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}

.login-container {
  background: url('../../assets/bg.png');
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}

h2 {
  text-align: center;
}
</style>
