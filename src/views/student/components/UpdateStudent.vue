<template>
  <div>
    <el-form
      ref="studentFormRef"
      :model="updateStudent"
      :rules="rules"
      label-width="100px"
      style="width: 100%; height: 100%"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="updateStudent.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="updateStudent.gender" placeholder="请选择性别">
          <el-option
            v-for="option in genderOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在学校" prop="school">
        <el-autocomplete
          v-model="updateStudent.school"
          :fetch-suggestions="querySearchSchool"
          placeholder="请输入学校"
        />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-autocomplete
          v-model="updateStudent.major"
          :fetch-suggestions="querySearchMajor"
          placeholder="请输入专业"
        />
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="updateStudent.grade" placeholder="请选择年级">
          <el-option
            v-for="option in gradeOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="updateStudent.education" placeholder="请选择学历">
          <el-option
            v-for="option in educationOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学习方向" prop="direction">
        <el-select
          v-model="updateStudent.direction"
          placeholder="请选择学习方向"
        >
          <el-option
            v-for="option in directionOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码" prop="id_number">
        <el-input
          v-model="updateStudent.id_number"
          placeholder="请输入身份证号码"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="updateStudent.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="家长姓名" prop="parent">
        <el-input v-model="updateStudent.parent" placeholder="请输入家长姓名" />
      </el-form-item>
      <el-form-item label="家长联系方式" prop="parent_phone">
        <el-input
          v-model="updateStudent.parent_phone"
          placeholder="请输入家长联系方式"
        />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input
          v-model="updateStudent.address"
          placeholder="请输入家庭住址"
        />
      </el-form-item>
      <el-form-item label="QQ号码" prop="qq">
        <el-input v-model="updateStudent.qq" placeholder="请输入QQ号码" />
      </el-form-item>
      <el-form-item label="所在班级" prop="class">
        <el-select v-model="updateStudent.class" placeholder="请选择所在班级">
          <el-option
            v-for="option in classOptions"
            :label="option.classname"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入学时间" prop="admission_date">
        <el-date-picker
          v-model="updateStudent.admission_date"
          type="date"
          placeholder="入学时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="授课教师" prop="teacher_id">
        <el-select
          v-model="updateStudent.teacher_id"
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
        <el-select v-model="updateStudent.manager_id" placeholder="请选择学管">
          <el-option
            v-for="option in managerOptions"
            :label="option.name"
            :value="option._id"
            :key="option._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="照片" prop="pictures" style="width: 100%">
        <el-upload
          :action="baseApi + '/manage/img/upload'"
          list-type="picture-card"
          :auto-upload="true"
          name="image"
          accept="image/*"
          v-model:file-list="fileList"
          :on-change="handleChange"
        >
          <el-icon>
            <Plus />
          </el-icon>

          <template #file="{ file }">
            <div>
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon>
                    <Download />
                  </el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon>
                    <Delete />
                  </el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注" prop="note" style="width: 100%">
        <Editor
          v-model="updateStudent.note"
          :api-key="tiny.apiKey"
          :init="tiny.init"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="
            updateStudent._id == null
              ? addData(studentFormRef)
              : updateData(studentFormRef)
          "
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router' // 引入路由
import { useRouter } from 'vue-router'
import type { roleInfoData } from '@/api/role/type'
import type { userInfoData } from '@/api/user/type'
import type { schoolInfoData } from '@/api/school/type'
import type { majorInfoData } from '@/api/major/type'
import type {
  FormInstance,
  FormRules,
  UploadUserFile,
  UploadProps,
} from 'element-plus'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import Editor from '@tinymce/tinymce-vue'

// 引入自己封装的axios对象
import request from '@/utils/request'
import type { UploadFile } from 'element-plus'
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
// 引入学校小仓库
import useSchoolStore from '@/store/modules/school'
const schoolStore = useSchoolStore()
// 引入专业小仓库
import useMajorStore from '@/store/modules/major'
const majorStore = useMajorStore()
import { classInfoData } from '@/api/class/type'
import { onMounted } from 'vue'
const baseApi = import.meta.env.VITE_APP_BASE_API
const baseUrl = import.meta.env.VITE_APP_SERVICE_URL
// 路由对象
const $router = useRouter()
// 教师列表
let teacherOptions = ref<userInfoData[]>([])
// 学管列表
let managerOptions = ref<userInfoData[]>([])
// 角色列表
let roleOptions = ref<roleInfoData[]>([])
// 用户列表
let userOptions = ref<userInfoData[]>([])
// 班级列表
let classOptions = ref<classInfoData[]>([])
// 学校列表
let schoolOptions = ref<schoolInfoData[]>([])
// 专业列表
let majorOptions = ref<majorInfoData[]>([])
// 教师id
let teacher_role_id = ref('')
// 学管id
let manage_role_id = ref('')
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
  if (classStore.classes?.length) {
    classOptions.value = classStore.classes
  } else {
    classStore.getClassAll().then(() => {
      classOptions.value = classStore.classes
    })
  }
}
// 获取所有学校
const getSchoolAll = () => {
  if (schoolStore.schools?.length) {
    schoolOptions.value = schoolStore.schools
  } else {
    schoolStore.getSchoolAll().then(() => {
      schoolOptions.value = schoolStore.schools
    })
  }
}
// 获取所有专业
const getMajorAll = () => {
  if (majorStore.majors?.length) {
    majorOptions.value = majorStore.majors
  } else {
    majorStore.getMajorAll().then(() => {
      majorOptions.value = majorStore.majors
    })
  }
}
const $route = useRoute()
let _id = $route.params._id
const updateStudent = ref({
  _id: null,
  name: '', //姓名
  gender: '', //性别
  school: '', //学校
  major: '', //专业
  grade: '', //年级
  education: '', //学历
  direction: '', //学习方向
  id_number: '', //身份号码
  phone: '', //电话号码
  parent: '', //家长姓名
  parent_phone: '', //家长联系电话
  address: '', //家庭住址
  qq: '', //QQ号码
  class: '', //所在班级
  admission_date: '', //入学时间
  teacher_id: '', //教师id
  manager_id: '', //学管id
  pictures: [], //照片数组
  note: '', //备注信息
})
const studentFormRef = ref<FormInstance>()
const addData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateStudent.value.pictures = getImgs()
      studentStore.addStudent(updateStudent.value).then(() => {
        $router.push('/student')
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const updateData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      updateStudent.value.pictures = getImgs()
      studentStore.updateStudent(updateStudent.value).then(() => {
        $router.push('/student')
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 处理学校和专业自动补全输入框
const querySearchSchool = (queryString: string, cb: any) => {
  schoolOptions.value.forEach((item) => {
    return (item.value = item.schoolname)
  })
  const results = queryString
    ? schoolOptions.value.filter(createFilter(queryString))
    : schoolOptions.value
  // call callback function to return suggestions
  cb(results)
}
const querySearchMajor = (queryString: string, cb: any) => {
  majorOptions.value.forEach((item) => {
    return (item.value = item.majorname)
  })
  const results = queryString
    ? majorOptions.value.filter(createFilter(queryString))
    : majorOptions.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
/* -------关于图片上传---------- */
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref<UploadUserFile[]>([])
const handleRemove = (file: UploadFile) => {
  // 调用后端服务器接口进行删除图片操作，需要传递要删除的图片名称
  request
    .post<any, any>('/manage/img/delete', { name: file.name })
    .then((response) => {
      // 删除成功
      if (response.status == 0) {
        // 更新记录已上传图片数组
        fileList.value.splice(fileList.value.indexOf(file), 1)
      }
    })
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
// 为父组件提供已上传图片名称
const getImgs = () => {
  return fileList.value.map((item) => item.name)
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  //   如果当前图片上传成功
  if (uploadFile.status == 'success') {
    // 获取服务端接口返回数据，里面包含图片在服务器中存储的名称和url地址
    const result = uploadFile.response
    // 服务器接口成功
    // @ts-ignore
    if (result?.status == 0) {
      // 取出图片名称和地址\
      // @ts-ignore
      const { name, url } = result.data
      // 获取已上传图片数组中最后一个元素
      uploadFile = uploadFiles[uploadFiles.length - 1]
      // 更新刚刚上传的图片名称（更新为服务器存储的图片名称）
      uploadFile.name = name
      uploadFile.url = url
    }
  }
  // 记录已经上传完毕的图片
  fileList.value = uploadFiles
}
/* ----------------富文本相关内容------------------------- */
const tiny = reactive({
  apiKey: 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc', //https://github.com/tinymce/tinymce-vue/blob/main/src/demo/views/Iframe.vue
  init: {
    language: 'zh_CN', //语言类型
    placeholder: '在这里输入文字', //textarea中的提示信息
    min_width: 320,
    min_height: 220,
    height: 500, //注：引入autoresize插件时，此属性失效
    resize: 'both', //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    branding: false, //tiny技术支持信息是否显示
    // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
    // elementpath: false, //元素路径是否显示
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //字体样式
    plugins:
      'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons', //插件配置 axupimgs indent2em
    toolbar: [
      'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ',
      'styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter',
    ], //工具栏配置，设为false则隐藏
    // menubar: "file edit my1", //菜单栏配置，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”
    // images_upload_url: '/apib/api-upload/uploadimg',  //后端处理程序的url，建议直接自定义上传函数image_upload_handler，这个就可以不用了
    // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
    paste_data_images: true, //图片是否可粘贴
    //此处为图片上传处理函数
    images_upload_handler: (blobInfo, success, _failure) => {
      // 这里用base64的图片形式上传图片,
      let reader = new FileReader() //本地预览
      reader.readAsDataURL(blobInfo.blob())
      reader.onloadend = function () {
        const imgbase64 = reader.result
        success(imgbase64)
      }
    },
    file_picker_types: 'file image media', //file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
    // 文件上传处理函数
    file_picker_callback: function (callback, _value, meta) {
      // 使用案例http://tinymce.ax-z.cn/general/upload-images.php
      // meta.filetype  //根据这个判断点击的是什么file image media
      let filetype //限制文件的上传类型,需要什么就添加什么的后缀
      if (meta.filetype == 'image') {
        filetype = '.jpg, .jpeg, .png, .gif, .ico, .svg'
      } else if (meta.filetype == 'media') {
        filetype = '.mp3, .mp4, .avi, .mov'
      } else {
        filetype =
          '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg'
      }
      let inputElem = document.createElement('input') //创建文件选择
      inputElem.setAttribute('type', 'file')
      inputElem.setAttribute('accept', filetype)
      inputElem.click()
      inputElem.onchange = () => {
        let file = inputElem.files[0] //获取文件信息
        // 所有都转成base64文件流,来自官方文档https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          // Note: Now we need to register the blob in TinyMCEs image blob
          // registry. In the next release this part hopefully won't be
          // necessary, as we are looking to handle it internally.
          let id = 'blobid' + new Date().getTime()
          // @ts-ignore
          let blobCache = tinymce.activeEditor.editorUpload.blobCache
          // @ts-ignore
          let base64 = reader.result.split(',')[1]
          let blobInfo = blobCache.create(id, file, base64)
          blobCache.add(blobInfo)
          // call the callback and populate the Title field with the file name
          callback(blobInfo.blobUri(), { title: file.name })
        }
      }
    },
  },
})
/* -------------校验规则----------------- */
// 自定义校验规则（电话号码）
const validatePhone = (_rule: any, value: any, callback: any) => {
  value = value.trim()
  const phoneReg =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (value === '') {
    callback(new Error('请输入手机号码'))
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// 自定义校验规则（身份证号码）
const validateIdNumber = (_rule, value, callback) => {
  value = value.trim()
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  const _IDre15 =
    /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/

  if (_IDRe18.test(value) || _IDre15.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号码'))
  }
}
// 表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  direction: [{ required: true, message: '请选择学习方向', trigger: 'blur' }],
  id_number: [{ validator: validateIdNumber, trigger: ['blur', 'change'] }],
  phone: [{ validator: validatePhone, trigger: ['blur', 'change'] }],
  class: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  admission_date: [
    { required: true, message: '请选择入学时间', trigger: 'blur' },
  ],
  teacher_id: [{ required: true, message: '请选择授课教师', trigger: 'blur' }],
  manager_id: [{ required: true, message: '请选择学管', trigger: 'blur' }],
})
// 获取要编辑的学员信息
const getStudent = () => {
  if (_id != '-1') {
    studentStore.getStudentById(_id as string).then((response) => {
      // @ts-ignore
      updateStudent.value = response
      const { pictures } = response
      if (pictures && pictures.length) {
        fileList.value = pictures.map((item) => ({
          name: item,
          status: 'success',
          url: baseUrl + '/upload/' + item,
        }))
      }
    })
  }
}

onMounted(() => {
  getRoleList()
  getUserList()
  getClassAll()
  getSchoolAll()
  getMajorAll()
  getStudent()
})
</script>

<style scoped>
.el-form-item {
  width: 400px;
}
</style>
