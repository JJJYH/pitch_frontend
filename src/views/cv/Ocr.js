import React, { useState } from 'react';
import { useOpenCv } from 'opencv-react';
import Tesseract, { OEM, PSM } from 'tesseract.js';
import { display } from '@mui/system';
import { SmartButton } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch } from 'react-redux';
import { addCert } from 'store/certSlice';
import { useEffect } from 'react';
const Ocr = ({ ocrImage, setOcrImage, dialogOpen, dialogClose, setOcrProgress }) => {
  const { loaded, cv } = useOpenCv();
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(progress);
    setOcrProgress(progress);
    if (progress > 99.5) {
      console.log(progress);
      dialogClose();
    }
  }, [progress]);
  // 유클리드 거리 계산 함수
  const calculateDistance = (box1, box2) => {
    const center1 = {
      x: box1.x + box1.width / 2,
      y: box1.y + box1.height / 2
    };
    const center2 = {
      x: box2.x + box2.width / 2,
      y: box2.y + box2.height / 2
    };

    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    //ocrImage 등록
    setOcrImage(file);
    dialogOpen();
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

          //Origin 파일
          const src = cv.matFromImageData(imgData);

          //Destination 파일
          const dst = new cv.Mat();

          // 이미지 처리 작업 순차 실행: erode -> dilate
          let M = cv.Mat.ones(0, 0, cv.CV_8U);
          //cross kerner matrix
          let anchor = new cv.Point(-1, -1);

          //size resize
          let dsize = new cv.Size(2000, 2000);
          cv.resize(src, dst, dsize, -1, -1, cv.INTER_AREA);
          let ksize = new cv.Size(7, 7);

          //GrayScale
          cv.cvtColor(dst, dst, cv.COLOR_BGR2RGB);
          cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);

          //cross kernel + Change 2D
          // let kernel = cv.matFromArray(3, 3, cv.CV_32FC1, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
          // cv.filter2D(dst, dst, -1, kernel);

          //Pre Processing Openning
          cv.erode(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
          cv.dilate(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

          //GaussianBlur
          cv.GaussianBlur(dst, dst, ksize, -1, -1, cv.BORDER_DEFAULT);

          //Binarization(SelectColor, White);
          // cv.threshold(dst, dst, 0, 255, cv.THRESH_OTSU);

          //Contours + Bounding Box
          // let contours = new cv.MatVector();
          // let hierarchy = new cv.Mat();
          // cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

          // let mergedRects = [];
          // let box = [];
          // // 반복적으로 병합
          // while (contours.size() > 0) {
          //   let rect = cv.boundingRect(contours.get(0));
          //   let remainingContours = new cv.MatVector();

          //   for (let i = 1; i < contours.size(); i++) {
          //     let comp_cnt = contours.get(i);
          //     let comp_rect = cv.boundingRect(comp_cnt);

          //     if (calculateDistance(comp_rect, rect) < 55) {
          //       // 인접한 contours라면, rect를 병합
          //       rect = new cv.Rect(
          //         Math.min(rect.x, comp_rect.x),
          //         Math.min(rect.y, comp_rect.y),
          //         Math.max(rect.x + rect.width, comp_rect.x + comp_rect.width) - Math.min(rect.x, comp_rect.x),
          //         Math.max(rect.y + rect.height, comp_rect.y + comp_rect.height) - Math.min(rect.y, comp_rect.y)
          //       );
          //     } else {
          //       // 인접하지 않는 contours는 유지
          //       remainingContours.push_back(comp_cnt);
          //     }
          //   }

          //   // 여기서 mergedRects 배열에 현재 rect를 추가
          //   mergedRects.push(rect);

          //   // 기존 contours를 업데이트
          //   contours = remainingContours;
          // }

          //image output: mergedRects에 있는 rect만 그리도록 수정
          // for (let rect of mergedRects) {
          //   if (!(rect.x == 0 && rect.y == 0 && rect.width == dsize.width && rect.height == dsize.height)) {
          //     const margin = 10;
          //     cv.rectangle(
          //       dst,
          //       new cv.Point(rect.x - margin, rect.y - margin),
          //       new cv.Point(rect.x + rect.width + margin, rect.y + rect.height + margin),
          //       new cv.Scalar(0, 255, 0),
          //       2,
          //       cv.LINE_AA,
          //       0
          //     );
          //   }
          // }

          // let mask = new cv.Mat.zeros(dsize.width, dsize.height, cv.CV_8U);
          // let text_only = new cv.Mat();

          // for (let rect of mergedRects) {
          //   if (!(rect.x == 0 && rect.y == 0 && rect.width == dsize.width && rect.height == dsize.height)) {
          //     const margin = 10;
          //     cv.rectangle(
          //       mask,
          //       new cv.Point(rect.x - margin, rect.y - margin),
          //       new cv.Point(rect.x + rect.width + margin, rect.y + rect.height + margin),
          //       new cv.Scalar(255, 255, 255),
          //       -1,
          //       cv.LINE_AA,
          //       0
          //     );
          //   }
          // }

          //Bit Wise And Calculate
          // cv.bitwise_and(mask, dst, text_only);

          //image output
          // cv.imshow(canvasOutput, text_only);
          cv.imshow(canvasOutput, dst);

          //configure text output => tessarect
          const ocrCanvas = document.createElement('canvas');
          ocrCanvas.width = dst.cols;
          ocrCanvas.height = dst.rows;

          // cv.imshow(ocrCanvas, text_only);
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
              PSM.SINGLE_COLUMN
              // OEM.TESSERACT_LSTM_COMBINED
            ).then(({ data: { text } }) => {
              let ocr_cert_name = '';
              let ocr_acq_date = '';
              let ocr_publisher = '';
              const regex = /(.*?생년.*?:(\d+).*?§)|(.*?유효.*?)|(.*?한국.*)|(.*?공인.*?)|(.*?등급(.*))/;
              text = text
                .split('\n')
                .map((line) =>
                  line
                    .trim()
                    .replace(/[{}[\]\\|=+_-]/g, ' ')
                    .replace(/\s/g, '')
                )
                .filter((line) => regex.exec(line))
                .map((line) => line.replace(/[^가-힣A-Za-z0-9]/g, ''));
              text.map((item) => {
                var splitChar = '';
                if (item.includes('등급')) {
                  splitChar = item.split('등급');
                  item = splitChar[1];
                  ocr_cert_name = item;
                  console.log(ocr_cert_name);
                }
                if (item.includes('유효')) {
                  const match = item.match(/\d+/);
                  if (match !== null) {
                    const acq_date = match[0] ? match[0].substr(0, 8) : '';
                    var dateFormat = acq_date ? acq_date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3') : '';

                    ocr_acq_date = Date.parse(dateFormat);

                    console.log(ocr_acq_date);
                  }
                }
                if (item.includes('원장')) {
                  ocr_publisher = item;
                  console.log(ocr_publisher);
                }
              });
              const sendOcr = {
                cert_no: '',
                cert_name: ocr_cert_name,
                publisher: ocr_publisher,
                acquisition_date: ocr_acq_date === null ? '' : ocr_acq_date
              };
              dispatch(addCert(sendOcr));
              setOcrText(sendOcr);
            });
          });
        };
        img.src = URL.createObjectURL(file);
        console.log(img.src);
        setOcrImage(img.src);
        if (ocrImage) {
          console.log(img.src);
        }
      }
    }
  };

  console.log(ocrText);

  const ocrRef = useRef(null);
  return (
    <div>
      <progress max="100" value={progress}></progress>
      <Tooltip title="OCR로 편하게 입력하세요!">
        <IconButton onClick={() => ocrRef.current.click()}>
          <SmartButton />
        </IconButton>
      </Tooltip>
      <div className="inputoutput">
        <canvas id="canvasOutput" style={{ display: 'none' }}></canvas>
      </div>
      <input type="file" accept="*" onChange={handleImageUpload} style={{ display: 'none' }} ref={ocrRef} value="" />
    </div>
  );
};

export default Ocr;
