import React, { useState } from 'react';
import CustomContainer from '../components/ContainerComp/CustomContainer';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import LoginButton from '../components/LoginPageComp/LoginButton'; // Adjust the path accordingly
import UsernameInputForm from '../components/LoginPageComp/IDInputForm'; // Adjust the path accordingly
import PasswordInputForm from '../components/LoginPageComp/PasswordInputForm'; // Adjust the path accordingly
import api from '../axios'
import {useRecoilState} from "recoil";
import {isInputState, loginState, usernameState} from "../atom/atom";

import ImageSlider from '../components/StartPageComp/ImageSlider';

import slide1 from '../img/slide1.jpg';
import slide2 from '../img/slide2.jpg';

import {
    useMediaQuery,
    useTheme,
} from "@mui/material";
import RoomMakerButton from "../components/StartPageComp/RoomMakerButton";
import {motion} from "framer-motion";


function Login() {
    const navigate = useNavigate();
    const [userId, setuserId] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(usernameState);
    const [isInput, setIsInput] = useRecoilState(isInputState);
    setIsInput(true);

    const images = [
        slide1,
        slide2,
        // 추가 이미지 경로를 여기에 입력하세요.
      ];

    const fetchUsername = async () => {
            try {
                const response = await api.get('/accounts/userInformation/');
                setUsername(response.data.username);
            } catch (error) {
            }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('accounts/login/', {
                email: userId,
                password: password
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            fetchUsername();
            setLogin(true);
            navigate('/');
        } catch (error) {
            alert('로그인 실패! 아이디 혹은 패스워드를 확인해주세요.');
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await api.post('/auth/complete/google-oauth2/', {
                access_token: response.credential,
                state: response.state  // state 매개변수 포함
            });
            if (res.data.key) {
                navigate('/');
            } else {
            }
        } catch (error) {
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const maxhe_ = isMobile ? '20%': '67%';

    const buttonVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        in: {
            opacity: 1,
            y: 0,
        },
        out: {
            opacity: 0,
            y: -20,
        },
    };

    const buttonTransition =(delay = 0) => ({
        type: 'tween',
        ease: 'anticipate',
        duration: 0.8,
        delay: delay,
    });

    return (
        <CustomContainer>
            <ImageSlider images={images} interval={9000} maxhe={maxhe_} /> {/* 이미지 슬라이더 컴포넌트를 추가합니다. */}
            <div className="buttonWrapper"
                 style={{display: 'flex', justifyContent: 'top', flexDirection: 'column', marginLeft: '10px'}}>
                <div style={{width: '100%', height: '2px', marginBottom: '2.5%'}}></div>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={buttonVariants}
                    transition={buttonTransition(0.2)}
                >
                    <UsernameInputForm username={userId} onUsernameChange={setuserId} placeholder="Email"/>
                </motion.div>

                <div style={{width: '100%', height: '2px', marginBottom: '1.5%'}}></div>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={buttonVariants}
                    transition={buttonTransition(0.4)}
                >
                    <PasswordInputForm password={password} onPasswordChange={setPassword} placeholder="비밀번호"/>
                </motion.div>
                <div style={{width: '100%', height: '2px', marginBottom: '5%'}}></div>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={buttonVariants}
                    transition={buttonTransition(0.6)}
                >
                    <LoginButton onClick={handleLogin}>Login</LoginButton>
                </motion.div>
                    <div style={{width: '100%', height: '2px', marginBottom: '1.5%'}}></div>
                {/*
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={(response) => console.error('Google login failed:', response)}
                    />
                */}
            </div>

        </CustomContainer>
);
}

export default Login;
