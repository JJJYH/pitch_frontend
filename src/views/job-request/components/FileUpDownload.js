import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../utils/axios';

import Dropdown from '../../components/form/Dropdown';
import Input from '../../components/form/Input';
import Label from '../../components/form/Label';
import Radio from '../../components/form/Radio';
import PageCard from '../../components/page/PageCard';
import PageHeader from '../../components/page/PageHeader';
import PageTitle from '../../components/page/PageTitle';
import Button from '../../components/form/Button';
import FormGroup from '../../components/form/FormGroup';
import Autocomplete from './Autocomplete';

const FileUpDownload = () => {
  const onSubmit = (e) => {
    e.preventDefault();

    formData.append('uploadFile', selectedFile); // selectedFile은 파일 업로드 필드에서 선택한 파일입니다.
  };

  return (
    <form id="registerForm" className="modal-body" enctype="multipart/form-data" action="/unitprices" method="post" onSubmit={onSubmit}>
      <div className="row g-2">
        <Label id={'fileInput'} value={'견적서 파일 첨부'} />
      </div>
      <div className="row g-2">
        <div className="col mb-0 input-group">
          <input
            type="file"
            className="form-control"
            name="uploadFile"
            id="fileInput"
            aria-describedby="inputGroupFileAddon04"
            aria-label="Upload"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedFile(file);
            }}
          />
          <button className="btn btn-outline-primary" type="button" id="fileBtn">
            첨부
          </button>
          <input type="hidden" name="file_name" /> <input type="hidden" name="file_size" /> <input type="hidden" name="file_format" />
        </div>
      </div>
    </form>
  );

  const UploadBox = () => {
    return (
      <label>
        <input type="file" />

        <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
        <p className="preview_desc">파일당 최대 3MB</p>
      </label>
    );
  };
};

export default FileUpDownload;
