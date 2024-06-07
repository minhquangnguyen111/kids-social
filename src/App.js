// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication/Authentication';
import HomePage from './pages/Homepage/HomePage';
import Message from './pages/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProfileAction } from './Redux/Auth/auth.action';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './theme/DarkTheme';
import Profile from './pages/Profile/Profile';
import Reels from './components/Reels/Reels';
import ContentScanner from './Utils/ContentScanner'; // Đảm bảo rằng bạn đã nhập đúng
import GameState from './components/SnakeGame/GameState';

function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getProfileAction(jwt));
  }, [jwt, dispatch]);

  return (
    <ThemeProvider theme={darkTheme}>
      <header>
        <Routes>
          <Route path='/*' element={auth.user ? <HomePage /> : <Authentication />} />
          <Route path='/message' element={auth.user ? <Message /> : <Authentication />} />
          <Route path='/profile' element={auth.user ? <Profile /> : <Authentication />} />

        </Routes>
      </header>
      <ToastContainer autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
