import React from 'react';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useEffect } from 'react';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, RadialLinearScale);

const RadarChart = ({ user_nm, chartData }) => {
  console.log(user_nm);

  useEffect(() => {
    console.log(chartData);
  }, [chartData]);
  const data = {
    labels: ['학력 평균', '자격증 수', '경력 수', '어학 자격 수', '우대사항 수', '보유 스킬 수'],
    datasets: [
      {
        label: '지원자 평균',
        backgroundColor: 'rgba(52, 195, 143, 0.2)',
        borderColor: '#34c38f',
        pointBackgroundColor: '#34c38f',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#34c38f',
        // data: [65, 59, 90, 81, 56, 55]
        data: [
          chartData.data[0].avg_score,
          chartData.data[0].cert_count,
          chartData.data[0].career_count,
          chartData.data[0].lang_count,
          chartData.data[0].advantage_count,
          chartData.data[0].skill_count
        ]
      },

      {
        label: user_nm + '님',
        backgroundColor: 'rgba(85, 110, 230, 0.2)',
        borderColor: '#556ee6',
        pointBackgroundColor: '#556ee6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#556ee6',
        // data: [28, 48, 40, 19, 96, 27]
        data: [
          chartData.data[1].avg_score,
          chartData.data[1].cert_count,
          chartData.data[1].career_count,
          chartData.data[1].lang_count,
          chartData.data[1].advantage_count,
          chartData.data[1].skill_count
        ]
      }
    ]
  };

  const option = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          min: 0 // 최솟값 설정
        }
      }
    }
  };
  return (
    <>
      <div style={{ width: '500px', padding: '20px' }}>
        <Radar data={data} options={option} />
      </div>
    </>
  );
};

export default RadarChart;
