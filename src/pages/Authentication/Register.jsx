import React, { useState, useEffect } from 'react';
import { Button, FormControlLabel, Radio, RadioGroup, TextField, IconButton, InputAdornment } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { registerUserAction } from '../../Redux/Auth/auth.action';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import './Authentication.css';
import ReCAPTCHA from 'react-google-recaptcha';


const Register = () => {
    const [gender, setGender] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [capVal, setCapVal] = useState(null);
    const onChange = () => {

    }
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .matches(/^[a-zA-Z\sáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]*$/, "First Name must contain only letters.")
            .required("First Name is required."),
        lastName: Yup.string()
            .matches(/^[a-zA-Z\sáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]*$/, "Last Name must contain only letters.")
            .required("Last Name is required."),
        email: Yup.string()
            .email("Invalid email.")
            .min(6, "Email must be at least 6 characters.")
            .max(30, "Email must not exceed 30 characters.")
            .required("Email is required."),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters.")
            .max(15, "Password must not exceed 15 characters.")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
            .matches(/[0-9]/, "Password must contain at least one number.")
            .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character.")
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleSubmit = async (values) => {
        dispatch(registerUserAction({ data: values })).then((response) => {
            if (localStorage.getItem("jwt")) {
                navigate("/");
            }
        });
    };

    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (formValues.password && formValues.confirmPassword && formValues.password === formValues.confirmPassword) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [formValues.password, formValues.confirmPassword]);

    const handleChange = (event) => {
        setFormValues({ ...formValues, [event.target.name]: event.target.value });
        setGender(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };
    useEffect(() => {
        const isMatch = formValues.password && formValues.confirmPassword && formValues.password === formValues.confirmPassword;
        setPasswordsMatch(isMatch);
    }, [formValues.password, formValues.confirmPassword]);



    return (
        <>
            <Formik
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", gender: "" }}
            >
                {({ values }) => (
                    <Form className="space-y-0">
                        <div className="space-y-1">
                            <div>
                                <Field
                                    as={TextField}
                                    name="firstName"
                                    placeholder="First Name"
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                />
                                <ErrorMessage name="firstName" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <Field
                                    as={TextField}
                                    name="lastName"
                                    placeholder="Last Name"
                                    type="text"
                                    variant="outlined"
                                    fullWidth
                                />
                                <ErrorMessage name="lastName" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <Field
                                    as={TextField}
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <Field
                                    as={TextField}
                                    name="password"
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowPassword}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <Field
                                    as={TextField}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowConfirmPassword}>
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {formValues.confirmPassword && formValues.password && (
                                    <div style={{ display: 'flex', alignItems: 'center', color: passwordsMatch ? 'green' : 'red' }}>
                                        {passwordsMatch ? (
                                            <DoneIcon style={{ marginRight: '8px' }} />
                                        ) : (
                                            <DoneIcon style={{ marginRight: '8px', color: 'red' }} />
                                        )}
                                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </div>
                                )}
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    name="gender"
                                    onChange={handleChange}
                                    value={gender}
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <ErrorMessage name="gender" component="div" className="text-red-500" />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className='mb-2 mt-2 '>
                            <ReCAPTCHA
                                sitekey="6LfCmOkpAAAAANwsdy7rpj0-VNAq_ZgAEd_M3E0D"
                                onChange={(val) => setCapVal(val)}
                            />
                        </div>
                        <button
                            sx={{ padding: ".8rem 0rem" }}
                            fullWidth
                            type="submit"
                            variant='contained'
                            color='primary'
                            className='btn'
                            disabled={!capVal}
                        >
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
            <div className='flex gap-2 items-center justify-center pt-3'>
                <p>If you have already an account?</p>
                <Button onClick={() => navigate("/")} className=''>Login</Button>
            </div>
        </>
    );
};

export default Register;
