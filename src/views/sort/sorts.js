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

const getDday = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);

  const timeDiff = target - now;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export { getFormattedDate, getAge, getDday };
