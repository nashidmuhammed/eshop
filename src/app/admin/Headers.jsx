'use client';

import { Avatar, Button, Dropdown, Layout, Tag } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';

const { Header } = Layout;

const Headers = ({ collapsed, setCollapsed, collapsedWidth }) => {
  const { logout } = useAuth();
  const { user, organization } = useUser();

  const organizationName = organization?.name || user?.last_organization || 'Organization';
  const edition = organization?.edition ?? user?.edition ?? 0;
  const username = user?.username || 'User';
  const userCode = user?.user || user?.id;

  const items = [
    {
      label: (
        <Link href={`/admin/organization-settings${organization?.id ? `?pk=${organization.id}` : ''}`}>
          Profile
        </Link>
      ),
      key: 'profile',
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
        <Link href="/admin/settings">
          Settings
        </Link>
      ),
      key: 'settings',
    },
    {
      type: 'divider',
    },
    {
      label: <span className="text-red-500 font-medium">Logout</span>,
      key: 'logout',
      onClick: logout,
    },
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: 0,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="flex justify-between items-center px-4 h-full">
        <div className="flex items-center gap-x-3">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 48,
              height: 48,
              color: '#0f172a',
              marginLeft: collapsedWidth === 0 && !collapsed ? '200px' : 0,
            }}
          />
          <Tag color={edition === 1 ? 'blue' : 'gold'}>
            {edition === 1 ? 'Lite Edition' : 'Trial Edition'}
          </Tag>
          <p className="text-slate-900 font-bold text-lg truncate w-36 sm:w-44 md:w-52 lg:w-60 xl:w-72 m-0">
            {organizationName}
          </p>
        </div>

        <div className="flex items-center">
          <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
            <button
              type="button"
              className="text-slate-900 cursor-pointer bg-transparent border-0 flex items-center gap-x-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="leading-tight text-right hidden sm:block">
                <span className="block font-medium text-sm text-slate-900">{username}</span>
                {userCode && (
                  <span className="text-slate-500 text-xs block">AD{userCode}</span>
                )}
              </div>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1BA098', color: '#fff' }}
              />
              <DownOutlined className="text-xs text-slate-400" />
            </button>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Headers;