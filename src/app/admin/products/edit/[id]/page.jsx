'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Switch,
  Tag,
  Typography,
  Upload,
  Badge,
  Flex,
  Tabs,
  Table,
  Drawer,
  Tooltip,
  Popconfirm,
  Avatar,
  Image,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  ReloadOutlined,
  EyeOutlined,
  PictureOutlined,
  CheckOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { baseUrl, DotzBaseUrlV1, API_ENDPOINTS } from '@/utils/GlobalVariables';
import axiosInstance from '@/utils/axiosInstance';
import { useUser } from '@/contexts/UserContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const COLOR_NAME_MAP = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  black: '#000000',
  white: '#FFFFFF',
  purple: '#A855F7',
  pink: '#EC4899',
  orange: '#F97316',
  gray: '#6B7280',
  grey: '#6B7280',
  navy: '#1E3A8A',
  teal: '#14B8A6',
  cyan: '#06B6D4',
  brown: '#78350F',
  gold: '#D97706',
  silver: '#C0C0C0',
  maroon: '#800000',
  olive: '#808000',
  lime: '#84CC16',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  beige: '#F5F5DC',
};

const detectColorHex = (valName) => {
  if (!valName) return '#1890ff';
  const lower = valName.trim().toLowerCase();
  return COLOR_NAME_MAP[lower] || '#1890ff';
};

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const { organization } = useUser();
  const orgId = organization?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('organizationDetails') || '{}')?.id : null);

  const [form] = Form.useForm();
  const [drawerForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [brandForm] = Form.useForm();
  const [newVariantForm] = Form.useForm();
  const [newAttrForm] = Form.useForm();
  const [editAttrForm] = Form.useForm();
  const [editValForm] = Form.useForm();

  const [editingAttr, setEditingAttr] = useState(null);
  const [editAttrModalOpen, setEditAttrModalOpen] = useState(false);
  const [editingVal, setEditingVal] = useState(null);
  const [editValModalOpen, setEditValModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Master Data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxes, setTaxes] = useState([]);

  // Product Composite Data
  const [productData, setProductData] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [baseFileList, setBaseFileList] = useState([]);

  // Modals / Drawer States
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [newAttrModalOpen, setNewAttrModalOpen] = useState(false);
  const [newVariantModalOpen, setNewVariantModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [variantFileList, setVariantFileList] = useState([]);
  const [inlineEditedVariants, setInlineEditedVariants] = useState({});
  const [savingVariantId, setSavingVariantId] = useState(null);

  // New Attribute Value Inline Adding
  const [newValInput, setNewValInput] = useState({});
  const [newValColor, setNewValColor] = useState({});

  // 1. Fetch Master metadata & Composite Product Details
  const fetchProductCompositeDetails = useCallback(async (showToast = false) => {
    if (!orgId || !productId) return;
    if (showToast) setRefreshing(true);
    else setLoading(true);

    try {
      const [resMasters, resDetails] = await Promise.all([
        Promise.all([
          axiosInstance.get(API_ENDPOINTS.categories(orgId)),
          axiosInstance.get(API_ENDPOINTS.brands(orgId)),
          axiosInstance.get(API_ENDPOINTS.units(orgId)),
          axiosInstance.get(API_ENDPOINTS.taxes(orgId)),
        ]),
        axiosInstance.post(API_ENDPOINTS.productDetails(), {
          organization_id: orgId,
          product_id: productId,
        }),
      ]);

      // Handle Master Tables
      const [resCat, resBrand, resUnit, resTax] = resMasters;
      if (resCat.data?.status_code === 1000) setCategories(resCat.data.data || []);
      if (resBrand.data?.status_code === 1000) setBrands(resBrand.data.data || []);
      if (resUnit.data?.status_code === 1000) setUnits(resUnit.data.data || []);
      if (resTax.data?.status_code === 1000) setTaxes(resTax.data.data || []);

      // Handle Composite Details
      if (resDetails.data?.status === 1000 || resDetails.data?.status_code === 1000) {
        const { product, attributes: attrs, variants: vars } = resDetails.data.data || {};

        setProductData(product || null);
        setAttributes(attrs || []);
        setVariants(vars || []);

        if (product) {
          form.setFieldsValue({
            name: product.name,
            product_code: product.product_code,
            product_category: product.product_category,
            brand: product.brand,
            unit: product.unit,
            tax: product.tax,
            hsn_code: product.hsn_code,
            bar_code: product.bar_code,
            purchase_price: product.price_list?.purchase_price ?? product.purchase_price,
            sale_price: product.price_list?.sales_price ?? product.sales_price,
            mrp: product.price_list?.mrp ?? product.mrp,
            original_price: product.price_list?.original_price ?? product.original_price,
            description: product.description,
            is_active: product.is_active !== false,
          });

          if (product.images && Array.isArray(product.images)) {
            setBaseFileList(
              product.images.map((img) => ({
                uid: img.id || Math.random().toString(),
                name: 'product_image',
                status: 'done',
                url: img.url ? (img.url.startsWith('http') ? img.url : baseUrl + img.url) : '',
              }))
            );
          }
        }

        if (showToast) {
          toast.success('Product details refreshed!');
        }
      } else {
        toast.error(resDetails.data?.message || 'Failed to load product details');
      }
    } catch (err) {
      console.error('Error fetching composite product details:', err);
      toast.error('Failed to load product information.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orgId, productId, form]);

  useEffect(() => {
    fetchProductCompositeDetails();
  }, [fetchProductCompositeDetails]);

  // Master Modals Handlers
  const handleCreateCategory = async (values) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.categories(orgId), { ...values, organization: orgId });
      if (res.data?.status_code === 1000) {
        toast.success('Category created!');
        setCategoryModalOpen(false);
        const newCat = { id: res.data.data, name: values.category_name };
        setCategories((prev) => [...prev, newCat]);
        form.setFieldsValue({ product_category: newCat.id });
        categoryForm.resetFields();
      } else {
        toast.error(res.data?.message || 'Failed to create category');
      }
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleCreateBrand = async (values) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.brands(orgId), { ...values, organization: orgId });
      if (res.data?.status_code === 1000) {
        toast.success('Brand created!');
        setBrandModalOpen(false);
        const newBrand = { id: res.data.data, name: values.brand_name };
        setBrands((prev) => [...prev, newBrand]);
        form.setFieldsValue({ brand: newBrand.id });
        brandForm.resetFields();
      } else {
        toast.error(res.data?.message || 'Failed to create brand');
      }
    } catch (err) {
      toast.error('Failed to create brand');
    }
  };

  // Save Base Product Details (Tab 1)
  const handleSaveBaseProduct = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('pk', productId);
      formData.append('name', values.name?.trim());
      formData.append('product_code', values.product_code?.trim());
      formData.append('product_category', values.product_category || '');
      formData.append('brand', values.brand || '');
      formData.append('hsn_code', values.hsn_code || '');
      formData.append('bar_code', values.bar_code || '');
      formData.append('unit', values.unit || '');
      formData.append('tax', values.tax || '');
      formData.append('purchase_price', values.purchase_price ?? 0);
      formData.append('sale_price', values.sale_price ?? 0);
      formData.append('mrp', values.mrp ?? 0);
      formData.append('original_price', values.original_price ?? 0);
      formData.append('description', values.description || '');
      formData.append('is_active', values.is_active !== false);
      formData.append('organization', orgId);

      baseFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('image', file.originFileObj);
        }
      });

      const res = await axiosInstance.put(`${DotzBaseUrlV1}/product/products/`, formData);

      if (res.data?.status_code === 1000 || res.status === 200 || res.data?.status === 1000) {
        toast.success('Base product details updated successfully!');
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Base product update error:', err);
      toast.error('Please verify the product form inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create New Attribute
  const handleCreateAttribute = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(API_ENDPOINTS.attributeCreate(), {
        organization_id: orgId,
        name: values.name.trim(),
        display_type: values.display_type || 'button',
      });

      if (res.data?.status === 1000 || res.data?.status_code === 1000 || res.status === 201) {
        toast.success(`Attribute "${values.name}" created!`);
        setNewAttrModalOpen(false);
        newAttrForm.resetFields();
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to create attribute');
      }
    } catch (err) {
      console.error('Attribute creation error:', err);
      toast.error('Error creating attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Attribute
  const handleUpdateAttributeSubmit = async (values) => {
    if (!editingAttr) return;
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(API_ENDPOINTS.attributeUpdate(), {
        attribute_id: editingAttr.id,
        name: values.name?.trim(),
        display_type: values.display_type,
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success('Attribute updated successfully!');
        setEditAttrModalOpen(false);
        setEditingAttr(null);
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to update attribute');
      }
    } catch (err) {
      console.error('Error updating attribute:', err);
      toast.error('Failed to update attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Attribute
  const handleDeleteAttribute = async (attributeId) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.attributeDelete(), {
        attribute_id: attributeId,
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success('Attribute deleted successfully');
        setAttributes((prev) => prev.filter((a) => a.id !== attributeId));
      } else {
        toast.error(res.data?.message || 'Failed to delete attribute');
      }
    } catch (err) {
      console.error('Error deleting attribute:', err);
      toast.error('Failed to delete attribute');
    }
  };

  // Update Attribute Value
  const handleUpdateAttributeValueSubmit = async (values) => {
    if (!editingVal) return;
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesUpdate(), {
        value_id: editingVal.id,
        value: values.value?.trim(),
        color_code: values.color_code || null,
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success('Option value updated successfully!');
        setEditValModalOpen(false);
        setEditingVal(null);
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to update option value');
      }
    } catch (err) {
      console.error('Error updating option value:', err);
      toast.error('Failed to update option value');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Attribute Value
  const handleDeleteAttributeValue = async (valueId, attributeId) => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesDelete(), {
        value_id: valueId,
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success('Option value deleted');
        setAttributes((prev) =>
          prev.map((a) => (a.id === attributeId ? { ...a, values: (a.values || []).filter((v) => v.id !== valueId) } : a))
        );
      } else {
        toast.error(res.data?.message || 'Failed to delete option value');
      }
    } catch (err) {
      console.error('Error deleting option value:', err);
      toast.error('Failed to delete value');
    }
  };

  // Add Attribute Value Inline
  const handleAddAttributeValue = async (attributeId) => {
    const val = newValInput[attributeId]?.trim();
    if (!val) {
      toast.error('Please enter a value');
      return;
    }

    const attr = attributes.find((a) => a.id === attributeId);
    const isColor = attr?.display_type === 'color' || (attr?.name && attr.name.toLowerCase().includes('color'));
    const chosenColor = newValColor[attributeId] || (isColor ? detectColorHex(val) : null);

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesCreate(), {
        attribute_id: attributeId,
        value: val,
        color_code: chosenColor,
        sort_order: (attr?.values || []).length + 1,
      });

      if (res.data?.status === 1000 || res.data?.status_code === 1000 || res.status === 201) {
        toast.success(`Added option "${val}"!`);
        setNewValInput((prev) => ({ ...prev, [attributeId]: '' }));
        setNewValColor((prev) => ({ ...prev, [attributeId]: '#000000' }));
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to add attribute value');
      }
    } catch (err) {
      console.error('Error adding attribute value:', err);
      toast.error('Error adding value');
    }
  };

  // Quick Table: Inline cell change
  const handleInlineCellChange = (variantId, field, value) => {
    setInlineEditedVariants((prev) => ({
      ...prev,
      [variantId]: {
        ...(prev[variantId] || {}),
        [field]: value,
      },
    }));
  };

  // Quick Table: Save Single Variant Row
  const handleSaveInlineVariant = async (record) => {
    const changes = inlineEditedVariants[record.id] || {};
    const updatedPayload = {
      variant_id: record.id,
      sales_price: changes.sales_price !== undefined ? parseFloat(changes.sales_price) : parseFloat(record.sales_price || 0),
      mrp: changes.mrp !== undefined ? parseFloat(changes.mrp) : parseFloat(record.mrp || 0),
      purchase_price: changes.purchase_price !== undefined ? parseFloat(changes.purchase_price) : parseFloat(record.purchase_price || 0),
      is_default: changes.is_default !== undefined ? !!changes.is_default : !!record.is_default,
      is_active: changes.is_active !== undefined ? !!changes.is_active : record.is_active !== false,
      sku: changes.sku !== undefined ? changes.sku : record.sku,
    };

    setSavingVariantId(record.id);
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.variantUpdate(), updatedPayload);
      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success(`Variant ${record.sku || record.variant_title} updated!`);
        // Remove from edited state
        setInlineEditedVariants((prev) => {
          const next = { ...prev };
          delete next[record.id];
          return next;
        });
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to update variant');
      }
    } catch (err) {
      console.error('Error saving variant inline:', err);
      toast.error('Failed to update variant');
    } finally {
      setSavingVariantId(null);
    }
  };

  // Open Detailed Drawer for Variant
  const handleOpenVariantDrawer = (variant) => {
    setSelectedVariant(variant);
    drawerForm.setFieldsValue({
      sku: variant.sku,
      barcode: variant.barcode,
      variant_title: variant.variant_title,
      sales_price: variant.sales_price,
      mrp: variant.mrp,
      purchase_price: variant.purchase_price,
      weight: variant.weight,
      dimensions: variant.dimensions,
      is_default: !!variant.is_default,
      is_active: variant.is_active !== false,
      attribute_value_ids: (variant.attribute_values || []).map((av) => av.attribute_value?.id || av.id),
    });

    if (variant.images && Array.isArray(variant.images)) {
      setVariantFileList(
        variant.images.map((img) => ({
          uid: img.id || Math.random().toString(),
          name: 'variant_image',
          status: 'done',
          url: img.image ? (img.image.startsWith('http') ? img.image : baseUrl + img.image) : '',
        }))
      );
    } else {
      setVariantFileList([]);
    }

    setDrawerOpen(true);
  };

  // Save Variant from Drawer
  const handleSaveDrawerVariant = async () => {
    try {
      const values = await drawerForm.validateFields();
      setIsSubmitting(true);

      const payload = {
        variant_id: selectedVariant.id,
        sku: values.sku?.trim(),
        barcode: values.barcode?.trim(),
        variant_title: values.variant_title?.trim(),
        sales_price: parseFloat(values.sales_price || 0),
        mrp: parseFloat(values.mrp || 0),
        purchase_price: parseFloat(values.purchase_price || 0),
        weight: parseFloat(values.weight || 0),
        dimensions: values.dimensions || '',
        is_default: !!values.is_default,
        is_active: values.is_active !== false,
        attribute_value_ids: values.attribute_value_ids || [],
      };

      const res = await axiosInstance.post(API_ENDPOINTS.variantUpdate(), payload);

      if (res.data?.status === 1000 || res.data?.status_code === 1000) {
        toast.success('Variant details saved successfully!');
        setDrawerOpen(false);
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to update variant');
      }
    } catch (err) {
      console.error('Error saving variant drawer details:', err);
      toast.error('Please verify form inputs');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload Image for Variant
  const handleVariantImageUpload = async (file) => {
    if (!selectedVariant) return false;

    const isPrimary = variantFileList.length === 0;
    const sortOrder = variantFileList.length + 1;

    const formData = new FormData();
    formData.append('organization_id', orgId);
    formData.append('variant_id', selectedVariant.id);
    formData.append('image', file);
    formData.append('is_primary', isPrimary ? 'true' : 'false');
    formData.append('sort_order', String(sortOrder));

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.variantImageUpload(), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000 || res.status === 201) {
        toast.success('Variant image uploaded!');
        fetchProductCompositeDetails();
        const uploadedData = res.data.data;
        if (uploadedData) {
          setVariantFileList((prev) => [
            ...prev,
            {
              uid: uploadedData.id || Math.random().toString(),
              name: 'variant_image',
              status: 'done',
              url: uploadedData.image ? (uploadedData.image.startsWith('http') ? uploadedData.image : baseUrl + uploadedData.image) : '',
            },
          ]);
        }
      } else {
        toast.error(res.data?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Image upload failed');
    }
    return false;
  };

  // Create New Variant
  const handleCreateNewVariant = async (values) => {
    try {
      setIsSubmitting(true);
      const payload = {
        organization_id: orgId,
        productId: productId,
        branch_id: 1,
        sku: values.sku?.trim(),
        barcode: values.barcode?.trim() || '',
        variant_title: values.variant_title?.trim(),
        sales_price: parseFloat(values.sales_price || 0),
        mrp: parseFloat(values.mrp || 0),
        purchase_price: parseFloat(values.purchase_price || 0),
        is_default: !!values.is_default,
        weight: parseFloat(values.weight || 0),
        dimensions: values.dimensions || '',
        attribute_value_ids: values.attribute_value_ids || [],
      };

      const res = await axiosInstance.post(API_ENDPOINTS.variantCreate(), payload);
      if (res.data?.status === 1000 || res.data?.status_code === 1000 || res.status === 201) {
        toast.success('New variant created successfully!');
        setNewVariantModalOpen(false);
        newVariantForm.resetFields();
        fetchProductCompositeDetails();
      } else {
        toast.error(res.data?.message || 'Failed to create variant');
      }
    } catch (err) {
      console.error('Create variant error:', err);
      toast.error('Error creating variant');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Table Columns
  const variantColumns = [
    {
      title: 'Variant & Image',
      key: 'title_image',
      width: 200,
      render: (_, record) => {
        const primaryImg = record.images?.[0]?.image;
        const imgUrl = primaryImg ? (primaryImg.startsWith('http') ? primaryImg : baseUrl + primaryImg) : null;
        return (
          <Space orientation="horizontal" size="middle">
            {imgUrl ? (
              <Avatar shape="square" size={44} src={imgUrl} />
            ) : (
              <div className="w-11 h-11 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-lg border border-slate-200">
                <PictureOutlined />
              </div>
            )}
            <div>
              <Text strong className="block text-slate-900 leading-snug">
                {record.variant_title || 'Untitled Variant'}
              </Text>
              <Tag color="cyan" className="font-mono text-[11px] mt-0.5">
                {record.sku}
              </Tag>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Attributes',
      key: 'attributes',
      width: 180,
      render: (_, record) => {
        const attrValues = record.attribute_values || [];
        if (attrValues.length === 0) {
          return <Text type="secondary" className="text-xs">No options</Text>;
        }
        return (
          <Space size={[4, 4]} wrap>
            {attrValues.map((av, i) => {
              const attrName = av.attribute?.name || 'Attr';
              const valName = av.attribute_value?.value || av.value || '';
              const colorCode = av.attribute_value?.color_code;
              return (
                <Tag
                  key={i}
                  className="inline-flex orientation-horizontal items-center gap-1.5 px-2 orientation-vertical-center"
                  style={{
                    backgroundColor: '#f1f5f9',
                    borderColor: '#cbd5e1',
                    color: '#334155',
                    borderRadius: '4px',
                  }}
                >
                  {colorCode && (
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                      style={{ backgroundColor: colorCode }}
                    />
                  )}
                  <span className="font-medium text-xs">
                    {attrName}: {valName}
                  </span>
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: 'Sales Price (₹)',
      key: 'sales_price',
      width: 140,
      render: (_, record) => {
        const currentValue = inlineEditedVariants[record.id]?.sales_price !== undefined
          ? inlineEditedVariants[record.id].sales_price
          : record.sales_price;
        return (
          <InputNumber
            size="middle"
            prefix="₹"
            min={0}
            className="w-full font-semibold text-sky-700"
            value={currentValue}
            onChange={(val) => handleInlineCellChange(record.id, 'sales_price', val)}
          />
        );
      },
    },
    {
      title: 'MRP (₹)',
      key: 'mrp',
      width: 130,
      render: (_, record) => {
        const currentValue = inlineEditedVariants[record.id]?.mrp !== undefined
          ? inlineEditedVariants[record.id].mrp
          : record.mrp;
        return (
          <InputNumber
            size="middle"
            prefix="₹"
            min={0}
            className="w-full"
            value={currentValue}
            onChange={(val) => handleInlineCellChange(record.id, 'mrp', val)}
          />
        );
      },
    },
    {
      title: 'Purchase (₹)',
      key: 'purchase_price',
      width: 130,
      render: (_, record) => {
        const currentValue = inlineEditedVariants[record.id]?.purchase_price !== undefined
          ? inlineEditedVariants[record.id].purchase_price
          : record.purchase_price;
        return (
          <InputNumber
            size="middle"
            prefix="₹"
            min={0}
            className="w-full"
            value={currentValue}
            onChange={(val) => handleInlineCellChange(record.id, 'purchase_price', val)}
          />
        );
      },
    },
    {
      title: 'Default',
      key: 'is_default',
      width: 90,
      align: 'center',
      render: (_, record) => {
        const isDef = inlineEditedVariants[record.id]?.is_default !== undefined
          ? inlineEditedVariants[record.id].is_default
          : record.is_default;
        return (
          <Switch
            size="small"
            checked={isDef}
            onChange={(checked) => handleInlineCellChange(record.id, 'is_default', checked)}
          />
        );
      },
    },
    {
      title: 'Status',
      key: 'is_active',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const isActive = inlineEditedVariants[record.id]?.is_active !== undefined
          ? inlineEditedVariants[record.id].is_active
          : record.is_active !== false;
        return (
          <Tag color={isActive ? 'success' : 'default'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const isModified = !!inlineEditedVariants[record.id];
        const isSaving = savingVariantId === record.id;
        return (
          <Space orientation="horizontal" size="small">
            {isModified && (
              <Tooltip title="Save quick changes">
                <Button
                  type="primary"
                  size="small"
                  icon={<SaveOutlined />}
                  loading={isSaving}
                  style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                  onClick={() => handleSaveInlineVariant(record)}
                />
              </Tooltip>
            )}
            <Tooltip title="Edit Full Details / Media">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenVariantDrawer(record)}
              >
                Edit
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="p-6 sm:p-8 bg-slate-50 min-h-screen">
        <Skeleton active paragraph={{ rows: 14 }} />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'details',
      label: (
        <span className="flex items-center gap-2 font-medium text-sm">
          <ShoppingOutlined />
          Product Details
        </span>
      ),
      children: (
        <Card
          bordered={false}
          style={{ background: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
          className="!border !shadow-sm !mt-2"
        >
          <Form form={form} layout="vertical" onFinish={handleSaveBaseProduct}>
            <Title level={5} className="!mb-4 !text-slate-800">
              General Information
            </Title>
            <Row gutter={20}>
              <Col xs={24} md={14}>
                <Form.Item
                  label="Product Title / Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter product name' }]}
                >
                  <Input size="large" placeholder="e.g. Premium Cotton Polo T-Shirt" />
                </Form.Item>
              </Col>
              <Col xs={24} md={10}>
                <Form.Item
                  label="Product Code"
                  name="product_code"
                  rules={[{ required: true, message: 'Please enter product code' }]}
                >
                  <Input size="large" placeholder="e.g. PRD-1001" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="!mt-4 !mb-4 !text-slate-800">
              Classification & Tax
            </Title>
            <Row gutter={20}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Category" name="product_category">
                  <Select
                    size="large"
                    placeholder="Select category"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Button block type="text" icon={<PlusOutlined />} onClick={() => setCategoryModalOpen(true)}>
                          Create New Category
                        </Button>
                      </>
                    )}
                  >
                    {categories.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Brand" name="brand">
                  <Select
                    size="large"
                    placeholder="Select brand"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Button block type="text" icon={<PlusOutlined />} onClick={() => setBrandModalOpen(true)}>
                          Create New Brand
                        </Button>
                      </>
                    )}
                  >
                    {brands.map((b) => (
                      <Option key={b.id} value={b.id}>
                        {b.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Unit of Measure" name="unit">
                  <Select size="large" placeholder="Select unit">
                    {units.map((u) => (
                      <Option key={u.id} value={u.id}>
                        {u.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Tax Slab" name="tax">
                  <Select size="large" placeholder="Select tax">
                    {taxes.map((t) => (
                      <Option key={t.id} value={t.id}>
                        {t.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="!mt-4 !mb-4 !text-slate-800">
              Base Pricing & Identifiers
            </Title>
            <Row gutter={20}>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="Cost / Purchase Price" name="purchase_price">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="Default Sales Price" name="sale_price">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="MRP" name="mrp">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="HSN / SAC Code" name="hsn_code">
                  <Input size="large" placeholder="e.g. 610910" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Barcode / EAN" name="bar_code">
                  <Input size="large" placeholder="e.g. 8901234567890" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Product Description" name="description" className="!mt-2">
              <Input.TextArea rows={4} placeholder="Write a detailed product description..." />
            </Form.Item>

            <Row gutter={20} align="middle" className="!mb-6">
              <Col xs={24} md={12}>
                <Text strong className="!block !mb-2">Base Product Images</Text>
                <ImgCrop rotationSlider aspect={1 / 1}>
                  <Upload
                    listType="picture-card"
                    fileList={baseFileList}
                    onChange={({ fileList }) => setBaseFileList(fileList)}
                    beforeUpload={() => false}
                    maxCount={5}
                  >
                    {baseFileList.length < 5 && (
                      <div className="flex flex-col items-center justify-center">
                        <UploadOutlined className="!text-lg !text-slate-500" />
                        <span className="text-xs text-slate-500 mt-1">Upload</span>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Col>
              <Col xs={24} md={12}>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <Text strong className="!block !text-slate-900">Publish Product</Text>
                    <Text type="secondary" className="!text-xs">
                      Make this product live and visible across storefronts
                    </Text>
                  </div>
                  <Form.Item name="is_active" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Divider style={{ borderColor: '#e2e8f0' }} />

            <Flex justify="end">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SaveOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098', borderRadius: '0.5rem' }}
              >
                Save Product Details
              </Button>
            </Flex>
          </Form>
        </Card>
      ),
    },
    {
      key: 'attributes',
      label: (
        <span className="flex items-center gap-2 font-medium text-sm">
          <TagsOutlined />
          Attributes & Values ({attributes.length})
        </span>
      ),
      children: (
        <div className="mt-2 space-y-4">
          <Card
            bordered={false}
            style={{ background: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            className="!border !shadow-sm"
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap="small" className="!mb-4">
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Organization Attributes Library
                </Title>
                <Text type="secondary" className="!text-xs">
                  Attributes defined here can be assigned to product variants (e.g. Color, Size, Material)
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                onClick={() => setNewAttrModalOpen(true)}
              >
                Create New Attribute
              </Button>
            </Flex>

            {attributes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <TagsOutlined style={{ fontSize: 36, color: '#94a3b8' }} />
                <Title level={5} className="!mt-2 !mb-1 !text-slate-700">No Attributes Configured</Title>
                <Text type="secondary" className="!text-xs !block !mb-4">
                  Create attributes like Size or Color to start generating multi-SKU variants.
                </Text>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: '#1BA098' }}
                  onClick={() => setNewAttrModalOpen(true)}
                >
                  Create First Attribute
                </Button>
              </div>
            ) : (
              <Row gutter={[20, 20]}>
                {attributes.map((attr) => {
                  const isColorAttr = attr.display_type === 'color' || attr.name?.toLowerCase().includes('color');
                  return (
                    <Col xs={24} md={12} key={attr.id}>
                      <Card
                        size="small"
                        className="!border !border-slate-200 hover:!border-teal-500/40 !bg-white hover:!shadow-md !transition-all !rounded-xl overflow-hidden"
                        title={
                          <Flex justify="space-between" align="center" className="py-1">
                            <Space size="middle">
                              <Text strong className="!text-slate-900 !text-base">{attr.name}</Text>
                              <Tag color={isColorAttr ? 'magenta' : 'blue'} className="!text-[11px] !capitalize !rounded-full !px-2.5 !font-medium">
                                {attr.display_type || 'button'}
                              </Tag>
                            </Space>
                            <Space size="small">
                              <Tag color="cyan" className="!text-xs !font-semibold !rounded-full !mr-1">
                                {(attr.values || []).length} Options
                              </Tag>
                              <Tooltip title="Edit Attribute Header">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<EditOutlined className="!text-slate-500 hover:!text-teal-600 !text-sm" />}
                                  onClick={() => {
                                    setEditingAttr(attr);
                                    editAttrForm.setFieldsValue({
                                      name: attr.name,
                                      display_type: attr.display_type || 'button',
                                    });
                                    setEditAttrModalOpen(true);
                                  }}
                                />
                              </Tooltip>
                              <Popconfirm
                                title="Delete Attribute"
                                description={`Delete entire "${attr.name}" attribute and all its option values?`}
                                onConfirm={() => handleDeleteAttribute(attr.id)}
                                okText="Yes, Delete"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true, size: 'small' }}
                              >
                                <Tooltip title="Delete Attribute Entirely">
                                  <Button type="text" danger size="small" icon={<DeleteOutlined className="!text-sm" />} />
                                </Tooltip>
                              </Popconfirm>
                            </Space>
                          </Flex>
                        }
                      >
                        <div className="min-h-[70px] py-2">
                          {(attr.values || []).length === 0 ? (
                            <Text type="secondary" className="!text-xs italic !block !py-2">
                              No values added yet. Add values below.
                            </Text>
                          ) : (
                            <Space size={[8, 10]} wrap>
                              {(attr.values || []).map((val) => {
                                const activeColorHex = val.color_code || (isColorAttr ? detectColorHex(val.value) : null);
                                return (
                                  <div
                                    key={val.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-500 hover:shadow-sm transition-all group"
                                  >
                                    {activeColorHex && (
                                      <span
                                        className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs shrink-0"
                                        style={{ backgroundColor: activeColorHex }}
                                      />
                                    )}
                                    <span className="text-slate-800 font-semibold">{val.value}</span>

                                    <div className="flex items-center gap-1 ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                      <Tooltip title="Edit option value">
                                        <button
                                          type="button"
                                          className="p-0.5 text-slate-400 hover:text-teal-600 cursor-pointer rounded transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingVal({ ...val, attributeId: attr.id });
                                            editValForm.setFieldsValue({
                                              value: val.value,
                                              color_code: val.color_code || detectColorHex(val.value),
                                            });
                                            setEditValModalOpen(true);
                                          }}
                                        >
                                          <EditOutlined className="!text-[11px]" />
                                        </button>
                                      </Tooltip>

                                      <Popconfirm
                                        title="Delete value"
                                        description={`Remove option "${val.value}"?`}
                                        onConfirm={() => handleDeleteAttributeValue(val.id, attr.id)}
                                        okText="Delete"
                                        cancelText="Cancel"
                                        okButtonProps={{ danger: true, size: 'small' }}
                                      >
                                        <button
                                          type="button"
                                          className="p-0.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded transition-colors"
                                        >
                                          <CloseOutlined className="!text-[10px]" />
                                        </button>
                                      </Popconfirm>
                                    </div>
                                  </div>
                                );
                              })}
                            </Space>
                          )}
                        </div>

                        <Divider style={{ margin: '12px 0 14px 0' }} />

                        {/* Add Option Value Inline */}
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <Flex gap="small" align="center">
                            <Input
                              size="middle"
                              placeholder={`Add ${attr.name} value (e.g. ${isColorAttr ? 'Yellow' : 'XL'})...`}
                              value={newValInput[attr.id] || ''}
                              onChange={(e) =>
                                setNewValInput((prev) => ({ ...prev, [attr.id]: e.target.value }))
                              }
                              onPressEnter={() => handleAddAttributeValue(attr.id)}
                              className="!bg-white"
                            />
                            {isColorAttr && (
                              <input
                                type="color"
                                className="!w-9 !h-9 !p-0.5 !border !border-slate-300 !rounded-md !cursor-pointer shrink-0 bg-white"
                                value={newValColor[attr.id] || detectColorHex(newValInput[attr.id] || '')}
                                onChange={(e) =>
                                  setNewValColor((prev) => ({ ...prev, [attr.id]: e.target.value }))
                                }
                                title="Pick Custom Swatch Color"
                              />
                            )}
                            <Button
                              size="middle"
                              type="primary"
                              icon={<PlusOutlined />}
                              style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                              onClick={() => handleAddAttributeValue(attr.id)}
                              className="shrink-0"
                            >
                              Add
                            </Button>
                          </Flex>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'variants',
      label: (
        <span className="flex items-center gap-2 font-medium text-sm">
          <AppstoreOutlined />
          Variants List ({variants.length})
        </span>
      ),
      children: (
        <div className="mt-2 space-y-4">
          <Card
            bordered={false}
            style={{ background: '#ffffff', borderRadius: '0.75rem', borderColor: '#e2e8f0' }}
            className="border shadow-sm"
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap="small" className="mb-4">
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Variant Quick Table
                </Title>
                <Text type="secondary" className="text-xs">
                  Edit variant pricing and default status directly in the table or open the details drawer for full SKU controls.
                </Text>
              </div>

              <Space>
                {Object.keys(inlineEditedVariants).length > 0 && (
                  <Tag color="warning" className="font-medium text-xs px-2 py-1">
                    {Object.keys(inlineEditedVariants).length} Unsaved Variant Changes
                  </Tag>
                )}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                  onClick={() => setNewVariantModalOpen(true)}
                >
                  Add Variant
                </Button>
              </Space>
            </Flex>

            <Table
              dataSource={variants}
              columns={variantColumns}
              rowKey="id"
              pagination={false}
              bordered
              scroll={{ x: 1000 }}
              className="border border-slate-200 rounded-lg overflow-hidden"
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-900">
      {/* Top Header Card */}
      <Card
        style={{
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
        className="mb-6"
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button icon={<ArrowLeftOutlined />} />
            </Link>
            <div>
              <Flex align="center" gap="small">
                <Title level={3} style={{ margin: 0, color: '#0f172a' }}>
                  {productData?.name || 'Edit Product Catalog'}
                </Title>
                {productData?.product_code && (
                  <Tag color="blue" className="font-mono text-xs">
                    {productData.product_code}
                  </Tag>
                )}
                <Tag color={productData?.is_active !== false ? 'success' : 'default'}>
                  {productData?.is_active !== false ? 'Active' : 'Inactive'}
                </Tag>
              </Flex>
              <Text type="secondary" className="text-xs">
                Manage product details, organize variant attributes, and maintain SKU price points
              </Text>
            </div>
          </div>

          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={refreshing}
              onClick={() => fetchProductCompositeDetails(true)}
            >
              Refresh
            </Button>
            <Link href="/admin/products">
              <Button>Back to Catalog</Button>
            </Link>
          </Space>
        </Flex>

        <Divider style={{ borderColor: '#e2e8f0', margin: '16px 0 8px 0' }} />

        {/* Tabbed Layout Navigation */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="line"
          size="large"
          className="product-edit-tabs"
        />
      </Card>

      {/* ----------------- DRAWER FOR FULL VARIANT EDITING ----------------- */}
      <Drawer
        title={
          <Flex justify="space-between" align="center" className="pr-4">
            <span>Edit Variant: {selectedVariant?.variant_title || selectedVariant?.sku}</span>
            <Tag color={selectedVariant?.is_default ? 'gold' : 'blue'}>
              {selectedVariant?.is_default ? 'Default SKU' : 'Variant'}
            </Tag>
          </Flex>
        }
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
            onClick={handleSaveDrawerVariant}
          >
            Save Variant
          </Button>
        }
      >
        <Form form={drawerForm} layout="vertical">
          <Title level={5} className="!mb-3">SKU & Title</Title>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="SKU Code" name="sku" rules={[{ required: true }]}>
                <Input placeholder="e.g. PRD-RED-M" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Barcode / EAN" name="barcode">
                <Input placeholder="e.g. 890123456" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Variant Title" name="variant_title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Red / Medium" />
          </Form.Item>

          <Title level={5} className="!mt-4 !mb-3">Pricing & Margins</Title>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Sales Price (₹)" name="sales_price" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="MRP (₹)" name="mrp" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Purchase (₹)" name="purchase_price">
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="!mt-4 !mb-3">Shipping & Specs</Title>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Weight (kg)" name="weight">
                <InputNumber style={{ width: '100%' }} step={0.01} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Dimensions (LxWxH cm)" name="dimensions">
                <Input placeholder="e.g. 15x10x5" />
              </Form.Item>
            </Col>
          </Row>

          <Title level={5} className="!mt-4 !mb-3">Attribute Associations</Title>
          <Form.Item label="Select Option Values" name="attribute_value_ids">
            <Select mode="multiple" placeholder="Select matching attribute values" style={{ width: '100%' }}>
              {attributes.map((attr) => (
                <Select.OptGroup key={attr.id} label={attr.name}>
                  {(attr.values || []).map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.value}
                    </Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Title level={5} className="!mt-4 !mb-3">Variant Images</Title>
          <Upload
            listType="picture-card"
            fileList={variantFileList}
            beforeUpload={handleVariantImageUpload}
            showUploadList={{ showRemoveIcon: false }}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Image</div>
            </div>
          </Upload>

          <Divider style={{ margin: '16px 0' }} />

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Default SKU for Product" name="is_default" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Variant Active" name="is_active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      {/* ----------------- MODAL: CREATE NEW VARIANT ----------------- */}
      <Modal
        title="Add New Product Variant"
        open={newVariantModalOpen}
        onCancel={() => setNewVariantModalOpen(false)}
        footer={null}
      >
        <Form form={newVariantForm} layout="vertical" onFinish={handleCreateNewVariant}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                <Input placeholder="e.g. TSHIRT-BLU-L" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Barcode" name="barcode">
                <Input placeholder="e.g. 89012398" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Variant Title" name="variant_title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Blue / Large" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Sales Price (₹)" name="sales_price" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="MRP (₹)" name="mrp" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Purchase (₹)" name="purchase_price">
                <InputNumber style={{ width: '100%' }} prefix="₹" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Attribute Values" name="attribute_value_ids">
            <Select mode="multiple" placeholder="Select matching attribute values">
              {attributes.map((attr) => (
                <Select.OptGroup key={attr.id} label={attr.name}>
                  {(attr.values || []).map((val) => (
                    <Option key={val.id} value={val.id}>
                      {val.value}
                    </Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
          >
            Create Variant
          </Button>
        </Form>
      </Modal>

      {/* ----------------- MODAL: CREATE ATTRIBUTE ----------------- */}
      <Modal
        title="Create New Attribute"
        open={newAttrModalOpen}
        onCancel={() => setNewAttrModalOpen(false)}
        footer={null}
      >
        <Form form={newAttrForm} layout="vertical" onFinish={handleCreateAttribute}>
          <Form.Item label="Attribute Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Material, Size, Fit" />
          </Form.Item>
          <Form.Item label="Display Type" name="display_type" initialValue="button" rules={[{ required: true }]}>
            <Select>
              <Option value="button">Button Pill (e.g. S, M, L)</Option>
              <Option value="color">Color Swatch (Visual picker)</Option>
              <Option value="select">Dropdown Select</Option>
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
          >
            Create Attribute
          </Button>
        </Form>
      </Modal>

      {/* ----------------- MODAL: EDIT ATTRIBUTE ----------------- */}
      <Modal
        title={`Edit Attribute: ${editingAttr?.name || ''}`}
        open={editAttrModalOpen}
        onCancel={() => {
          setEditAttrModalOpen(false);
          setEditingAttr(null);
        }}
        footer={null}
      >
        <Form form={editAttrForm} layout="vertical" onFinish={handleUpdateAttributeSubmit}>
          <Form.Item label="Attribute Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Material, Size, Fit" />
          </Form.Item>
          <Form.Item label="Display Type" name="display_type" rules={[{ required: true }]}>
            <Select>
              <Option value="button">Button Pill (e.g. S, M, L)</Option>
              <Option value="color">Color Swatch (Visual picker)</Option>
              <Option value="select">Dropdown Select</Option>
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
          >
            Update Attribute
          </Button>
        </Form>
      </Modal>

      {/* ----------------- MODAL: EDIT OPTION VALUE ----------------- */}
      <Modal
        title={`Edit Option Value: ${editingVal?.value || ''}`}
        open={editValModalOpen}
        onCancel={() => {
          setEditValModalOpen(false);
          setEditingVal(null);
        }}
        footer={null}
      >
        <Form form={editValForm} layout="vertical" onFinish={handleUpdateAttributeValueSubmit}>
          <Form.Item label="Option Value Name" name="value" rules={[{ required: true }]}>
            <Input placeholder="e.g. Red or Large" />
          </Form.Item>
          <Form.Item label="Color Swatch (Hex)" name="color_code">
            <Flex gap="small" align="center">
              <Input
                placeholder="e.g. #FF0000"
                value={editValForm.getFieldValue('color_code')}
                onChange={(e) => editValForm.setFieldsValue({ color_code: e.target.value })}
              />
              <input
                type="color"
                className="w-9 h-9 p-0 border border-slate-300 rounded cursor-pointer"
                value={editValForm.getFieldValue('color_code') || '#1890ff'}
                onChange={(e) => editValForm.setFieldsValue({ color_code: e.target.value })}
              />
            </Flex>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting}
            style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
          >
            Update Option Value
          </Button>
        </Form>
      </Modal>

      {/* ----------------- MODALS: CATEGORY & BRAND ----------------- */}
      <Modal
        title="Create New Category"
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        footer={null}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item name="category_name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#1BA098' }}>
            Create Category
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Create New Brand"
        open={brandModalOpen}
        onCancel={() => setBrandModalOpen(false)}
        footer={null}
      >
        <Form form={brandForm} layout="vertical" onFinish={handleCreateBrand}>
          <Form.Item name="brand_name" label="Brand Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#1BA098' }}>
            Create Brand
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default EditProductPage;
