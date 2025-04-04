<template>
  <div>
    <!-- 条件查询表单 -->
    <el-form
      :inline="true"
      :model="searchMap"
      style="margin: 20px 0"
      ref="searchFormRef"
    >
      <el-form-item prop="teacher_id" style="width: 200px">
        <el-select v-model="searchMap.teacher_id" placeholder="请选择授课教师">
          <el-option
            v-for="option in teacherOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="manager_id" style="width: 200px">
        <el-select v-model="searchMap.manager_id" placeholder="请选择学管">
          <el-option
            v-for="option in managerOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button @click="resetForm(searchFormRef)">重置</el-button>
        <el-button type="primary" @click="handleAdd">添加班级</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="classes" style="width: 100%; height: 380px" border>
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="班级名称" prop="classname"></el-table-column>
      <el-table-column
        label="授课教师"
        prop="teacher_id"
        :formatter="formatTeacher"
      ></el-table-column>
      <el-table-column
        label="学管"
        prop="manager_id"
        :formatter="formatManager"
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
    <!-- 添加/编辑班级 -->
    <el-dialog v-model="classFormVisible" title="添加/编辑班级" width="500px">
      <el-form
        :model="updateClass"
        ref="classFormRef"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="班级名称" prop="classname">
          <el-input v-model="updateClass.classname" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher_id">
          <el-select
            v-model="updateClass.teacher_id"
            placeholder="请选择授课教师"
          >
            <el-option
              v-for="option in teacherOptions"
              :label="option.name"
              :value="option._id"
              :key="option._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学管" prop="manager_id">
          <el-select v-model="updateClass.manager_id" placeholder="请选择学管">
            <el-option
              v-for="option in managerOptions"
              :label="option.name"
              :value="option._id"
              :key="option._id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              updateClass._id == null
                ? addData(classFormRef)
                : updateData(classFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="classFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { classInfoData } from '@/api/class/type'
import type { userInfoData,userAllResponseData } from '@/api/user/type'
import type { roleInfoData } from '@/api/role/type'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const searchFormRef = ref<FormInstance>()
// 引入班级小仓库
import useClassStore from '@/store/modules/class'
const classStore = useClassStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
const roleStore = useRoleStore()
// 教师列表
let teacherOptions = ref<userAllResponseData[]>([])
// 学管列表
let managerOptions = ref<userAllResponseData[]>([])
// 角色列表
let roleOptions = ref<roleInfoData[]>([])
// 用户列表
let userOptions = ref<userInfoData[]>([])
// 教师id
let teacher_role_id = ref('')
// 学管id
let manage_role_id = ref('')
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
// 格式化教师
const formatTeacher = (_row: any, _colum: any, cellValue: number) => {
  let teacher =
    teacherOptions?.value?.find((item) => item._id == cellValue + '') || {}
  // @ts-ignore
  return teacher.name
}
// 格式化学管
const formatManager = (_row: any, _colum: any, cellValue: number) => {
  let manager =
    managerOptions?.value?.find((item) => item._id == cellValue + '') || {}
  // @ts-ignore
  return manager.name
}

const classes = ref<classInfoData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
// 查询条件对象
const searchMap = reactive({
  teacher_id: '',
  manager_id: '',
})
// 条件查询按钮回调
const searchData = () => {
  getClassList()
}
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 添加/编辑班级表单收集数据对象
const updateClass = ref<classInfoData>({
  _id: null,
  classname: '',
  teacher_id: '',
  manager_id: '',
})
// 添加/编辑对话框是否展示
const classFormVisible = ref(false)
// 添加/编辑表单ref对象
const classFormRef = ref<FormInstance>()
// 添加/编辑表单校验规则
const rules = reactive<FormRules>({
  classname: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  teacher_id: [{ required: true, message: '请选择授课教师', trigger: 'blur' }],
  manager_id: [{ required: true, message: '请选择学管', trigger: 'blur' }],
})
// 添加班级
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      classStore.addClass(updateClass.value).then(() => {
        classFormVisible.value = false
        getClassList()
      })
    } else {
      return false
    }
  })
}
// 编辑班级
const updateData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      classStore.updateClass(updateClass.value).then(() => {
        classFormVisible.value = false
        getClassList()
      })
    } else {
      return false
    }
  })
}
// 打开添加/编辑窗口
const handleAdd = () => {
  classFormVisible.value = true
  updateClass.value = {
    _id: null,
    classname: '',
    teacher_id: '',
    manager_id: '',
  }
  nextTick(() => {
    classFormRef.value.resetFields()
  })
}
const handleEdit = (_id) => {
  handleAdd()
  classStore.getClassById(_id).then((response) => {
    updateClass.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      classStore.deleteClass(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
      getClassList()
    })
    .catch(() => {
      return false
    })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getClassList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getClassList()
}
const getClassList = () => {
  classStore
    .getClassList({ page: currentPage.value, size: pageSize.value, searchMap })
    .then((resposne) => {
      classes.value = classStore.classes
      total.value = resposne.total
    })
}
onMounted(() => {
  getRoleList()
  getUserList()
  getClassList()
})
</script>

<style scoped></style>
