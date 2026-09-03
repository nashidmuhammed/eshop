import React from 'react';
import { Avatar, List } from 'antd';
const TopCustomers = () => {
    
    const data = [
      {
        title: 'Customer Name 1',
      },
      {
        title: 'Customer Name 2',
      },
      {
        title: 'Customer Name 3',
      },
      {
        title: 'Customer Name 4',
      },
    ];
  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
        <List
        itemLayout="horizontal"
        header={<div>Top customers</div>}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Customer status"
            />
            <div>Content</div>
          </List.Item>
        )}
      />

    </div>
  );
};
export default TopCustomers;