'use client';
import { Layout, Button, Row, Col, Card, Menu } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;

export default function Home() {
  const base_url = window.location.origin;
  return (
    <Layout>
      {/* Header Section */}
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <div style={{ float: 'left' }}>
          <h2 >eShop</h2>
        </div>
        <Menu theme="light" mode="horizontal" style={{ justifyContent: 'flex-end' }}>
          <Menu.Item key="home">
            <Link href="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="features">
            <Link href="#features">Features</Link>
          </Menu.Item>
          <Menu.Item key="pricing">
            <Link href="#plan">Pricing</Link>
          </Menu.Item>
          <Menu.Item key="contact">
            <Link href="#contact">Contact</Link>
          </Menu.Item>
        </Menu>
      </Header>

      {/* Hero Section */}
      <Content style={{ padding: '50px 50px', textAlign: 'center', background: '#f0f2f5' }}>
        <Row justify="center">
          <Col span={12}>
            <h1 className="text-4xl font-bold mb-4">Launch Your Online Store with eShop</h1>
            <p className='p-3'>The easiest way to create, manage, and grow your eCommerce business.</p>
            <Link href="/admin" passHref>
              <Button type="primary" size="large">
                Get Started
              </Button>
            </Link>
          </Col>
        </Row>
      </Content>

      {/* Features Section */}
      <Content id='features' style={{ padding: '50px', background: '#fff' }}>
        <h2 className="text-2xl text-gray-700 mb-2" style={{ textAlign: 'center' }}>Features that help your business grow</h2>
        <Row gutter={16} justify="center">
          <Col span={6}>
            <Card title="Easy Setup" bordered={false}>
              Create your store with just a few clicks, no coding required.
            </Card>
          </Col>
          <Col span={6}>
            <Card title="User friendly" bordered={false}>
              Beautiful, mobile-friendly templates for your clients.
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Secure Payments" bordered={false}>
              Accept payments securely from all major providers.
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Benefits Section */}
      <Content style={{ padding: '50px 50px', textAlign: 'center', background: '#f0f2f5' }}>
        <h2 className="text-2xl text-gray-700 mb-2">Why Choose eShop?</h2>
        <Row justify="center" gutter={7}>
          <Col span={8} >
            <Card title="Scalable Solutions" bordered={false}>
              Our platform grows with your business. Start small, think big.
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Access anytime" bordered={false}>
              Our dedicated server is available round the clock.
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Pricing Section */}
      {/* <Content id='plan' style={{ padding: '50px', background: '#fff', textAlign: 'center' }}>
        <h2 className="text-2xl text-gray-700 mb-2">Choose Your Plan</h2>
        <Row gutter={16} justify="center">
          <Col span={6}>
            <Card title="Lite" bordered={false}>
              <p style={{ textDecoration: 'line-through', color: 'red' }}>₹199/month</p>
              <p style={{ fontWeight: 'bold', fontSize: '24px' }}>Free</p>
              <p className='p-3'>Perfect for new businesses</p>
              <Link href="/admin" passHref>
                <Button type="primary">Get Started</Button>
              </Link>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Pro" bordered={false}>
              <p style={{ textDecoration: 'line-through', color: 'red' }}>₹399/month</p>
              <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹199/month</p>
              <p className='p-3'>Advanced tools for growing businesses</p>
              <Link href="/admin" passHref>
                <Button type="primary">Get Started</Button>
              </Link>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Enterprise" bordered={false}>
            <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹</p>
              <p>Contact us for pricing</p>
              <p className='p-3'>Custom solutions for large enterprises</p>
              <Button type="primary">Contact Us</Button>
            </Card>
          </Col>
        </Row>
      </Content> */}
      <Content id='plan' style={{ padding: '50px', background: '#fff', textAlign: 'center' }}>
  <h2 className="text-2xl text-gray-700 mb-2">Choose Your Plan</h2>
  <Row gutter={16} justify="center">
    
    {/* Lite Plan */}
    <Col span={6}>
      <Card title="Trail Edition" bordered={false}>
        <p style={{ textDecoration: 'line-through', color: 'red' }}>₹149/month</p>
        <p style={{ fontWeight: 'bold', fontSize: '24px' }}>Free</p>
        <p className='p-3'>Perfect for testing</p>
        <ul className="list-disc text-left ml-6">
          <li>Low uploading limits</li>
          <li>Low Creation limits</li>
          <li>Limited access to the admin portal</li>
          <li>1 User account</li>
        </ul>
        {/* <p className="mt-3">6 months: ₹799 (₹133/month)</p>
        <p>1 year: ₹1499 <span className='text-green-700'>(₹125/month)</span></p> */}
        <Link href="/admin" passHref>
          <Button type="primary" className='m-2 mt-7'>Get Started</Button>
        </Link>
      </Card>
    </Col>
    {/* Lite Plan */}
    <Col span={6}>
      <Card title="Lite Edition" bordered={false}>
        <p style={{ textDecoration: 'line-through', color: 'red' }}>₹249/month</p>
        <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹149/month</p>
        <p className='p-3'>Perfect for new businesses</p>
        <ul className="list-disc text-left ml-6">
          <li>Standard uploading limits</li>
          <li>Standard creation limits</li>
          <li>Email support</li>
          <li>Access to the admin portal</li>
          <li>1 User account</li>
          <li>Custom domain</li>
        </ul>
        <p className="mt-3">6 months: ₹799 (₹133/month)</p>
        <p>1 year: ₹1499 <span className='text-green-700'>(₹125/month)</span></p>
        <Link href="/admin" passHref>
          <Button type="primary" className='m-2 mt-7'>Get Started</Button>
        </Link>
      </Card>
    </Col>

    {/* Pro Plan */}
    <Col span={6}>
      <Card title="Pro Edition" bordered={false}>
        <p style={{ textDecoration: 'line-through', color: 'red' }}>₹499/month</p>
        <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹299/month</p>
        <p className='p-3'>Advanced tools for growing businesses</p>
        <ul className="list-disc text-left ml-6">
          <li>Advanced analytics</li>
          <li>Priority email support</li>
          <li>Up to 5 user accounts</li>
          <li>Custom branding</li>
        </ul>
        <p className="mt-3">6 months: ₹1739 (₹290/month)</p>
        <p>1 year: ₹3399 <span className='text-green-700'>(₹283/month)</span></p>
        <Link href="/admin" passHref>
          <Button type="primary" className='m-2'>Get Started</Button>
        </Link>
      </Card>
    </Col>

    {/* Enterprise Plan */}
    {/* <Col span={6}>
      <Card title="Enterprise" bordered={false}>
        <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹</p>
        <p>Contact us for pricing</p>
        <p className='p-3'>Custom solutions for large enterprises</p>
        <ul className="list-disc text-left ml-6">
          <li>Unlimited users</li>
          <li>Dedicated account manager</li>
          <li>24/7 support</li>
          <li>Custom integrations</li>
        </ul>
        <Button type="primary" className='m-2 mt-[80px]'>Contact Us</Button>
      </Card>
    </Col> */}

  </Row>
</Content>

      {/* Footer Section */}
      <Footer style={{ textAlign: 'center' }}>
        eShop ©2024 Created by NFOUR
      </Footer>
    </Layout>
  );
}