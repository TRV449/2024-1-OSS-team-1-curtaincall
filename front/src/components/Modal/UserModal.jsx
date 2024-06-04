import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { modalState, loginState } from '../../atom/atom';
import IDInputFormMini from "./IDInputFormMini";
import PasswordInputFormMini from "./PasswordInputFormMini";
import ConfirmButtonMini from "./ConfirmButtonMini";
import { Modal, Box, Typography } from '@mui/material';
import api from "../../axios";
import { useNavigate } from "react-router-dom";

function UserModal({ username }) {
    const navigate = useNavigate();
    const [varusername, setvarUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [mode, setMode] = useState('');
    const [islogin, setislogin] = useRecoilState(loginState);

    const checkPasswordMatch = () => {
        return password1 === password2;
    };

    const checkPasswordLength = (password) => {
        return password.length >= 8;
    };

    const ispwnull = (password) => {
        return password === '';
    }

    const isnicknull = (username) => {
        return username === '';
    }

    const hasSpecialCharacter = (password) => {
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return specialCharRegex.test(password);
    };

    const handleOpenNicknameChange = () => {
        setMode('nickname');
    };

    const handleOpenPasswordChange = () => {
        setMode('password');
    };

    const handleChangePassword = async () => {
        console.log('Attempting to Change PW with:', { password1, password2 });
        try {
            const response = await api.post('accounts/dj-rest-auth/password/change/', {
                new_password1: password1,
                new_password2: password2
            });
            if(response.status === 200) {
                alert('비밀번호가 변경되었습니다. 로그아웃합니다.');
                await api.post('accounts/dj-rest-auth/logout/');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsOpen(false);
                setislogin(false);
                navigate('/login');
            }
        } catch (error) {
            console.error('Change failed:', error.response.data);
        }
    }

    const handleNicknameChange = async () => {
        console.log('Attempting to Change Nickname with:', { varusername });
        try {
            const response = await api.patch('accounts/dj-rest-auth/user/', {
                user_nickname: varusername  // 닉네임 변경 대상 필드 수정
            });
            if (response.status === 200) {
                console.log('Nickname changed:', response.data);
                alert('닉네임이 변경되었습니다. 로그아웃합니다.');
                await api.post('accounts/dj-rest-auth/logout/');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsOpen(false);
                setislogin(false);
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                console.error('Change failed:', error.response.data);
            } else {
                console.error('Change failed:', error.message);
            }
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={() => {
                setIsOpen(false);
                setMode('');
            }}
            aria-labelledby="user-modal-title"
            aria-describedby="user-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                minWidth: 300,
                maxWidth: '90vw',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                height: '70%',
                justifyContent: 'space-between',
            }}>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography id="user-modal-title" variant="h6" component="h2">
                        사용자 정보
                    </Typography>
                    <Typography id="user-modal-description">
                        {username}님, 환영합니다.
                    </Typography>
                </Box>
                <Box sx={{ p: 4, flex: '1 1 auto', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    {mode === 'nickname' && (
                        <>
                            <IDInputFormMini username={varusername} onUsernameChange={setvarUsername} placeholder="새 닉네임"/>
                            <Box sx={{ position: 'relative', bottom: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ConfirmButtonMini onClick={handleNicknameChange} disabled={isnicknull(varusername)}>닉네임 수정</ConfirmButtonMini>
                            </Box>
                        </>
                    )}
                    {mode === 'password' && (
                        <>
                            <PasswordInputFormMini password={password1} onPasswordChange={setPassword1} placeholder="새 비밀번호"/>
                            {!ispwnull(password1) && !checkPasswordLength(password1) && <Typography color="error">비밀번호는 최소 8글자 이상이어야 합니다!</Typography>}
                            {!ispwnull(password1) && checkPasswordLength(password1) && !hasSpecialCharacter(password1) && <Typography color="error">비밀번호는 특수문자를 포함해야 합니다!</Typography>}
                            <PasswordInputFormMini password={password2} onPasswordChange={setPassword2} placeholder="비밀번호 확인"/>
                            {!checkPasswordMatch() && <Typography color="error">비밀번호가 다릅니다!</Typography>}
                            <Box sx={{ position: 'relative', bottom: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ConfirmButtonMini onClick={handleChangePassword} disabled={!checkPasswordMatch() || !checkPasswordLength(password1)}>비밀번호 수정</ConfirmButtonMini>
                            </Box>
                        </>
                    )}
                </Box>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #000' }}>
                    <ConfirmButtonMini onClick={handleOpenNicknameChange}>닉네임 변경</ConfirmButtonMini>
                    <ConfirmButtonMini onClick={handleOpenPasswordChange}>비밀번호 변경</ConfirmButtonMini>
                </Box>
            </Box>
        </Modal>
    );
}

export default UserModal;