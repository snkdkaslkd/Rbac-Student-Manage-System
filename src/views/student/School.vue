<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加学校</el-button>
    </div>
    <el-table :data="schools" style="width: 100%; height: 380px" border>
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="学校名称" prop="schoolname"></el-table-column>

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
    <!-- 添加/编辑学校弹窗 -->
    <el-dialog v-model="schoolFormVisible" title="添加/编辑学校" width="500px">
      <el-form
        :model="school"
        label-width="100px"
        label-position="right"
        :rules="rules"
        ref="schoolFormRef"
        style="width: 400px"
      >
        <el-form-item label="学校名称" prop="schoolname">
          <el-input v-model="school.schoolname" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              school._id == null
                ? addData(schoolFormRef)
                : updateData(schoolFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="schoolFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import type { schoolInfoData } from '@/api/school/type'
import { onMounted, ref, reactive, nextTick } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from 'element-plus'
// 引入学校小仓库
import useSchoolStore from '@/store/modules/school'
const schoolStore = useSchoolStore()
const schools = ref<schoolInfoData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
// 弹窗是否展示
const schoolFormVisible = ref(false)
// 收集学校信息对象
const school = ref<schoolInfoData>({
  _id: null,
  schoolname: '',
})
const schoolFormRef = ref<FormInstance>()
// 校验规则
const rules = reactive<FormRules>({
  schoolname: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
})
const handleEdit = (_id) => {
  handleAdd()
  schoolStore.getSchoolById(_id).then((response) => {
    school.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      schoolStore.deleteSchool(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除学校成功！',
        })
        getSchoolList()
      })
    })
    .catch(() => {
      return false
    })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getSchoolList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getSchoolList()
}
// 获取学校列表
const getSchoolList = () => {
  schoolStore
    .getSchoolList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      schools.value = schoolStore.schools
      total.value = response.total
    })
}
// 打开添加/编辑学校对话框
const handleAdd = () => {
  schoolFormVisible.value = true
  school.value = {
    _id: null,
    schoolname: '',
  }
  nextTick(() => {
    schoolFormRef.value.resetFields()
  })
}
// 添加学校
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      schoolStore.addSchool(school.value).then(() => {
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        schoolFormVisible.value = false
        getSchoolList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 编辑学校
const updateData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      schoolStore.updateSchool(school.value).then(() => {
        schoolFormVisible.value = false
        getSchoolList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  getSchoolList()
})
</script>

<style scoped></style>
