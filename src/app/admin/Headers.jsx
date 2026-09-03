import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space, Tag, theme } from 'antd';
import { FileOutlined, UserOutlined, PieChartOutlined, BellOutlined, MessageOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';
const { Header } = Layout;

const Headers = ({collapsed, setCollapsed, collapsedWidth}) => {
  const {logout} = useAuth()
  const { user } = useUser();
  console.log("user00110==>",user);
  // const router = useRouter();
  // const logout = async () => {
  //     // alert('logout');
  //     setUser(null);
  //     setAccessToken(null);
  //     localStorage.removeItem('access');
  //     localStorage.removeItem('refresh');
  //     router.push('/login');
  // };
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const items = [
    {
      label: (
        <a href={`/admin/organization-settings?pk=${organizationDetails?.id}`}>Profile</a>
      ),
      key: '0',
    },
    {
      label: 'Switch Organization',
      key: 'switch',
      disabled: true,
    },
    {
      label: 'Create Organization',
      key: 'create',
      disabled: true,
    },
    {
      label: (
        <a href={`/admin/settings`}>
          Settings
        </a>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (<span className='text-red-600'>Logout</span>),
      key: '3',
      onClick: logout,
      // disabled: false,
    },
  ];
  console.log("collapsed==>",collapsed);
  const organization_name = organizationDetails?.name;
  const edition = organizationDetails ? organizationDetails.edition : 0
  return (
    <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: 0,
            // display: 'flex',
            // background: colorBgContainer,
            background:'#000'
          }}
        >
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                    color: '#fff',
                    marginLeft: ((collapsedWidth === 0 &&  collapsed === false) && '200px'),
                    }}
                />
                {/* <p className='text-white font-bold text-lg truncate  xs:w-35 md:w-50 lg:w-60'>{organization_name}</p> */}
                <Tag  color={edition === 1 ? "blue" : "red"}>{edition === 1 ? 'Lite Edition' :'Trail Edition'}</Tag>
                <p className='text-white font-bold text-lg truncate w-36 sm:w-44 md:w-52 lg:w-60 xl:w-72'>
                    {organization_name}
                </p>

              </div>
            <div className='flex items-center'>
              {/* <div className='mr-5'>
                <Badge count={3}>
                <BellOutlined className='text-white text-lg bg-slate-400 p-2 rounded-full cursor-pointer' />
                </Badge>
              </div>
              <div className='mr-5'>
                <Badge count={1}>
                <MessageOutlined className='text-white text-lg bg-slate-400 p-2 rounded-full cursor-pointer' />
                </Badge>
              </div> */}
            <Dropdown
              menu={{
                items,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <div className='text-white p-0 mr-3 flex justify-between items-center gap-x-2'>
                  <div className='leading-4 text-center'>
                    <span>{userDetails?.username}</span>
                    <span className='text-slate-400 text-sm block'>AD{userDetails?.user}</span>
                  </div>
                  <Avatar size={45}  icon={<UserOutlined />} style={{ backgroundColor: '#fde3cf',}} />
                  <DownOutlined />
                </div>
              </a>
            </Dropdown>
            </div>
            </div>
        </Header>
  )
}

export default Headers