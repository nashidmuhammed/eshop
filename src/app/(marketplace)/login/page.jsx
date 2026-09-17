'use client';
import { useState, useMemo } from 'react';
import './style.css';
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { Modal, Input, Typography } from 'antd';
import {
  FiMail,
  FiLock,
  FiUser,
  FiKey,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';

const INITIAL_STATE = {
  login_username: '',
  password: '',
  email: '',
  username: '',
  password1: '',
  password2: '',
  otp: '',
};

const INITIAL_ERRORS = {
  login_username: null,
  login_password: null,
  email: null,
  username: null,
  password1: null,
  password2: null,
  otp: null,
};

const getPasswordStrength = (password) => {
  if (!password) return { width: '0%', color: 'transparent', label: '' };

  let score = 0;
  if (password.length >= 6) {
    const checks = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
    checks.forEach((regex) => {
      if (regex.test(password)) score += 1;
    });
  } else if (password.length > 0) {
    score = 0;
  }

  const levels = [
    { width: '20%', color: '#e5484d', label: 'Too short' },
    { width: '40%', color: '#DC6551', label: 'Weak' },
    { width: '60%', color: '#F2B84F', label: 'Fair' },
    { width: '80%', color: '#BDE952', label: 'Good' },
    { width: '100%', color: '#3ba62f', label: 'Strong' },
  ];

  return levels[score] || levels[0];
};

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [isVerify, setIsVerify] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [state, setState] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [loading, setLoading] = useState({
    login: false,
    signup: false,
    verify: false,
    validate: false,
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(state.password1),
    [state.password1]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    let isValid = true;
    const newErrors = { ...INITIAL_ERRORS };

    if (!state.login_username?.trim()) {
      newErrors.login_username = 'Please enter your username or email';
      isValid = false;
    }
    if (!state.password) {
      newErrors.login_password = 'Please enter your password';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading((prev) => ({ ...prev, login: true }));
    try {
      await login(state.login_username.trim(), state.password);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    let isValid = true;
    const newErrors = { ...INITIAL_ERRORS };

    const emailRegex = /\S+@\S+\.\S+/;
    if (!state.email?.trim() || !emailRegex.test(state.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!state.username?.trim()) {
      newErrors.username = 'Please enter a valid username';
      isValid = false;
    }

    if (!state.password1 || state.password1.length < 6) {
      newErrors.password1 = 'Password must be at least 6 characters long';
      isValid = false;
    } else if (state.password1 !== state.password2) {
      newErrors.password2 = 'Passwords do not match';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setLoading((prev) => ({ ...prev, signup: true }));
    try {
      const response = await fetch(`${AccountsBaseUrl}/v1/user/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: state.username.trim(),
          email: state.email.trim(),
          password1: state.password1,
          password2: state.password2,
        }),
      });
      const data = await response.json();

      if (data.status_code === 1000) {
        toast.success(data.message || 'Registered successfully! Enter the OTP sent to your email.');
        setIsVerify(true);
      } else if (data.status_code === 1001) {
        toast.error(data.message || 'Registration failed');
      } else {
        toast.error('Unexpected error during registration.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, signup: false }));
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!state.otp?.trim()) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter verification OTP' }));
      return;
    }

    setLoading((prev) => ({ ...prev, verify: true }));
    try {
      const response = await fetch(`${AccountsBaseUrl}/v1/user/verify-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email.trim(),
          otp: state.otp.trim(),
        }),
      });
      const data = await response.json();

      if (data.status_code === 1000) {
        toast.success(data.message || 'Email verified! You can now log in.');
        setState(INITIAL_STATE);
        setIsVerify(false);
        setIsLogin(true);
      } else if (data.status_code === 1001) {
        toast.error(data.message || 'Invalid or expired OTP');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verify error:', error);
      toast.error('Network error during verification.');
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const verifyEmail = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!state.email?.trim() || !emailRegex.test(state.email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading((prev) => ({ ...prev, validate: true }));
    try {
      const response = await fetch(`${AccountsBaseUrl}/v1/user/resend-email/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email.trim() }),
      });
      const data = await response.json();

      if (data.status_code === 1000) {
        toast.success(data.message || 'Verification email sent!');
        setIsValidateModalOpen(false);
        setIsLogin(false);
        setIsVerify(true);
      } else if (data.status_code === 1001) {
        toast.error(data.message || 'Failed to send verification email');
      } else {
        toast.error('Could not complete request.');
      }
    } catch (error) {
      console.error('Resend email error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading((prev) => ({ ...prev, validate: false }));
    }
  };

  const switchMode = (toLogin) => {
    setErrors(INITIAL_ERRORS);
    setIsVerify(false);
    setIsLogin(toLogin);
  };

  return (
    <div className="main">
      <div className="signup-wrapper">
        <h2>{isLogin ? 'Welcome Back' : isVerify ? 'Verify Account' : 'Create Account'}</h2>
        <p>
          {isLogin
            ? 'Sign in to access your dashboard'
            : isVerify
            ? `Enter the OTP sent to ${state.email || 'your email'}`
            : 'Join us today and get started'}
        </p>

        {isLogin ? (
          /* LOGIN FORM */
          <form className="signup-form" onSubmit={handleLogin} noValidate>
            <div className="input-field-wrapper">
              <label htmlFor="login_username">Email or Username</label>
              <div className="input-relative">
                <FiUser className="input-left-icon" />
                <input
                  id="login_username"
                  name="login_username"
                  type="text"
                  placeholder="Enter email or username"
                  className={`custom-input ${errors.login_username ? 'has-error' : ''}`}
                  value={state.login_username}
                  onChange={handleChange}
                  disabled={loading.login}
                  autoComplete="username"
                />
              </div>
              {errors.login_username && (
                <span className="field-error">
                  <FiAlertCircle /> {errors.login_username}
                </span>
              )}
            </div>

            <div className="input-field-wrapper">
              <label htmlFor="password">Password</label>
              <div className="input-relative">
                <FiLock className="input-left-icon" />
                <input
                  id="password"
                  name="password"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`custom-input ${errors.login_password ? 'has-error' : ''}`}
                  value={state.password}
                  onChange={handleChange}
                  disabled={loading.login}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-right-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.login_password && (
                <span className="field-error">
                  <FiAlertCircle /> {errors.login_password}
                </span>
              )}
            </div>

            <button
              type="button"
              className="forgot-password-link"
              onClick={() => { window.location.href = 'https://accounts.dotz.space'; }}
            >
              Forgot your password?
            </button>

            <button type="submit" className="submit-btn" disabled={loading.login}>
              {loading.login ? (
                <>
                  <BiLoaderAlt className="spinner-icon" /> Logging in...
                </>
              ) : (
                <>
                  Log In <FiArrowRight />
                </>
              )}
            </button>

            <div className="form-footer-links">
              <button
                type="button"
                className="toggle-mode-btn"
                onClick={() => switchMode(false)}
              >
                Don't have an account? <span style={{ color: 'var(--primary)' }}>Sign Up</span>
              </button>

              <button
                type="button"
                className="sub-link-btn"
                onClick={() => setIsValidateModalOpen(true)}
              >
                Need to verify an unverified account?
              </button>
            </div>
          </form>
        ) : (
          /* REGISTRATION & VERIFICATION FORM */
          <form
            className="signup-form"
            onSubmit={isVerify ? handleVerify : handleRegister}
            noValidate
          >
            <div className="input-field-wrapper">
              <label htmlFor="email">Email Address</label>
              <div className="input-relative">
                <FiMail className="input-left-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`custom-input ${errors.email ? 'has-error' : ''}`}
                  value={state.email}
                  onChange={handleChange}
                  disabled={isVerify || loading.signup}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="field-error">
                  <FiAlertCircle /> {errors.email}
                </span>
              )}
            </div>

            {!isVerify && (
              <div className="input-field-wrapper">
                <label htmlFor="username">Username</label>
                <div className="input-relative">
                  <FiUser className="input-left-icon" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a unique username"
                    className={`custom-input ${errors.username ? 'has-error' : ''}`}
                    value={state.username}
                    onChange={handleChange}
                    disabled={loading.signup}
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <span className="field-error">
                    <FiAlertCircle /> {errors.username}
                  </span>
                )}
              </div>
            )}

            {isVerify ? (
              <div className="input-field-wrapper">
                <label htmlFor="otp">Verification OTP Code</label>
                <div className="input-relative">
                  <FiKey className="input-left-icon" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP code"
                    className={`custom-input ${errors.otp ? 'has-error' : ''}`}
                    value={state.otp}
                    onChange={handleChange}
                    disabled={loading.verify}
                  />
                </div>
                {errors.otp && (
                  <span className="field-error">
                    <FiAlertCircle /> {errors.otp}
                  </span>
                )}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading.verify}
                >
                  {loading.verify ? (
                    <>
                      <BiLoaderAlt className="spinner-icon" /> Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP <FiCheckCircle />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="input-field-wrapper">
                  <label htmlFor="password1">Password</label>
                  <div className="input-relative">
                    <FiLock className="input-left-icon" />
                    <input
                      id="password1"
                      name="password1"
                      type={showPassword1 ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      className={`custom-input ${errors.password1 ? 'has-error' : ''}`}
                      value={state.password1}
                      onChange={handleChange}
                      disabled={loading.signup}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-right-btn"
                      onClick={() => setShowPassword1(!showPassword1)}
                      aria-label={showPassword1 ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword1 ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password1 && (
                    <span className="field-error">
                      <FiAlertCircle /> {errors.password1}
                    </span>
                  )}

                  {state.password1 && (
                    <div className="strength-wrapper">
                      <div className="strength-header">
                        <span className="strength-title">Password strength:</span>
                        <span
                          className="strength-label"
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="power-container">
                        <div
                          className="power-bar"
                          style={{
                            width: passwordStrength.width,
                            backgroundColor: passwordStrength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="input-field-wrapper">
                  <label htmlFor="password2">Repeat Password</label>
                  <div className="input-relative">
                    <FiLock className="input-left-icon" />
                    <input
                      id="password2"
                      name="password2"
                      type={showPassword2 ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`custom-input ${errors.password2 ? 'has-error' : ''}`}
                      value={state.password2}
                      onChange={handleChange}
                      disabled={loading.signup}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-right-btn"
                      onClick={() => setShowPassword2(!showPassword2)}
                      aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword2 ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password2 && (
                    <span className="field-error">
                      <FiAlertCircle /> {errors.password2}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading.signup}
                >
                  {loading.signup ? (
                    <>
                      <BiLoaderAlt className="spinner-icon" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up <FiArrowRight />
                    </>
                  )}
                </button>
              </>
            )}

            <div className="form-footer-links">
              <button
                type="button"
                className="toggle-mode-btn"
                onClick={() => switchMode(true)}
              >
                Already have an account? <span style={{ color: 'var(--primary)' }}>Log In</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Validate / Resend OTP Modal */}
      <Modal
        title="Verify Account Email"
        centered
        open={isValidateModalOpen}
        onOk={verifyEmail}
        onCancel={() => setIsValidateModalOpen(false)}
        okText={loading.validate ? 'Sending...' : 'Send Verification OTP'}
        confirmLoading={loading.validate}
        className="custom-modal"
        okButtonProps={{
          style: {
            backgroundColor: 'var(--primary)',
            borderColor: 'var(--primary)',
          },
        }}
      >
        <div style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}>
          <Typography.Paragraph style={{ color: '#cbd5e1' }}>
            Enter your registered email address to receive a new OTP verification link.
          </Typography.Paragraph>
          <div className="input-field-wrapper" style={{ marginTop: '0.75rem' }}>
            <div className="input-relative">
              <FiMail className="input-left-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="custom-input"
                value={state.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;