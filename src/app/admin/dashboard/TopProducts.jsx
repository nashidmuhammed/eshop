import React from 'react';
import { Avatar, List } from 'antd';
const TopProducts = () => {
    
    const data = [
      {
        title: 'Product Title 1',
      },
      {
        title: 'Product Title 2',
      },
      {
        title: 'Product Title 3',
      },
      {
        title: 'Product Title 4',
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
        header={<div>Top selling products</div>}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href="#">{item.title}</a>}
              description="Product Description"
            />
            <div>Content</div>
          </List.Item>
        )}
      />

    </div>
  );
};
export default TopProducts;