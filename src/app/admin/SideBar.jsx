import useBreakpoint from '@/components/useBreakPoints';
import { ProductOutlined, CrownOutlined, SettingOutlined, BarChartOutlined, LineChartOutlined, AppstoreAddOutlined, UserOutlined, PieChartOutlined, DesktopOutlined, TeamOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;

const SideBar = ({collapsed, setCollapsed, collapsedWidth}) => {
    const pathname = usePathname()
    const [selectedKey, setSelectedKey] = useState([''])
    const router = useRouter()
    // const screenSize = useBreakpoint();
    // const collapsedWidth = screenSize < 992 ? 0 : 80;
    function getItem(label, key, icon, children) {
        return {
          key,
          icon,
          children,
          label,
        };
      }
    // const items = [
    //     getItem('Dashboard', '1', <PieChartOutlined />),
    //     getItem('Customers', '2', <DesktopOutlined />),
    //     getItem('Produts', 'sub2', <TeamOutlined />),
    //     getItem('Accouts', 'sub1', <UserOutlined />, [
    //       getItem('Sales', '3'),
    //       getItem('Purchase', '4'),
    //       getItem('Expense', '5'),
    //     ]),
    //     getItem('Settings', '9', <FileOutlined />),
    //   ];
    // const menuItems = [
    //     {icon:<PieChartOutlined />, label:<Link href='/admin'> Dashboard <CrownOutlined className='premium' /></Link>, key:1},
    //     {icon:<LineChartOutlined />, label:<Link href='/admin/sales'> Sales <CrownOutlined className='premium' /></Link>, key:'sales'},
    //     {icon:<BarChartOutlined />, label:<Link href='/admin/purchase'> Purchase <CrownOutlined className='premium' /></Link>, key:'purchase'},
    //     {icon:<TeamOutlined />, label:<Link href='/admin/customers'> Customers <CrownOutlined className='premium' /></Link>, key:'customers'},
    //     {icon:<ProductOutlined />, label:<Link href='/admin/products'> Products</Link>, key:'products'},
    //     {icon:<DesktopOutlined />, label:<Link href='/admin/posters'> Posters</Link>, key:'posters'},
    //     {icon:<AppstoreAddOutlined />, label:<Link href='/admin/more'> More</Link>, key:'more'},
    //     {icon:<SettingOutlined />, label:<Link href='/admin/settings'> Settings</Link>, key:'settings'},
    // ]
    const menuItems = [
      { icon: <PieChartOutlined />, label: 'Dashboard', premium: true, path: '/admin/dashboard', key: '1' },
      { icon: <LineChartOutlined />, label: 'Sales', premium: true, path: '/admin/sales', key: 'sales' },
      { icon: <BarChartOutlined />, label: 'Purchase', premium: true, path: '/admin/purchase', key: 'purchase' },
      { icon: <TeamOutlined />, label: 'Customers', premium: true, path: '/admin/customers', key: 'customers' },
      { icon: <ProductOutlined />, label: 'Products', premium: false, path: '/admin/products', key: 'products' },
      { icon: <DesktopOutlined />, label: 'Posters', premium: false, path: '/admin/posters', key: 'posters' },
      { icon: <AppstoreAddOutlined />, label: 'More', premium: false, path: '/admin/more', key: 'more' },
      { icon: <AppstoreAddOutlined />, label: 'Billing', premium: false, path: '/admin/billing', key: 'billing' },
      { icon: <SettingOutlined />, label: 'Settings', premium: false, path: '/admin/settings', key: 'settings' },
    ];

    const handleClick = (e) => {
      const { key } = e;
      const selectedMenuItem = menuItems.find(item => item.key === key);
      
      if (selectedMenuItem) {
        setSelectedKey([key]);
        setCollapsed(true);
        router.push(selectedMenuItem.path);
      }
    };
  

    useEffect(() => {
      if (pathname.startsWith("/admin/dashboard")){
        setSelectedKey(['1'])
      }else if  (pathname.startsWith("/admin/sales")){
        setSelectedKey(['sales'])
      }else if  (pathname.startsWith("/admin/purchase")){
        setSelectedKey(['purchase'])
      }else if  (pathname.startsWith("/admin/customers")){
        setSelectedKey(['customers'])
      }else if  (pathname.startsWith("/admin/products")){
        setSelectedKey(['products'])
      }else if  (pathname.startsWith("/admin/posters")){
        setSelectedKey(['posters'])
      }else if  (pathname.startsWith("/admin/more")){
        setSelectedKey(['more'])
      }else if  (pathname.startsWith("/admin/settings")){
        setSelectedKey(['settings'])
      }else if  (pathname.startsWith("/admin/billing")){
        setSelectedKey(['billing'])
      }else if  (pathname.startsWith("/admin")){
        setSelectedKey(['1'])
      }
    }, [pathname])
    
  return (
    <Sider
        collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={collapsedWidth}
        trigger={null}
        // className="fixed-sider"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          left: 0,
          // bottom: 0,
          scrollbarWidth: 'thin',
          scrollbarColor: 'unset',
          zIndex: 1000,
        }}
        // collapsible
        // // collapsed={true}
        // onBreakpoint={(broken) => {
        //   console.log(broken);
        // }}
        // onCollapse={(collapsed, type) => {
        //   console.log(collapsed, type);
        // }}
    >
        <div className="container text-slate-300 p-5 text-3xl text-center" >{collapsed ? 'eS' : 'eShop' }</div>
        <div className="container text-slate-500 p-3 pl-5" >Menu</div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={selectedKey} 
          // items={menuItems} 
          // onClick={() => handleClick(item.path)}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: (
              <>
                <a>{item.label}</a>
                {item.premium &&
                  <CrownOutlined className='premium pl-1' />
                }
              </>
            ),
          }))}
          onClick={handleClick}
          />
    </Sider>
  )
}

export default SideBar