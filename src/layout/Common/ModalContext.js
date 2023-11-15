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

const ModalContext = createContext({
    openModal: () => { },
    closeModal: () => { },
});

export const ModalProvider = ({ children }) => {
    const theme = useTheme()
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
                    <DialogContentText id='alert-delete-content'>
                        {'해당하는 구글 이메일 계정이 존재하지 않습니다.'}<br />
                        {'회원가입 하시겠습니까?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={submitRegister} sx={{ color: theme.palette.primary.main }}>확인</Button>
                    <Button onClick={closeModal} sx={{ color: '#38678f' }}>취소</Button>
                </DialogActions>

            </Dialog>
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    return useContext(ModalContext)
}