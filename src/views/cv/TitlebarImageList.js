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
  const [img_src, set_img_src] = useState(null);
  const file_input_ref = useRef(null);
  const [file_info, set_file_info] = useState([
    {
      name: '',
      size: '',
      type: ''
    }
  ]);

  const img_upload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    set_file_info([{ name: file.name, size: file.size, type: file.type }]);
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
      set_img_src('/images/' + response.data);
      console.log(response.data);
    } catch (error) {
      console.error('파일 업로드 실패: ' + error);
    }

    return new Promise((resolve) => {
      reader.onload = () => {
        set_img_src(reader.result || null);
        resolve();
      };
    });
  };

  // file_info 업데이트를 감지하기 위한 useEffect
  useEffect(() => {
    console.log('File Info : ' + JSON.stringify(file_info[0]));
  }, [file_info]);

  const handleButtonClick = () => {
    if (file_input_ref.current) {
      file_input_ref.current.click();
    }
  };

  return (
    <ImageList
      sx={{
        width: 180,
        height: 250,
        m: 0,
        overflow: 'hidden',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        border: '1px solid rgb(204, 204, 204)'
      }}
      cols={1}
    >
      <ImageListItem>
        <img src={img_src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
        <input
          accept="image/jpg, image/jpeg, image/png"
          type="file"
          onChange={(e) => img_upload(e)}
          style={{ display: 'none' }}
          ref={file_input_ref}
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
