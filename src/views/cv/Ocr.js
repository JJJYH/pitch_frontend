import React, { useState } from 'react';
import { useOpenCv } from 'opencv-react';
import Tesseract, { OEM, PSM } from 'tesseract.js';

const Ocr = () => {
  const { loaded, cv } = useOpenCv();
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (loaded) {
        const canvasOutput = document.querySelector('#canvasOutput');
        const img = new Image();

        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const src = cv.matFromImageData(imgData);
          const dst = new cv.Mat();

          // 이미지 처리 작업 순차 실행: erode -> dilate
          let M = cv.Mat.ones(0, 0, cv.CV_8U);
          //cross kerner matrix
          let anchor = new cv.Point(-1, -1);
          //size resize
          let dsize = new cv.Size(2000, 2000);
          cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
          let ksize = new cv.Size(5, 5);
          //GrayScale
          cv.cvtColor(dst, dst, cv.COLOR_BGR2RGB);
          cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);
          //cross kernel
          let kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
          cv.filter2D(dst, dst, -1, kernel);
          //   cv.medianBlur(dst, dst, 3);
          //   cv.bilateralFilter(dst, dst, -1, 75, 75, cv.BORDER_DEFAULT);
          cv.erode(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
          cv.dilate(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
          cv.GaussianBlur(dst, dst, ksize, -1, -1, cv.BORDER_DEFAULT);
          // cv.Canny(dst, dst, 60, 240, 3, false);
          cv.threshold(dst, dst, 177, 255, cv.THRESH_OTSU);

          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

          for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let rect = cv.boundingRect(cnt);
            let point1 = new cv.Point(rect.x, rect.y);
            let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
            cv.rectangle(dst, point1, point2, new cv.Scalar(0, 255, 0), 2, cv.LINE_AA, 0);
          }

          cv.imshow(canvasOutput, dst);

          const ocrCanvas = document.createElement('canvas');
          //   const ocrCtx = ocrCanvas.getContext('2d');
          ocrCanvas.width = dst.cols;
          ocrCanvas.height = dst.rows;

          cv.imshow(ocrCanvas, dst);

          ocrCanvas.toBlob((blob) => {
            const ocrImage = new File([blob], 'ocr_image.png', {
              type: 'image/png'
            });

            Tesseract.recognize(
              ocrImage,
              'kor+eng', // 언어
              {
                logger: (m) => {
                  if (m.status == 'recognizing text') {
                    const progressValue = (m.progress * 100).toFixed(2);
                    setProgress(progressValue);
                  }
                }
              },
              PSM.SINGLE_COLUMN,
              OEM.TESSERACT_LSTM_COMBINED
            ).then(({ data: { text } }) => {
              //   text = text
              //     .split('\n')
              //     .map((line) => line.trim().replace(/\s/g, ''))
              //     .filter((line) => line !== '');
              setOcrText(text);
            });
          });
        };

        img.src = URL.createObjectURL(file);
      }
    }
  };
  console.log(ocrText);
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <progress max="100" value={progress}></progress>
      <div className="inputoutput">
        <canvas id="canvasOutput"></canvas>
        <div className="caption">canvasOutput</div>
        <div>Recognized Text:</div>
        <pre>{ocrText}</pre>
      </div>
    </div>
  );
};

export default Ocr;
