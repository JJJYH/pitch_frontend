import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// datepicker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { placeholder } from '@babel/types';
import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';
import { principal } from 'api';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const user_birth = dayjs('1999-12-31').locale('ko').format();
// console.log(user_birth);
// const user_birth2 = dayjs(user_birth).locale('ko')
// console.log(user_birth2);

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();
  const [isRole, setRole] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const initialDepartment = { dept_name: '' };
  const departments = [
    { value: '인사', label: '인사' },
    { value: '연구개발', label: '연구개발' },
    { value: '영업', label: '영업' },
    { value: '경영', label: '경영' },
    { value: '마케팅', label: '마케팅' },
    { value: '회계', label: '회계' },
    // ... 다른 부서들 추가
  ];
  console.log(email);

  const googleHandler = async () => {
    console.error('Register');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const changeRole = () => {
    setRole(!isRole);
  };

  useEffect(() => {
    //changePassword('123456');
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems={"center"} spacing={2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                sx={{
                  width: '50px',
                  height: '30px',
                  padding: '6px',
                  '& .MuiSwitch-thumb': {
                    width: '26px',
                    height: '26px',
                    marginTop: '-8px',
                    transform: 'translateX(-7px)'
                  },
                }}
                onChange={() => { changeRole() }} />}
            label={<Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>기업회원</Typography>}
            labelPlacement='start'
          />
        </FormGroup>
      </Grid>

      <Formik
        initialValues={{
          user_birth: dayjs('1999-12-31').locale('ko').format('YYYY-MM-DD'),
          user_nm: '',
          user_email: email ? email : '',
          user_pw: '',
          passwordRepeat: '',
          user_id: email ? email.split('@')[0] : '',
          user_phone: '',
          department: isRole ? initialDepartment : null,
          submit: null
        }}
        validationSchema={Yup.object().shape({
          user_nm: Yup.string().max(255).required('이름 입력은 필수입니다.'),
          user_email: Yup.string().email('이메일 형식이 올바르지 않습니다.').max(255).required('이메일 아이디 입력은 필수입니다.'),
          user_pw: Yup.string().min(4, '비밀번호는 4자리 이상 입력해주세요.').max(255).required('비밀번호 입력은 필수입니다.'),
          passwordRepeat: Yup.string().max(255).oneOf([Yup.ref('user_pw'), null], '비밀번호가 일치하지 않습니다.').required('비밀번호 확인은 필수입니다.'),
          user_id: Yup.string().max(40).required('ID 입력은 필수입니다.'),
          user_phone: Yup.string().matches(/^\d{3}-\d{3,4}-\d{4}$/, '유효한 전화번호 형식이 아닙니다. ( - )을 포합한 형식').required('휴대폰번호 입력은 필수입니다.'),
          department: isRole
            ? Yup.object().shape({
              dept_name: Yup.string().required('부서 입력은 필수입니다.')
            })
            : Yup.object().nullable(),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              console.log(values);
              if (!isRole) {
                values.department = null;
              }
              setStatus({ success: true });
              setSubmitting(false);
              console.log(values);
              principal.register(values).then((res) => {
                console.log(res);
                const noti = {
                  "userIds": ["admin"],
                  "message": "권한승인 대기 계정이 있습니다.",
                  "url": "/manage/admin"
                }
                principal.createNoti(noti).then((res) => {
                  navigate('/main');
                });
              }).catch((err) => {
                console.log(err);
                //중복체크에 관한 내용추가
              })
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
              console.log(values);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {isRole && (
              <>
                <FormControl fullWidth error={Boolean(touched.department && errors.department)} sx={{ ...theme.typography.customInput }}>
                  <InputLabel htmlFor="outlined-adornment-department">부서</InputLabel>
                  <Select
                    size='Large'
                    id="outlined-adornment-department"
                    value={isRole && values.department && values.department.dept_name && (values.department.dept_name || '')}
                    name="department.dept_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="부서"
                    sx={{
                      '& > div': {
                        padding: '30.5px 14px 11.5px !important'
                      },
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* {touched.department && errors.department && (
                    <FormHelperText error id="standard-weight-helper-text-department">
                      {errors.department}
                    </FormHelperText>
                  )} */}
                </FormControl>
              </>
            )}

            <FormControl fullWidth error={Boolean(touched.user_nm && errors.user_nm)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-user_nm-register">이름</InputLabel>
              <OutlinedInput
                id="outlined-adornment-user_nm-register"
                type="text"
                value={values.user_nm}
                name="user_nm"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.user_nm && errors.user_nm && (
                <FormHelperText error id="standard-weight-helper-text-user_nm-register">
                  {errors.user_nm}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={Boolean(touched.user_id && errors.user_id)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-user_id-register">ID</InputLabel>
              <OutlinedInput
                id="outlined-adornment-user_id-register"
                type="text"
                value={values.user_id}
                name="user_id"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.user_id && errors.user_id && (
                <FormHelperText error id="standard-weight-helper-text-user_id-register">
                  {errors.user_id}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={Boolean(touched.user_email && errors.user_email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-user_email-register">이메일</InputLabel>
              <OutlinedInput
                id="outlined-adornment-user_email-register"
                type="email"
                value={values.user_email}
                name="user_email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{ readOnly: email ? true : false }}
              />
              {touched.user_email && errors.user_email && (
                <FormHelperText error id="standard-weight-helper-text-user_email-register">
                  {errors.user_email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.user_pw && errors.user_pw)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-user_pw-register">비밀번호</InputLabel>
              <OutlinedInput
                id="outlined-adornment-user_pw-register"
                type={showPassword ? 'text' : 'password'}
                value={values.user_pw}
                name="user_pw"
                label="password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.user_pw && errors.user_pw && (
                <FormHelperText error id="standard-weight-helper-text-user_pw-register">
                  {errors.user_pw}
                </FormHelperText>
              )}
            </FormControl>
            {strength !== 0 ? (
              <FormControl fullWidth>
                <Box>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            ) : <></>}

            <FormControl fullWidth error={Boolean(touched.passwordRepeat && errors.passwordRepeat)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-repeat-register">비밀번호 확인</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-repeat-register"
                type={showPassword ? 'text' : 'password'}
                value={values.passwordRepeat}
                name="passwordRepeat"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
              />
              {touched.passwordRepeat && errors.passwordRepeat && (
                <FormHelperText error id="standard-weight-helper-text-password-repeat-register">
                  {errors.passwordRepeat}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth error={Boolean(touched.user_phone && errors.user_phone)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-user_phone-register">휴대폰 번호</InputLabel>
              <OutlinedInput
                id="outlined-adornment-user_phone-register"
                type="text"
                value={values.user_phone}
                name="user_phone"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.user_phone && errors.user_phone && (
                <FormHelperText error id="standard-weight-helper-text-user_phone-register">
                  {errors.user_phone}
                </FormHelperText>
              )}
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={ko}>
              <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                <DatePicker
                  id="outlined-adornment-user_birth"
                  type="date"
                  label="생년월일"
                  format='YYYY.MM.DD'
                  value={dayjs(values.user_birth).locale('ko')}
                  sx={{
                    // marginTop: 1,
                    // marginBottom: 1,
                    '& > label': {
                      top: 23,
                      left: 0,
                      color: theme.grey500,
                      '&[data-shrink="false"]': {
                        top: 5
                      }
                    },
                    '& > div > input': {
                      padding: '30.5px 14px 11.5px !important'
                    },
                    '& legend': {
                      display: 'none'
                    },
                    '& fieldset': {
                      top: 0
                    }
                  }}
                  name="user_birth"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    console.log(e);
                    handleChange({
                      target: {
                        name: "user_birth",
                        value: e.format('YYYY-MM-DD')
                      }
                    });
                  }}
                  inputProps={{}}

                />
                {/* {touched.user_birth && errors.user_birth && (
                  <FormHelperText error id="standard-weight-helper-text-user_birth-register">
                    {errors.user_birth}
                  </FormHelperText>
                )} */}
              </FormControl>
            </LocalizationProvider>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  <Typography sx={{ fontWeight: 'bold', margin: '5px' }}>
                    회원가입
                  </Typography>
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;
