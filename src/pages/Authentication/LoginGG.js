// LoginGG.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../../Redux/Auth/auth.action';
import { jwtDecode } from 'jwt-decode';

const LoginGG = () => {
   const dispatch = useDispatch();

   const handleGoogleLoginSuccess = (credentialResponse) => {
      const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
      console.log("Check credentialResponse", credentialResponseDecoded)

      dispatch(loginWithGoogle(credentialResponseDecoded));
   };

   const handleGoogleLoginError = () => {
      console.error('Google login failed');
   };

   return (
      <GoogleLogin
         onSuccess={handleGoogleLoginSuccess}
         onError={handleGoogleLoginError}
      />
   );
};

export default LoginGG;
