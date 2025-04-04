<template>
  <!-- <div id="myChart1" style="width: 600px;height: 400px;"></div> -->
  <div>
    <h1 class="home_title" style="text-align: center">
      <el-button @click="getPreYearData">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        上一年
      </el-button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <span>{{ year }}</span>
      <span>年学员数量</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="getNextYearData">
        下一年
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </h1>
    <div id="myChart" style="width: 100%; height: 500px"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { reqStudentForYear } from '@/api/student'
import { ElMessage } from 'element-plus'
const year = ref(new Date().getFullYear())

const getPreYearData = () => {
  year.value--
  drawChart()
}
const getNextYearData = () => {
  year.value++
  drawChart()
}

const drawChart = () => {
  reqStudentForYear(year.value + '').then((response) => {
    if (response.status == '0') {
      // 基于准备好的dom
      const dom = document.getElementById('myChart')
      const myChart = echarts.init(dom)
      let option
      let dataArr = ['0']
      if (response.data && response.data.length) {
        response.data.forEach((item) => {
          dataArr[parseInt(item._id) - 1] = item.count
        })
      } else {
        ElMessage({
          type: 'warning',
          message: '当前年份无数据！',
        })
      }
      option = {
        xAxis: {
          type: 'category',
          data: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: dataArr,
            type: 'bar',
          },
        ],
      }
      option && myChart.setOption(option)
    }
  })
}
onMounted(() => {
  drawChart()
})
</script>

<style scoped></style>
