<template>
  <div>
    <!-- 条件筛选 -->
    <el-form
      :inline="true"
      :model="searchMap"
      style="margin: 20px 0"
      ref="searchFormRef"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="根据姓名查询" />
      </el-form-item>
      <el-form-item prop="direction" style="width: 200px">
        <el-select v-model="searchMap.direction" placeholder="根据学习方向查询">
          <el-option
            v-for="option in directionOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="class" style="width: 200px">
        <el-select v-model="searchMap.class" placeholder="根据班级查询">
          <el-option
            v-for="option in classOptions"
            :label="option.classname"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="teacher_id" style="width: 200px">
        <el-select
          v-model="searchMap.teacher_id"
          placeholder="根据授课教师查询"
        >
          <el-option
            v-for="option in teacherOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="manager_id" style="width: 200px">
        <el-select v-model="searchMap.manager_id" placeholder="根据学管查询">
          <el-option
            v-for="option in managerOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">确定</el-button>
        <el-button @click="resetForm(searchFormRef)">重置</el-button>
        <el-button type="primary" @click="handleAdd">添加学生</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="students" border style="width: 100%; height: 380px">
      <el-table-column type="expand">
        <template #default="props">
          <div style="padding: 20px">
            <p>学生姓名: {{ props.row.name }}</p>
            <p>性别: {{ dataFilter(props.row.gender, genderOptions) }}</p>
            <p>所在学校: {{ props.row.school }}</p>
            <p>专业: {{ props.row.major }}</p>
            <p>年级: {{ dataFilter(props.row.grade, gradeOptions) }}</p>
            <p>学历: {{ dataFilter(props.row.education, educationOptions) }}</p>
            <p>
              学习方向: {{ dataFilter(props.row.direction, directionOptions) }}
            </p>
            <p>身份号码: {{ props.row.id_number }}</p>
            <p>电话号码: {{ props.row.phone }}</p>
            <p>家长姓名: {{ props.row.parent }}</p>
            <p>家长联系电话: {{ props.row.parent_phone }}</p>
            <p>家庭住址: {{ props.row.address }}</p>
            <p>QQ号码: {{ props.row.qq }}</p>
            <p>所在班级: {{ classFilter(props.row.class, classOptions) }}</p>
            <p>入学时间: {{ props.row.admission_date }}</p>
            <p>
              授课教师: {{ dataFilter(props.row.teacher_id, teacherOptions) }}
            </p>
            <p>学管: {{ dataFilter(props.row.manager_id, managerOptions) }}</p>
            <p>
              照片:
              <el-image
                v-for="(item, index) in props.row.pictures"
                :key="index"
                style="width: 200px; height: 200px"
                :src="baseApi + '/upload/' + item"
                :preview-src-list="getSrcList(props.row.pictures)"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="0"
                fit="cover"
              />
            </p>
            <p>
              备注:
              <span v-html="props.row.note"></span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="60" type="index" />
      <el-table-column label="学生姓名" prop="name" />
      <el-table-column label="性别" prop="gender">
        <template #default="scope">
          {{ dataFilter(scope.row.gender, genderOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="学习方向" prop="direction">
        <template #default="scope">
          {{ dataFilter(scope.row.direction, directionOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" prop="phone" />
      <el-table-column label="所在班级" prop="class">
        <template #default="scope">
          {{ classFilter(scope.row.class, classOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="授课教师" prop="teacher_id">
        <template #default="scope">
          {{ dataFilter(scope.row.teacher_id, teacherOptions) }}
        </template>
      </el-table-column>
      <el-table-column label="学管" prop="manager_id">
        <template #default="scope">
          {{ dataFilter(scope.row.manager_id, managerOptions) }}
        </template>
      </el-table-column>

      <el-table-column label="入学时间" prop="admission_date" />
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
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { studentInfoData } from '@/api/student/type'
import { ElMessage, ElMessageBox } from 'element-plus'
const baseApi = import.meta.env.VITE_APP_BASE_API
// const baseUrl = import.meta.env.VITE_APP_SERVICE_URL
import type { FormInstance } from 'element-plus'
// 引入路由
import { useRouter } from 'vue-router'
import type { roleInfoData } from '@/api/role/type'
import type { userInfoData,userAllResponseData } from '@/api/user/type'
// 引入学生小仓库
import useStudentStore from '@/store/modules/students'
const studentStore = useStudentStore()
// 引入班级小仓库
import useClassStore from '@/store/modules/class'
const classStore = useClassStore()

// 引入用户小仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
const roleStore = useRoleStore()
import { classInfoData,classAllResponseData } from '@/api/class/type'
// 路由对象
const $router = useRouter()
import { majorAllResponseData } from '@/api/major/type'
import { schoolAllResponseData } from '@/api/school/type'
// 教师列表
let teacherOptions = ref<userAllResponseData[]>([])
// 学管列表
let managerOptions = ref<userAllResponseData[]>([])
// 角色列表
let roleOptions = ref<roleInfoData[]>([])
// 用户列表
let userOptions = ref<userInfoData[]>([])
// 班级列表
let classOptions = ref<classAllResponseData[]>([])
// 教师id
let teacher_role_id = ref('')
// 学管id
let manage_role_id = ref('')
//专业列表
let majorOptions = ref<majorAllResponseData[]>()
//学校列表
let schoolOptions = ref<schoolAllResponseData[]>([])
// 性别/年级/学历/学习方向数据类型
interface FilterData {
  _id: string
  name: string
}
// 性别数据格式化列表
let genderOptions = ref<FilterData[]>([
  { _id: '0', name: '男' },
  { _id: '1', name: '女' },
])
// 年级数据格式化列表
let gradeOptions = ref<FilterData[]>([
  { _id: '1', name: '大一' },
  { _id: '2', name: '大二' },
  { _id: '3', name: '大三' },
  { _id: '4', name: '大四' },
  { _id: '5', name: '在读研究生' },
])
// 学历数据格式化列表
let educationOptions = ref<FilterData[]>([
  { _id: '1', name: '专科' },
  { _id: '2', name: '本科' },
  { _id: '3', name: '硕士' },
  { _id: '4', name: '社会' },
])
// 学习方向数据格式化列表
let directionOptions = ref<FilterData[]>([
  { _id: '1', name: 'web前端' },
  { _id: '2', name: 'Java' },
  { _id: '3', name: 'C/C++' },
  { _id: '4', name: 'python' },
  { _id: '5', name: '高等数学' },
  { _id: '6', name: '线性代数' },
  { _id: '7', name: '数值分析' },
])
// 过滤要显示的数据
const dataFilter = (_id: string, options: any) => {
  const obj = options?.find((item) => item._id == _id)
  return obj ? obj.name : ''
}
// 过滤班级数据
const classFilter = (_id: string, options: any) => {
  const obj = options?.find((item) => item._id == _id)
  return obj ? obj.classname : ''
}
// 获取角色列表
const getRoleList = () => {
  if (roleStore.roles?.length) {
    roleOptions.value = roleStore.roles
    roleOptions.value?.forEach((item) => {
      if (item.name == '教师') {
        teacher_role_id.value = item._id
      } else if (item.name == '学管') {
        manage_role_id.value = item._id
      }
    })
  } else {
    roleStore.roleList().then(() => {
      roleOptions.value = roleStore.roles
      roleOptions.value?.forEach((item) => {
        if (item.name == '教师') {
          teacher_role_id.value = item._id
        } else if (item.name == '学管') {
          manage_role_id.value = item._id
        }
      })
    })
  }
}
// 获取用户列表
const getUserList = () => {
  if (userStore.users?.length) {
    userOptions.value = userStore.users
    userOptions.value.forEach((item) => {
      if (item.role_id == teacher_role_id.value) {
        teacherOptions.value.push(item)
      } else if (item.role_id == manage_role_id.value) {
        managerOptions.value.push(item)
      }
    })
  } else {
    userStore.getUserAll().then(() => {
      userOptions.value = userStore.users
      userOptions.value.forEach((item) => {
        if (item.role_id == teacher_role_id.value) {
          teacherOptions.value.push(item)
        } else if (item.role_id == manage_role_id.value) {
          managerOptions.value.push(item)
        }
      })
    })
  }
}
// 获取所有班级
const getClassAll = () => {
  classStore.getClassAll().then(() => {
    classOptions.value = classStore.classes
  })
}
// 条件查询ref对象
const searchFormRef = ref<FormInstance>()
// 查询
const searchData = () => {
  currentPage.value = 1
  getStudentList()
}
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 前往添加
const handleAdd = () => {
  $router.push('/student/update/-1')
}
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const students = ref<studentInfoData[]>([])
const handleEdit = (_id) => {
  $router.push(`/student/update/${_id}`)
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      studentStore.deleteStudent(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功！',
        })
      })
      getStudentList()
    })
    .catch(() => {})
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getStudentList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getStudentList()
}
const searchMap = reactive({
  name: '',
  direction: '',
  teacher_id: '',
  manager_id: '',
  class: '',
})
const getStudentList = () => {
  studentStore
    .getStudentList({
      page: currentPage.value,
      size: pageSize.value,
      searchMap,
    })
    .then((response) => {
      students.value = studentStore.students

      total.value = response.total
    })
}
// 处理显示图片预览大图地址
const getSrcList = (imgList: string[]) => {
  return imgList.map((item) => baseApi + '/upload/' + item)
}
onMounted(() => {
  getRoleList()
  getUserList()
  getClassAll()
  getStudentList()
})
</script>

<style scoped></style>
