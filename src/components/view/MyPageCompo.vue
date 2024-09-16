<template>
  <div>
    <h1>마이페이지</h1>

    <div class="contains">
      <div class="progress-task">
        <span class="task-title">누적 Task</span>
        <div class="task-card total-task">
          <span>Total Task</span>
          <strong>154건</strong>
        </div>
        <div class="task-card end-task">
          <span>End Task</span>
          <strong>131건</strong>
        </div>
        <div class="task-card remain-task">
          <span>Remain Task</span>
          <strong>23건</strong>
        </div>
      </div>
      <div class="vertical-line"></div>
      <div class="task-chart">
        <span class="task-title">연별 종료 Task</span>
        <v-select class="select-year" v-model="selectedYear" :items="years" label="Year" variant="outlined"></v-select>
        <Bar class="chart" :options="chartOptions" :data="chartData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'MyPageCompo',
  components: { Bar },
  setup() {
    const years = ref([]);
    const selectedYear = ref(new Date().getFullYear());
    const chartOptions = {
      responsive: true,
    };

    const defaultLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const baseDataset = {
      backgroundColor: '#6b9e9b',
      borderColor: '#5A6D8C',
      borderWidth: 1,
    };

    const yearDataMap = {
      2023: [30, 50, 20, 60, 80, 45, 30, 50, 70, 90, 55, 40],
      2022: [10, 40, 25, 60, 75, 20, 35, 60, 80, 50, 30, 45],
      default: [40, 20, 12, 45, 55, 35, 25, 50, 65, 70, 40, 30],
    };

    const chartData = ref({
      labels: defaultLabels,
      datasets: [
        {
          label: `${selectedYear.value} 종료 Task`,
          data: yearDataMap.default, // 초기 데이터만 설정
          ...baseDataset,
        },
      ],
    });

    const updateChartData = (year) => {
      const data = yearDataMap[year] || yearDataMap.default;
      chartData.value = {
        labels: defaultLabels,
        datasets: [
          {
            label: `${year} 종료 Task`,
            data,
            ...baseDataset,
          },
        ],
      };
    };

    watch(selectedYear, (newYear) => {
      updateChartData(newYear);
    });

    onMounted(() => {
      years.value = Array.from({ length: 2100 - 1950 + 1 }, (v, i) => 1950 + i);
      updateChartData(selectedYear.value); // 초기 차트 데이터 설정
    });

    return {
      selectedYear,
      years,
      chartData,
      chartOptions,
    };
  },
};
</script>

<style scoped>
h1 {
  text-align: left;
}

.contains {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  height: 590px;
  border: 1.5px solid #6b9e9b;
  border-radius: 10px;
  background: #ffffff;
}

.progress-task {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 30%;
  padding: 20px;
}

.task-title {
  font-size: 25px;
  font-weight: bold;
}

.task-card {
  margin-top: 20px;
  height: 80px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.task-card span {
  font-size: 14px;
  color: #777777;
  font-weight: bold;
}

.task-card strong {
  font-size: 20px;
  margin-top: 5px;
}

/* 각 카드의 배경 색상 */
.total-task {
  background-color: #e9e7fc;
  border: 2px solid #c095e6;
}
.end-task {
  background-color: #e2f9e4;
  border: 2px solid #a0e4ab;
}
.remain-task {
  background-color: #fce7e7;
  border: 2px solid #edb9b9;
}

/* 라인 */
.vertical-line {
  height: 550px;
  margin-top: 20px;
  border-radius: 20px;
  border-left: 1px solid #6b9e9b;
}

/* task-chart는 오른쪽에 위치 */
.task-chart {
  width: 65%;
  padding: 20px;
}

.select-year {
  width: 200px;
  margin-top: 20px;
}

.chart {
  padding: 20px;
  width: 100%;
  min-height: 400px;
  max-height: 400px;
  border-radius: 10px;
  border: 1.5px solid #6b9e9b;
}
</style>
