import React from 'react';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, RadialLinearScale);

const RadarChart = ({ user_nm }) => {
  console.log(user_nm);
  const data = {
    labels: ['학력', '자격증', '경력', '어학점수', '우대사항', '나이'],
    datasets: [
      {
        label: '지원자 평균',
        backgroundColor: 'rgba(52, 195, 143, 0.2)',
        borderColor: '#34c38f',
        pointBackgroundColor: '#34c38f',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#34c38f',
        data: [65, 59, 90, 81, 56, 55]
      },
      {
        label: user_nm + '님',
        backgroundColor: 'rgba(85, 110, 230, 0.2)',
        borderColor: '#556ee6',
        pointBackgroundColor: '#556ee6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#556ee6',
        data: [28, 48, 40, 19, 96, 27]
      }
    ]
  };

  const option = {};
  return (
    <>
      <div style={{ width: '500px', padding: '20px' }}>
        <Radar data={data} options={option} />
      </div>
    </>
  );
};

export default RadarChart;
