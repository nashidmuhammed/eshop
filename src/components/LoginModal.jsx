
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import '../styles/AuthModal.css'; // For custom CSS styles

const { Title, Text } = Typography;

const AuthModal = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('login'); // 'login', 'signup', 'forgot'

  const handleLogin = (values) => {
    setLoading(true);
    console.log('Login values:', values);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleSignup = (values) => {
    setLoading(true);
    console.log('Signup values:', values);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleForgotPassword = (values) => {
    setLoading(true);
    console.log('Forgot Password values:', values);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="auth-modal"
    >
      <div className="modal-background">
        <div className="auth-container">
          {/* Dynamic Title Based on Form Type */}
          <Title level={3} style={{ textAlign: 'center', color: '#fff' }}>
            {formType === 'login' && 'Login'}
            {formType === 'signup' && 'Sign Up'}
            {formType === 'forgot' && 'Forgot Password'}
          </Title>

          <Text style={{ textAlign: 'center', display: 'block', color: '#fff', marginBottom: '20px' }}>
            {formType === 'login' && 'Login to your account!'}
            {formType === 'signup' && 'Create a new account!'}
            {formType === 'forgot' && 'Reset your password!'}
          </Text>

          {/* Login Form */}
          {formType === 'login' && (
            <Form name="login" onFinish={handleLogin} layout="vertical" className="login-form">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter email / username" className="input-box" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" className="input-box" />
              </Form.Item>

              <Text type="secondary" className="forgot-password">
                <a onClick={() => setFormType('forgot')}>Did you forget your password?</a>
              </Text>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                  Log In
                </Button>
              </Form.Item>

              <div className="auth-links">
                <a onClick={() => setFormType('signup')}>Create Account</a>
                {/* <a>Validate Account</a> */}
              </div>
            </Form>
          )}

          {/* Signup Form */}
          {formType === 'signup' && (
            <Form name="signup" onFinish={handleSignup} layout="vertical" className="signup-form">
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" className="input-box" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" className="input-box" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" className="input-box" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                  Sign Up
                </Button>
              </Form.Item>

              <div className="auth-links">
                <a onClick={() => setFormType('login')}>Already have an account? Log In</a>
              </div>
            </Form>
          )}

          {/* Forgot Password Form */}
          {formType === 'forgot' && (
            <Form name="forgot-password" onFinish={handleForgotPassword} layout="vertical" className="forgot-form">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" className="input-box" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} className="login-btn">
                  Reset Password
                </Button>
              </Form.Item>

              <div className="auth-links">
                <a onClick={() => setFormType('login')}>Back to Log In</a>
              </div>
            </Form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;