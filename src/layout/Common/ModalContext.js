import { useState } from "react";
import { createContext } from "react"
import { useContext } from "react"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, DialogContentText } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ModalContext = createContext({
    openModal: () => { },
    closeModal: () => { },
});

export const ModalProvider = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const openModal = (email) => {
        setOpen(true);
        setEmail(email);
    }

    const closeModal = () => {
        setOpen(false);
    }

    const submitRegister = () => {
        console.log(email);
        setOpen(false);
        setEmail('');
        navigate('/pages/register/register3', { state: { email: email } });
    }


    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Dialog
                open={open}
                onClose={closeModal}
                aria-labelledby='alert-delete-title'
                aria-describedby='alert-delete-content'
            >
                {/* <DialogTitle id='alert-delete-title'>
                    {'경고'}
                </DialogTitle> */}
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <InfoOutlinedIcon sx={{ color: '#38678f', fontSize: 70 }} />
                        <DialogContentText id='alert-delete-content' sx={{ fontSize: '17px', marginTop: '24px', width: '300px', color: '#000000', fontWeight: 'bold' }}>
                            {'해당 이메일 계정이 존재하지 않습니다.'}<br />
                            {'회원가입 하시겠습니까?'}
                        </DialogContentText>
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={submitRegister} sx={{ color: '#38678f', fontWeight: 'bold', fontSize: '17px' }}>확인</Button>
                    <Button onClick={closeModal} sx={{ color: '#707070', fontWeight: 'bold', fontSize: '17px' }}>취소</Button>
                </DialogActions>

            </Dialog>
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    return useContext(ModalContext)
}