'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { DotzBaseUrlV1 } from '@/utils/GlobalVariables';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Flex,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  Input,
  Card,
  Tooltip,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/contexts/UserContext';

const { Title, Text } = Typography;

const ProductList = () => {
  const router = useRouter();
  const { organization } = useUser();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const orgId = organization?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('organizationDetails') || '{}')?.id : null);

  const fetchProducts = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${DotzBaseUrlV1}/product/products/${orgId}`);
      if (response.data?.status === 1000 || response.status === 200) {
        const productsList = response.data?.data || [];
        setData(productsList);
        setFilteredData(productsList);
      } else {
        toast.error(response.data?.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products list.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (!value?.trim()) {
      setFilteredData(data);
      return;
    }
    const query = value.toLowerCase().trim();
    const filtered = data.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.product_code?.toLowerCase().includes(query) ||
        item.product_category?.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const deleteProduct = async (productId) => {
    if (!orgId || !productId) return;
    setDeletingId(productId);
    try {
      const response = await axiosInstance.delete(
        `${DotzBaseUrlV1}/product/products/${orgId}/${productId}`
      );
      if (response.data?.status === 1000 || response.status === 200) {
        toast.success(response.data?.message || 'Product deleted successfully!');
        setData((prev) => prev.filter((p) => p.id !== productId));
        setFilteredData((prev) => prev.filter((p) => p.id !== productId));
      } else if (response.data?.status === 1001) {
        toast.error(response.data?.message || 'Cannot delete product');
      } else {
        toast.error('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Network error while deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 140,
      render: (text) => (
        <Tag color="blue" className="font-mono text-xs">
          {text || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-x-2">
          <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs">
            <ShoppingOutlined />
          </div>
          <div>
            <Text strong style={{ color: '#0f172a' }} className="block">
              {text || 'Untitled Product'}
            </Text>
            {record.brand && (
              <Text type="secondary" className="text-xs">
                Brand: {record.brand}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'product_category',
      key: 'product_category',
      render: (category) => (
        <span className="text-slate-600 font-medium">
          {category || 'Uncategorized'}
        </span>
      ),
    },
    {
      title: 'Sales Price',
      dataIndex: 'sales_price',
      key: 'sales_price',
      width: 130,
      render: (price) => (
        <Text strong style={{ color: '#0284c7' }}>
          {price !== undefined && price !== null ? `₹${price}` : '—'}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive !== false ? 'success' : 'default'}>
          {isActive !== false ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit Product">
            <Link href={`/admin/products/edit/${record.id}`}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined style={{ color: '#0284c7' }} />}
              />
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => deleteProduct(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
            icon={<QuestionCircleOutlined style={{ color: '#e5484d' }} />}
          >
            <Tooltip title="Delete Product">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      <Card
        style={{
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle" className="mb-4">
          <div>
            <Title level={3} style={{ color: '#0f172a', margin: 0 }}>
              Products Catalog
            </Title>
            <Text style={{ color: '#64748b' }}>
              Manage and organize your store's inventory ({filteredData.length} total)
            </Text>
          </div>

          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            style={{
              backgroundColor: '#1BA098',
              borderColor: '#1BA098',
              borderRadius: '0.5rem',
            }}
            onClick={() => router.push('/admin/products/create')}
          >
            Add New Product
          </Button>
        </Flex>

        <Divider style={{ borderColor: '#e2e8f0' }} />

        <div className="mb-6">
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            placeholder="Search by product name, code, category, or brand..."
            allowClear
            size="large"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              maxWidth: '32rem',
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              color: '#0f172a',
              borderRadius: '0.5rem',
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id || record.product_code || Math.random().toString()}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
    </div>
  );
};

export default ProductList;