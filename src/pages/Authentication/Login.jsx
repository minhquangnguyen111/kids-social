import React, { useState } from 'react';
import { Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from "yup";
import { loginUserAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Authentication.css';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const sitekey = "6LczlukpAAAAAChXzK3dFrqxbRcR1ntY5mudikAT"
    const [capVal, setCapVal] = useState(null);
    const onChange = () => {

    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email.")
            .min(6, "Email must be at least 6 characters.")
            .max(30, "Email must not exceed 30 characters.")
            .required("Email is required."),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters.")
            .max(50, "Password must not exceed 50 characters.")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
            .matches(/[0-9]/, "Password must contain at least one number.")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character.")
            .required("Password is required.")
    });

    const handleSubmit = async (values) => {
        const success = await dispatch(loginUserAction({ data: values }));
        console.log("check values", values)
        if (success) {
            navigate("/");
        }
    };

    return (
        <>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-7">
                        <div className="space-y-5">
                            <div>

                                <Field as={TextField} name="email" placeholder="Email " type="email" variant="outlined" fullWidth />
                                <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <Field
                                    as={TextField}
                                    name="password"
                                    placeholder="Password "
                                    autoComplete="password"
                                    type={showPassword ? 'text' : 'password'} // Show plain text if showPassword is true
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{ // Add an InputAdornment with IconButton to toggle password visibility
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500" />
                            </div>
                        </div>

                        <ReCAPTCHA
                            sitekey="6LfCmOkpAAAAANwsdy7rpj0-VNAq_ZgAEd_M3E0D"
                            onChange={(val) => setCapVal(val)}
                        />

                        <button
                            sx={{ padding: ".8rem 0rem" }}
                            fullWidth
                            type="submit"
                            variant='contained'
                            color='primary'
                            // disabled={isSubmitting}
                            className='btn '
                            disabled={!capVal}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                        {/* <LoginGG /> */}
                    </Form>
                )}
            </Formik>
            <div className='flex gap-2 items-center justify-center pt-5'>
                <p>If you don't have account?</p>
                <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
        </>
    );
};

export default Login;
