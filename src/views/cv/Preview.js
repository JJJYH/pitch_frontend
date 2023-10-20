import { Box, Grid, IconButton, Typography } from '@mui/material';
import { useState, useRef } from 'react';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import Resizer from 'react-image-file-resizer';

const Preview = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const fileInputRef = useRef(null);

  const imgUpLoad = async (e) => {
    const file = e.target.files[0];

    // resizeFile 함수를 호출할 수 있습니다.
    const image = await resizeFile(file);
    const reader = new FileReader();

    // console.log('file Image : ' + JSON.stringify(file));
    console.log('Resized Image : ' + image);

    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result || null);
        resolve();
      };
    });
  };

  // resizeFile 함수를 먼저 선언합니다.
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (url) => {
          console.log('Resized Url Before : ' + url);
          resolve(url);
        },
        'base64'
      );
    });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img width={'100%'} src={imgSrc} alt="" style={{ width: '250px', maxWidth: '200px', maxHeight: '300px' }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <input accept="image/*" type="file" onChange={(e) => imgUpLoad(e)} style={{ display: 'none' }} ref={fileInputRef} />
        <IconButton aria-label="Image_Upload" onClick={handleButtonClick}>
          <Typography variant="h5">이미지 업로드</Typography>
          <ImageSearchOutlinedIcon />
        </IconButton>
      </Grid>
    </>
  );
};

export default Preview;
