import React from 'react';

function FileDownloadButton() {
  const downloadFile = async () => {
    try {
      // 서버에서 파일 다운로드 URL을 가져옴 (서버에서 적절한 엔드포인트를 사용해야 함)
      const fileUrl = `http://localhost:8888/admin/hire/193/files`;

      // 서버에 GET 요청을 보냄
      const response = await get(fileUrl);

      // 응답의 blob을 가져와서 새로운 URL을 생성
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // a 엘리먼트를 생성하고 설정
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'filename.txt';

      // body에 추가하고 클릭하여 다운로드를 시작
      document.body.appendChild(link);
      link.click();

      // 작업이 끝나면 요소를 제거
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return <button onClick={downloadFile}>Download File</button>;
}

export default FileDownloadButton;
