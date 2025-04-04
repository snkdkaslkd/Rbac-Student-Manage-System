<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加专业</el-button>
    </div>
    <el-table :data="majors" style="width: 100%; height: 380px" border>
      <el-table-column label="序号" width="60" type="index"></el-table-column>
      <el-table-column label="专业名称" prop="majorname"></el-table-column>

      <el-table-column label="Operations">
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
    <!-- 添加/编辑专业对话框 -->
    <el-dialog v-model="majorFormVisible" title="添加/编辑专业" width="500px">
      <el-form
        :model="major"
        label-width="100px"
        style="width: :400px;"
        ref="majorFormRef"
        :rules="rules"
      >
        <el-form-item label="专业名称" prop="majorname" style="width: 300px">
          <el-input v-model="major.majorname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              major._id == null
                ? addData(majorFormRef)
                : updateData(majorFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="majorFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import type { majorInfoData } from '@/api/major/type'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
// 引入专业小仓库
import useMajorStore from '@/store/modules/major'
const majorStore = useMajorStore()
const majors = ref<majorInfoData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const majorFormRef = ref<FormInstance>()

const handleAdd = () => {
  majorFormVisible.value = true
  major.value = {
    _id: null,
    majorname: '',
  }
  nextTick(() => {
    majorFormRef.value.resetFields()
  })
}
const handleEdit = (_id) => {
  handleAdd()
  majorStore.getMajorById(_id).then((response) => {
    major.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗??', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      majorStore.deleteMajor(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getMajorList()
      })
    })
    .catch(() => {})
}
const majorFormVisible = ref(false)
// 收集专业信息对象
const major = ref<majorInfoData>({
  _id: null,
  majorname: '',
})
const rules = reactive<FormRules>({
  majorname: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
})
// 获取专业列表
const getMajorList = () => {
  majorStore
    .getMajorList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      majors.value = majorStore.majors
      total.value = response.total
    })
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMajorList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMajorList()
}
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      majorStore.addMajor(major.value).then(() => {
        majorFormVisible.value = false
        getMajorList()
      })
    } else {
      return false
    }
  })
}
const updateData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      majorStore.updateMajor(major.value).then(() => {
        majorFormVisible.value = false
        getMajorList()
      })
    } else {
      return false
    }
  })
}

onMounted(() => {
  getMajorList()
})
</script>

<style scoped></style>
