import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export default function TitlebarImageList() {
  const [imgSrc, setImgSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState([
    {
      name: '',
      size: '',
      type: ''
    }
  ]);

  const imgUpLoad = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setFileInfo([{ name: file.name, size: file.size, type: file.type }]);
    reader.readAsDataURL(file);

    /**------------------Axios------------------------ */
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/main/cv/imageUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImgSrc('/images/' + response.data);
      console.log(response.data);
    } catch (error) {
      console.error('파일 업로드 실패: ' + error);
    }

    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result || null);
        resolve();
      };
    });
  };

  // fileInfo 업데이트를 감지하기 위한 useEffect
  useEffect(() => {
    console.log('File Info : ' + JSON.stringify(fileInfo[0]));
  }, [fileInfo]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ImageList sx={{ width: '100%', height: 250, m: 0, overflowY: 'visible' }} cols={1}>
      <ImageListItem>
        <img src={imgSrc} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
        <input
          accept="image/jpg, image/jpeg, image/png"
          type="file"
          onChange={(e) => imgUpLoad(e)}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <ImageListItemBar
          title="이미지 업로드"
          actionIcon={
            <IconButton aria-label={`info about `} onClick={handleButtonClick} sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
              <ImageSearchOutlinedIcon />
            </IconButton>
          }
        />
      </ImageListItem>
    </ImageList>
  );
}
