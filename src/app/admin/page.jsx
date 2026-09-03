'use client';
import useBreakpoint from '@/components/useBreakPoints';
import { FileOutlined, UserOutlined, PieChartOutlined, DesktopOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Headers from './Headers';
import Footer from '@/components/Footer';
import DashBoard from './DashBoard';
import WelcomePage from './WelcomePage';
import axiosInstance from '@/utils/axiosInstance';
import Header from './Header';
import { DotzBaseUrl } from '@/utils/GlobalVariables';
import Loader from '@/components/Loader';
import AdminPage from './AdminPage';
const { Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  // Check user status
    // User Organizations list
    // Details of latest organization
    // Dashboard datas
  // New user

  
  
  return (
    <>
    {/* {!newUser? */}
    <div>
      <Header />
      {/* <Loader coming /> */}
      {/* <DashBoard /> */}
      <AdminPage />
    </div>
    {/* :
    <WelcomePage />} */}
    </>
  );
};
export default App;