/* 날짜 1992/11/22 형식으로 변환하는 함수 */
const getFormattedDate = (data) => {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

/* 만나이 계산하는 함수 */
const getAge = (data) => {
  const birthday = new Date(data);
  const today = new Date();

  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age;
};

/* d-day 계산하는 함수 */
const getDday = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);

  const timeDiff = target - now;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

/* 이미지 파일 변환하는 함수 */
const getImage = (image) => {
  const byteCharacters = window.atob(image);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  const imageUrl = URL.createObjectURL(blob);

  return imageUrl;
};

const evalSub = [
  {
    sub: '기술',
    description: '기술 점수 평가 기준 설명~~!@!@'
  },
  {
    sub: '협동',
    description: '인성1 점수 평가 기준 설명~~!@!@'
  },
  {
    sub: '열정',
    description: '인성2 점수 평가 기준 설명~~!@!@'
  },
  {
    sub: '태도',
    description: '인성3 점수 평가 기준 설명~~!@!@'
  },
  {
    sub: '성장가능성',
    description: '태도 점수 평가 기준 설명~~!@!@'
  }
];

/* 헤더에서 파일명 가져오는 함수*/
const getFileNameFromContentDisposition = (contentDisposition) => {
  if (contentDisposition) {
    const match = contentDisposition.match(/filename=([^;\s]+)/);
    return match ? match[1] : null;
  }
  return null;
};

export { getFormattedDate, getAge, getDday, getImage, getFileNameFromContentDisposition, evalSub };
