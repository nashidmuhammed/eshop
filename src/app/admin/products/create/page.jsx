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
  Steps,
  Switch,
  Tag,
  Typography,
  Upload,
  Badge,
  Flex,
  Tooltip,
  Avatar,
  Image,
  Popover,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  PictureOutlined,
  SaveOutlined,
  CheckOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useRouter, useSearchParams } from 'next/navigation';
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

const CreateProduct = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const { organization } = useUser();
  const orgId = organization?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('organizationDetails') || '{}')?.id : null);

  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [brandForm] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [loader, setLoader] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Master Data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [baseFileList, setBaseFileList] = useState([]);

  // Modals for Master Data Creation
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  // Flow State
  const [createdProductId, setCreatedProductId] = useState(productId || null);
  const [hasVariants, setHasVariants] = useState(true);

  // Step 2: Attribute Library & Selected Product Attributes
  // Library: all organization attributes fetched from API
  const [libraryAttributes, setLibraryAttributes] = useState([]);
  const [attrSearchInputs, setAttrSearchInputs] = useState({});
  // Attribute Creation Modal State
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
  const [attrModalTargetRowIndex, setAttrModalTargetRowIndex] = useState(null);
  const [isCreatingAttribute, setIsCreatingAttribute] = useState(false);
  const [attrModalForm] = Form.useForm();

  // Attribute Value Creation Modal State
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [valueModalTargetRowIndex, setValueModalTargetRowIndex] = useState(null);
  const [isCreatingValue, setIsCreatingValue] = useState(false);
  const [valueModalForm] = Form.useForm();

  // Selected for this product: [{ attribute_id, name, display_type, selected_values: [{ id, value, color_code }] }]
  const [selectedAttributes, setSelectedAttributes] = useState([
    { attribute_id: null, name: 'Color', display_type: 'color', selected_values: [] }
  ]);

  // Step 3 & 4: Variants List
  // [{ id: '...', sku: '...', variant_title: '...', sales_price: 499, mrp: 799, purchase_price: 250, is_default: true, attribute_value_ids: [], images: [] }]
  const [variantsList, setVariantsList] = useState([]);
  const [activeVariantForUpload, setActiveVariantForUpload] = useState(null);

  // 1. Initial Data Fetching
  const fetchInitial = useCallback(async () => {
    if (!orgId) return;
    setLoader(true);
    try {
      const [res0, res1, res2, res3, res4, res5, resAttrs] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.settings(orgId, 'PRD')),
        axiosInstance.get(API_ENDPOINTS.generateCode(orgId, 'PRD')),
        axiosInstance.get(API_ENDPOINTS.categories(orgId)),
        axiosInstance.get(API_ENDPOINTS.brands(orgId)),
        axiosInstance.get(API_ENDPOINTS.units(orgId)),
        axiosInstance.get(API_ENDPOINTS.taxes(orgId)),
        axiosInstance.post(API_ENDPOINTS.attributesList(), { organization_id: orgId }).catch(() => ({ data: { data: [] } })),
      ]);

      if (res2.data?.status_code === 1000) setCategories(res2.data.data || []);
      if (res3.data?.status_code === 1000) setBrands(res3.data.data || []);
      if (res4.data?.status_code === 1000) setUnits(res4.data.data || []);
      if (res5.data?.status_code === 1000) setTaxes(res5.data.data || []);
      if (resAttrs.data?.status === 1000 || resAttrs.data?.data) {
        const loadedAttrs = resAttrs.data?.data || [];
        setLibraryAttributes(loadedAttrs);
        if (loadedAttrs.length > 0) {
          setSelectedAttributes((prev) =>
            prev.map((row) => {
              if (!row.attribute_id) {
                const matched =
                  loadedAttrs.find(
                    (la) => la.name?.toLowerCase() === (row.name || '').toLowerCase()
                  ) || loadedAttrs[0];
                if (matched) {
                  return {
                    attribute_id: matched.id,
                    name: matched.name,
                    display_type: matched.display_type || 'button',
                    selected_values: row.selected_values || [],
                  };
                }
              }
              return row;
            })
          );
        }
      }

      if (productId) {
        setCreatedProductId(productId);
        const resProd = await axiosInstance.post(API_ENDPOINTS.productDetails(), {
          organization_id: orgId,
          product_id: productId,
        });
        const compositeData = resProd.data?.data || resProd.data || {};
        const prod = compositeData.product;
        if (prod) {
          form.setFieldsValue({
            name: prod.name,
            product_code: prod.product_code,
            product_category: prod.product_category,
            brand: prod.brand,
            unit: prod.unit,
            tax: prod.tax,
            hsn_code: prod.hsn_code,
            bar_code: prod.bar_code,
            purchase_price: prod.price_list?.purchase_price ?? prod.purchase_price,
            sale_price: prod.price_list?.sales_price ?? prod.sales_price,
            mrp: prod.price_list?.mrp ?? prod.mrp,
            original_price: prod.price_list?.original_price ?? prod.original_price,
            description: prod.description,
            is_active: prod.is_active !== false,
          });
          if (prod.images) {
            setBaseFileList(
              prod.images.map((img) => ({
                uid: img.id,
                name: 'product_image',
                status: 'done',
                url: img.url ? (img.url.startsWith('http') ? img.url : baseUrl + img.url) : '',
              }))
            );
          }
        }
      } else if (res1.data?.status_code === 1000) {
        const generatedCode = res1.data.data;
        form.setFieldsValue({
          product_code: generatedCode,
          is_active: true,
          product_category: res2.data?.data?.[0]?.id,
          brand: res3.data?.data?.[0]?.id,
          unit: res4.data?.data?.[0]?.id,
          tax: res5.data?.data?.[0]?.id,
        });
      }
    } catch (err) {
      console.error('Error loading initial creation data:', err);
      toast.error('Failed to load master metadata');
    } finally {
      setLoader(false);
    }
  }, [orgId, productId, form]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

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

  // ----------------------------------------------------
  // STEP 1: Save Base Product
  // ----------------------------------------------------
  const handleSaveBaseProduct = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const formData = new FormData();
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

      let res;
      if (createdProductId) {
        formData.append('pk', createdProductId);
        res = await axiosInstance.put(`${DotzBaseUrlV1}/product/products/`, formData);
      } else {
        res = await axiosInstance.post(`${DotzBaseUrlV1}/product/products/`, formData);
      }

      if (res.data?.status_code === 1000 || res.status === 200 || res.status === 201) {
        const prodData = res.data?.data;
        const prodId = (typeof prodData === 'object' && prodData?.id) ? prodData.id : (prodData || createdProductId);
        setCreatedProductId(prodId);
        toast.success(createdProductId ? 'Base product updated!' : 'Base product created successfully!');
        if (hasVariants) {
          setCurrentStep(1);
        } else {
          router.push('/admin/products');
        }
      } else {
        toast.error(res.data?.message || 'Failed to save base product');
      }
    } catch (err) {
      console.error('Base product submit error:', err);
      toast.error('Please fill all required base product details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // STEP 2: "Select from Library or Create Inline" Logic
  // ----------------------------------------------------
  const handleOpenCreateAttrModal = (rowIndex) => {
    setAttrModalTargetRowIndex(rowIndex);
    attrModalForm.resetFields();
    attrModalForm.setFieldsValue({ display_type: 'button' });
    setIsAttrModalOpen(true);
  };

  const handleCreateAttributeSubmit = async () => {
    try {
      const values = await attrModalForm.validateFields();
      setIsCreatingAttribute(true);

      const res = await axiosInstance.post(API_ENDPOINTS.attributeCreate(), {
        organization_id: orgId,
        name: values.name.trim(),
        display_type: values.display_type || 'button',
      });

      const newAttr = res.data?.data || res.data;
      if (newAttr && newAttr.id) {
        newAttr.values = newAttr.values || [];
        setLibraryAttributes((prev) => [...prev, newAttr]);

        // Automatically assign this newly created attribute to the target row
        if (attrModalTargetRowIndex !== null) {
          setSelectedAttributes((prev) =>
            prev.map((item, i) =>
              i === attrModalTargetRowIndex
                ? {
                    attribute_id: newAttr.id,
                    name: newAttr.name,
                    display_type: newAttr.display_type || 'button',
                    selected_values: [],
                  }
                : item
            )
          );
        }

        toast.success(`Created attribute "${newAttr.name}"`);
        setIsAttrModalOpen(false);
        attrModalForm.resetFields();
      } else {
        toast.error('Failed to create attribute');
      }
    } catch (err) {
      console.error('Error creating attribute from modal:', err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }
    } finally {
      setIsCreatingAttribute(false);
    }
  };

  const handleOpenCreateValueModal = (rowIndex) => {
    const row = selectedAttributes[rowIndex];
    const libraryAttr = libraryAttributes.find(
      (a) => (row?.attribute_id && a.id === row.attribute_id) || (row?.name && a.name?.toLowerCase() === row.name?.toLowerCase())
    );
    const attrId = row?.attribute_id || libraryAttr?.id;

    if (!attrId) {
      toast.error('Please select an Option Name first.');
      return;
    }

    setValueModalTargetRowIndex(rowIndex);
    valueModalForm.resetFields();
    const isColor = (libraryAttr?.display_type === 'color' || row?.display_type === 'color' || (row?.name && row.name.toLowerCase().includes('color')));
    valueModalForm.setFieldsValue({
      color_code: isColor ? '#1BA098' : '',
      sort_order: (libraryAttr?.values || []).length + 1,
    });
    setIsValueModalOpen(true);
  };

  const handleCreateValueSubmit = async () => {
    if (valueModalTargetRowIndex === null) return;
    const row = selectedAttributes[valueModalTargetRowIndex];
    const libraryAttr = libraryAttributes.find(
      (a) => (row?.attribute_id && a.id === row.attribute_id) || (row?.name && a.name?.toLowerCase() === row.name?.toLowerCase())
    );
    const attrId = row?.attribute_id || libraryAttr?.id;
    if (!attrId) return;

    try {
      const values = await valueModalForm.validateFields();
      setIsCreatingValue(true);

      const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesCreate(), {
        attribute_id: attrId,
        value: values.value.trim(),
        color_code: values.color_code || null,
        sort_order: values.sort_order || 0,
      });

      const match = res.data?.data || res.data;
      if (match && match.id) {
        // 1. Update libraryAttributes so this new value exists in state
        setLibraryAttributes((prev) =>
          prev.map((a) => (a.id === attrId ? { ...a, values: [...(a.values || []), match] } : a))
        );

        // 2. Add to selected_values for this row immediately
        setSelectedAttributes((prev) =>
          prev.map((item, i) =>
            i === valueModalTargetRowIndex
              ? {
                  ...item,
                  selected_values: [...(item.selected_values || []).filter((v) => v.id !== match.id), match],
                }
              : item
          )
        );

        toast.success(`Created value "${match.value}"`);
        setIsValueModalOpen(false);
        valueModalForm.resetFields();
      } else {
        toast.error('Failed to create option value');
      }
    } catch (err) {
      console.error('Error creating value from modal:', err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }
    } finally {
      setIsCreatingValue(false);
    }
  };

  const handleSelectOrCreateAttribute = async (index, nameOrId) => {
    if (!nameOrId) {
      setSelectedAttributes((prev) =>
        prev.map((item, i) => (i === index ? { attribute_id: null, name: '', display_type: 'button', selected_values: [] } : item))
      );
      return;
    }

    let cleanNameOrId = nameOrId;
    if (typeof nameOrId === 'string' && nameOrId.startsWith('CREATE:')) {
      cleanNameOrId = nameOrId.replace('CREATE:', '').trim();
    }

    let attr = libraryAttributes.find(
      (a) => a.id === cleanNameOrId || a.name?.toLowerCase() === cleanNameOrId.toLowerCase()
    );

    if (!attr) {
      // Attribute does not exist in library -> Create it inline in backend
      try {
        const isColor = cleanNameOrId.toLowerCase().includes('color') || cleanNameOrId.toLowerCase().includes('colour');
        const res = await axiosInstance.post(API_ENDPOINTS.attributeCreate(), {
          organization_id: orgId,
          name: cleanNameOrId,
          display_type: isColor ? 'color' : 'button',
        });
        attr = res.data?.data || res.data;
        if (attr && attr.id) {
          attr.values = attr.values || [];
          setLibraryAttributes((prev) => [...prev, attr]);
          toast.success(`Created attribute "${attr.name}" in organization library`);
        } else {
          toast.error('Failed to create attribute');
          return;
        }
      } catch (err) {
        console.error('Error creating attribute inline:', err);
        toast.error('Failed to create new attribute');
        return;
      }
    }

    setSelectedAttributes((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              attribute_id: attr.id,
              name: attr.name,
              display_type: attr.display_type || 'button',
              selected_values: [],
            }
          : item
      )
    );
  };

  const [customColorName, setCustomColorName] = useState({});
  const [customColorHex, setCustomColorHex] = useState({});

  const handleSelectOrCreateValues = async (index, rawValues) => {
    const row = selectedAttributes[index];
    const libraryAttr = libraryAttributes.find(
      (a) => (row.attribute_id && a.id === row.attribute_id) || (row.name && a.name?.toLowerCase() === row.name?.toLowerCase())
    );
    const attrId = row.attribute_id || libraryAttr?.id;
    if (!attrId) return;

    const existingLibraryValues = libraryAttr?.values || [];
    const updatedSelected = [];

    for (const valName of rawValues) {
      let match = existingLibraryValues.find(
        (v) => v.id === valName || v.value?.toLowerCase() === valName.trim().toLowerCase()
      );

      if (!match) {
        // Value does not exist -> Create inline in backend with auto-detected hex code if color type
        const isColorType = (row.display_type || libraryAttr?.display_type) === 'color';
        const initialHex = isColorType ? detectColorHex(valName) : null;
        try {
          const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesCreate(), {
            attribute_id: attrId,
            value: valName.trim(),
            color_code: initialHex,
            sort_order: existingLibraryValues.length + 1,
          });
          match = res.data?.data || res.data;
          if (match && match.id) {
            match.color_code = match.color_code || initialHex;
            existingLibraryValues.push(match);
            // Update in library state
            setLibraryAttributes((prev) =>
              prev.map((a) => (a.id === attrId ? { ...a, values: [...(a.values || []), match] } : a))
            );
          }
        } catch (err) {
          console.error('Error creating value inline:', err);
          toast.error(`Failed to create value "${valName}"`);
          continue;
        }
      }

      if (match) {
        updatedSelected.push(match);
      }
    }

    setSelectedAttributes((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              attribute_id: attrId,
              name: item.name || libraryAttr?.name,
              selected_values: updatedSelected,
            }
          : item
      )
    );
  };

  const handleCreateCustomColorValue = async (index, customName, customColorCode) => {
    if (!customName || !customName.trim()) {
      toast.error('Please enter a color name (e.g. Yellow or Mustard)');
      return;
    }
    const row = selectedAttributes[index];
    const libraryAttr = libraryAttributes.find(
      (a) => (row.attribute_id && a.id === row.attribute_id) || (row.name && a.name?.toLowerCase() === row.name?.toLowerCase())
    );
    const attrId = row.attribute_id || libraryAttr?.id;
    if (!attrId) return;

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.attributeValuesCreate(), {
        attribute_id: attrId,
        value: customName.trim(),
        color_code: customColorCode || '#EAB308',
        sort_order: (libraryAttr?.values || []).length + 1,
      });
      const match = res.data?.data || res.data;
      if (match && match.id) {
        match.color_code = match.color_code || customColorCode;
        // Update library
        setLibraryAttributes((prev) =>
          prev.map((a) => (a.id === attrId ? { ...a, values: [...(a.values || []), match] } : a))
        );
        // Add to selected values
        setSelectedAttributes((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  attribute_id: attrId,
                  selected_values: [...(item.selected_values || []).filter((v) => v.id !== match.id), match],
                }
              : item
          )
        );
        toast.success(`Created color option "${customName}" (${customColorCode})`);
      }
    } catch (err) {
      toast.error('Failed to create custom color value');
    }
  };

  const handleQuickAddLibraryValue = (index, valueObj) => {
    const current = selectedAttributes[index]?.selected_values || [];
    if (current.some((v) => v.id === valueObj.id)) return;
    setSelectedAttributes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected_values: [...current, valueObj] } : item
      )
    );
  };

  // Generate SKU Permutations from Selected Attributes & Values
  const handleProceedToVariantsStep = () => {
    const validAttributes = selectedAttributes.filter(
      (a) => a.attribute_id && a.selected_values && a.selected_values.length > 0
    );

    if (validAttributes.length === 0) {
      toast.error('Please configure at least one attribute with values (e.g. Color or Size).');
      return;
    }

    // Cartesian Product
    let combinations = [[]];
    validAttributes.forEach((attr) => {
      const newCombos = [];
      combinations.forEach((prevCombo) => {
        attr.selected_values.forEach((val) => {
          newCombos.push([
            ...prevCombo,
            {
              attrId: attr.attribute_id,
              attrName: attr.name,
              valId: val.id,
              valName: val.value,
              colorCode: val.color_code,
            },
          ]);
        });
      });
      combinations = newCombos;
    });

    const baseCode = form.getFieldValue('product_code') || 'PROD';
    const baseSalePrice = form.getFieldValue('sale_price') || 0;
    const baseMrp = form.getFieldValue('mrp') || 0;
    const basePurchasePrice = form.getFieldValue('purchase_price') || 0;

    const generated = combinations.map((combo, idx) => {
      const title = combo.map((c) => c.valName).join(' / ');
      const skuSlug = combo.map((c) => c.valName.toUpperCase().replace(/\s+/g, '-')).join('-');
      return {
        id: `temp_${idx}`,
        sku: `${baseCode}-${skuSlug}`,
        barcode: `${baseCode}${idx + 100}`,
        variant_title: title,
        sales_price: baseSalePrice,
        mrp: baseMrp,
        purchase_price: basePurchasePrice,
        is_default: idx === 0,
        weight: 0.25,
        dimensions: '10x10x5',
        attribute_value_ids: combo.map((c) => c.valId),
        combo_details: combo,
        images: [],
      };
    });

    setVariantsList(generated);
    setCurrentStep(2);
  };

  // ----------------------------------------------------
  // STEP 3: Save Variants & Proceed to Images (Step 4)
  // ----------------------------------------------------
  const handleSaveVariants = async () => {
    if (variantsList.length === 0) {
      toast.error('No variants configured to create.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdVariants = [];

      for (const variant of variantsList) {
        const payload = {
          organization_id: orgId,
          productId: createdProductId,
          branch_id: 1,
          sku: variant.sku,
          barcode: variant.barcode,
          variant_title: variant.variant_title,
          sales_price: parseFloat(variant.sales_price || 0),
          mrp: parseFloat(variant.mrp || 0),
          purchase_price: parseFloat(variant.purchase_price || 0),
          is_default: !!variant.is_default,
          weight: parseFloat(variant.weight || 0),
          dimensions: variant.dimensions || '',
          attribute_value_ids: variant.attribute_value_ids || [],
        };

        const res = await axiosInstance.post(API_ENDPOINTS.variantCreate(), payload);
        const createdData = res.data?.data || res.data;
        if (createdData && createdData.id) {
          createdVariants.push({
            ...variant,
            id: createdData.id,
            images: [],
          });
        }
      }

      setVariantsList(createdVariants);
      toast.success('All product variants registered! Proceed to upload media.');
      setCurrentStep(3);
    } catch (err) {
      console.error('Variant creation error:', err);
      toast.error('Error creating product variants. Please review SKU inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // STEP 4: Upload Variant Images
  // ----------------------------------------------------
  const handleUploadVariantImage = async (variantId, file) => {
    const variant = variantsList.find((v) => v.id === variantId);
    if (!variant) return false;

    const isPrimary = (variant.images || []).length === 0;
    const sortOrder = (variant.images || []).length + 1;

    const formData = new FormData();
    formData.append('organization_id', orgId);
    formData.append('variant_id', variantId);
    formData.append('image', file);
    formData.append('is_primary', isPrimary ? 'true' : 'false');
    formData.append('sort_order', String(sortOrder));

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.variantImageUpload(), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.status === 1000 || res.data?.status_code === 1000 || res.status === 201) {
        toast.success(`Image uploaded for ${variant.sku || variant.variant_title}`);
        const uploadedImg = res.data?.data;
        if (uploadedImg) {
          const imgUrl = uploadedImg.image
            ? (uploadedImg.image.startsWith('http') ? uploadedImg.image : baseUrl + uploadedImg.image)
            : '';
          setVariantsList((prev) =>
            prev.map((v) =>
              v.id === variantId
                ? {
                    ...v,
                    images: [
                      ...(v.images || []),
                      {
                        uid: uploadedImg.id || Math.random().toString(),
                        name: 'variant_img',
                        status: 'done',
                        url: imgUrl,
                      },
                    ],
                  }
                : v
            )
          );
        }
      } else {
        toast.error(res.data?.message || 'Failed to upload variant image');
      }
    } catch (err) {
      console.error('Variant image upload error:', err);
      toast.error('Image upload failed');
    }
    return false;
  };

  if (loader) {
    return (
      <div className="p-6 sm:p-8 bg-slate-50 min-h-screen">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  // Calculate total combinations preview
  const validAttrsForPreview = selectedAttributes.filter((a) => a.attribute_id && a.selected_values?.length > 0);
  const totalCombinationsCount = validAttrsForPreview.reduce((acc, a) => acc * (a.selected_values.length || 1), validAttrsForPreview.length ? 1 : 0);

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-900">
      <Card
        style={{
          background: '#ffffff',
          borderColor: '#e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Title */}
        <Flex justify="space-between" align="center" className="mb-6">
          <div>
            <Title level={3} style={{ margin: 0, color: '#0f172a' }}>
              Create Product & Catalog SKUs
            </Title>
            <Text style={{ color: '#64748b' }}>
              Configure master details, variant matrix, individual pricing, and SKU media
            </Text>
          </div>
          <Button onClick={() => router.push('/admin/products')} icon={<ArrowLeftOutlined />}>
            Cancel
          </Button>
        </Flex>

        {/* 4-Step Navigation */}
        <Steps
          current={currentStep}
          items={[
            { title: '1. Basic Details', icon: <ShoppingOutlined /> },
            { title: '2. Attributes & Values', icon: <TagsOutlined /> },
            { title: '3. Variants & Pricing', icon: <AppstoreOutlined /> },
            { title: '4. Variant Media', icon: <PictureOutlined /> },
          ]}
          className="!mb-8"
        />

        <Divider style={{ borderColor: '#e2e8f0' }} />

        {/* ============================================================ */}
        {/* STEP 1: BASIC DETAILS                                        */}
        {/* ============================================================ */}
        {currentStep === 0 && (
          <Form form={form} layout="vertical" onFinish={handleSaveBaseProduct}>
            <Title level={5} className="!mb-4 text-slate-800">
              General Information
            </Title>
            <Row gutter={16}>
              <Col xs={24} md={14}>
                <Form.Item
                  label="Product Title / Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter product name' }]}
                >
                  <Input size="large" placeholder="e.g. Classic Cotton Crewneck T-Shirt" />
                </Form.Item>
              </Col>
              <Col xs={24} md={10}>
                <Form.Item
                  label="Product Code / SKU Prefix"
                  name="product_code"
                  rules={[{ required: true, message: 'Please enter product code' }]}
                >
                  <Input size="large" placeholder="e.g. PRD-1001" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="!mt-4 !mb-4 text-slate-800">
              Classification & Master Data
            </Title>
            <Row gutter={16}>
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
                          Create Category
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
                          Create Brand
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
                <Form.Item label="Unit" name="unit">
                  <Select size="large">
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
                  <Select size="large">
                    {taxes.map((t) => (
                      <Option key={t.id} value={t.id}>
                        {t.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="!mt-4 !mb-4 text-slate-800">
              Base Pricing & Identifiers
            </Title>
            <Row gutter={16}>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="Cost Price (₹)" name="purchase_price">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="Default Sales Price (₹)" name="sale_price">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Form.Item label="MRP (₹)" name="mrp">
                  <InputNumber size="large" style={{ width: '100%' }} prefix="₹" min={0} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="HSN / SAC Code" name="hsn_code">
                  <Input size="large" placeholder="e.g. 610910" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Barcode" name="bar_code">
                  <Input size="large" placeholder="e.g. 8901234567890" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Enter overview of this product catalog item..." />
            </Form.Item>

            <div className="p-4 bg-slate-100 rounded-lg mb-6 flex justify-between items-center border border-slate-200">
              <div>
                <Text strong className="!block text-slate-900">Configure Multi-SKU Variants?</Text>
                <Text type="secondary" className="!text-xs">
                  Enable if this product has multiple variations (e.g. different Colors, Sizes, Materials)
                </Text>
              </div>
              <Switch checked={hasVariants} onChange={(val) => setHasVariants(val)} />
            </div>

            <Flex justify="end">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isSubmitting}
                icon={hasVariants ? <ArrowRightOutlined /> : <CheckCircleOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098', borderRadius: '0.5rem' }}
              >
                {hasVariants ? 'Save & Configure Attributes Matrix' : 'Save Base Product'}
              </Button>
            </Flex>
          </Form>
        )}

        {/* ============================================================ */}
        {/* STEP 2: ATTRIBUTES & VALUES (SELECT LIBRARY / CREATE INLINE) */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div>
            <Flex justify="space-between" align="center" className="mb-4">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Step 2: Variant Attributes & Values
                </Title>
                <Text type="secondary" className="text-xs">
                  Select existing attributes from your organization library or type new options to create them inline.
                </Text>
              </div>
              {totalCombinationsCount > 0 && (
                <Tag color="cyan" className="text-sm font-semibold px-3 py-1">
                  Matrix: {validAttrsForPreview.length} Attributes ➔ {totalCombinationsCount} Variant SKUs
                </Tag>
              )}
            </Flex>

            <div className="space-y-4 mb-6">
              {selectedAttributes.map((row, index) => {
                const libraryAttr = libraryAttributes.find(
                  (a) => (row.attribute_id && a.id === row.attribute_id) || (row.name && a.name?.toLowerCase() === row.name?.toLowerCase())
                );
                const unselectedLibraryValues = (libraryAttr?.values || []).filter(
                  (lv) => !(row.selected_values || []).some((sv) => sv.id === lv.id || sv.value?.toLowerCase() === lv.value?.toLowerCase())
                );

                return (
                  <Card
                    key={index}
                    className="border border-slate-200 bg-slate-50/75 rounded-lg shadow-sm"
                    bodyStyle={{ padding: '16px' }}
                  >
                    <Row gutter={16} align="middle">
                      {/* 1. Attribute Selector / Creator */}
                      <Col xs={24} md={8}>
                        <Text strong className="block mb-1 text-slate-800">
                          Option Name
                        </Text>
                        <Select
                          showSearch
                          size="large"
                          placeholder="Select option (e.g. Color, Size)"
                          className="w-full"
                          value={libraryAttr?.id || row.attribute_id || undefined}
                          onChange={(val) => handleSelectOrCreateAttribute(index, val)}
                          filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={libraryAttributes.map((a) => ({
                            label: `${a.name} (${(a.values || []).length} library values)`,
                            value: a.id,
                          }))}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '8px 0' }} />
                              <div className="p-1">
                                <Button
                                  type="text"
                                  block
                                  icon={<PlusOutlined />}
                                  className="text-teal-600 font-medium hover:bg-teal-50 flex items-center justify-center gap-1.5"
                                  onClick={() => handleOpenCreateAttrModal(index)}
                                >
                                  Create New Attribute
                                </Button>
                              </div>
                            </>
                          )}
                        />
                      </Col>

                      {/* 2. Values Tag Matrix */}
                      <Col xs={24} md={14}>
                        <Text strong className="block mb-1 text-slate-800">
                          Option Values
                        </Text>
                        <Select
                          mode="tags"
                          size="large"
                          disabled={!libraryAttr && !row.attribute_id}
                          placeholder={
                            libraryAttr
                              ? `Select ${libraryAttr.name} values or type new & press Enter`
                              : 'Select an option name first'
                          }
                          className="w-full"
                          value={(row.selected_values || []).map((v) => v.value)}
                          onChange={(vals) => handleSelectOrCreateValues(index, vals)}
                          options={(libraryAttr?.values || []).map((lv) => ({
                            label: (
                              <div className="flex items-center gap-2">
                                {lv.color_code && (
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/25 inline-block"
                                    style={{ backgroundColor: lv.color_code }}
                                  />
                                )}
                                <span>{lv.value}</span>
                              </div>
                            ),
                            value: lv.value,
                          }))}
                          filterOption={(input, option) =>
                            (option?.value || '').toLowerCase().includes(input.toLowerCase())
                          }
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              <Divider style={{ margin: '8px 0' }} />
                              <div className="p-1">
                                <Button
                                  type="text"
                                  block
                                  icon={<PlusOutlined />}
                                  className="text-teal-600 font-medium hover:bg-teal-50 flex items-center justify-center gap-1.5"
                                  onClick={() => handleOpenCreateValueModal(index)}
                                >
                                  Create New Value for {libraryAttr?.name || row.name || 'Attribute'}
                                </Button>
                              </div>
                            </>
                          )}
                        />
                      </Col>

                      {/* Remove Option Button */}
                      <Col xs={24} md={2} className="text-right">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            setSelectedAttributes((prev) => prev.filter((_, i) => i !== index))
                          }
                        />
                      </Col>
                    </Row>

                    {/* Quick-Pick Chips from Library Values */}
                    {unselectedLibraryValues.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-2 flex-wrap">
                        <Text type="secondary" className="text-xs font-medium">
                          Quick add from library:
                        </Text>
                        {unselectedLibraryValues.map((lv) => (
                          <Tag
                            key={lv.id}
                            className="cursor-pointer hover:border-teal-500 hover:text-teal-700 bg-white border-slate-300 flex items-center gap-1.5 py-0.5 px-2 transition-colors"
                            onClick={() => handleQuickAddLibraryValue(index, lv)}
                          >
                            {(lv.color_code || (libraryAttr?.display_type || row.display_type) === 'color') && (
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                                style={{ backgroundColor: lv.color_code || detectColorHex(lv.value) }}
                              />
                            )}
                            <span className="font-medium text-xs">{lv.value}</span>
                            <PlusOutlined style={{ fontSize: 9 }} />
                          </Tag>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}

              <Button
                type="dashed"
                block
                size="large"
                icon={<PlusOutlined />}
                onClick={() =>
                  setSelectedAttributes((prev) => [
                    ...prev,
                    { attribute_id: null, name: '', display_type: 'button', selected_values: [] },
                  ])
                }
              >
                Add Another Option (e.g. Size, Material)
              </Button>
            </div>

            <Flex justify="space-between">
              <Button onClick={() => setCurrentStep(0)} icon={<ArrowLeftOutlined />}>
                Back to Details
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                onClick={handleProceedToVariantsStep}
              >
                Next: Configure SKU Matrix ({totalCombinationsCount} Variants)
              </Button>
            </Flex>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: CONFIGURE VARIANTS & PRICING                         */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div>
            <Flex justify="space-between" align="center" className="mb-4">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Step 3: Review SKUs, Pricing & Defaults
                </Title>
                <Text type="secondary" className="text-xs">
                  Confirm generated SKU identifiers, adjust specific variant prices, and choose default variant
                </Text>
              </div>
              <Tag color="geekblue" className="font-medium">
                {variantsList.length} Total SKUs
              </Tag>
            </Flex>

            <div className="space-y-3 mb-6">
              {variantsList.map((variant, vIdx) => (
                <Card
                  key={vIdx}
                  size="small"
                  className="border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <Flex justify="space-between" align="center" className="mb-3">
                    <Space size="middle">
                      <Badge
                        status={variant.is_default ? 'success' : 'default'}
                        text={<Text strong className="text-base text-slate-800">{variant.variant_title}</Text>}
                      />
                      <Space size={[4, 4]}>
                        {(variant.combo_details || []).map((c, ci) => (
                          <Tag key={ci} color="blue" className="text-xs font-mono">
                            {c.attrName}: {c.valName}
                          </Tag>
                        ))}
                      </Space>
                    </Space>

                    <Switch
                      checkedChildren="Default SKU"
                      unCheckedChildren="Variant"
                      checked={variant.is_default}
                      onChange={(checked) => {
                        setVariantsList((prev) =>
                          prev.map((v, i) => ({ ...v, is_default: i === vIdx ? checked : false }))
                        );
                      }}
                    />
                  </Flex>

                  <Row gutter={12}>
                    <Col xs={24} md={6}>
                      <Form.Item label="SKU Code" className="!mb-1">
                        <Input
                          value={variant.sku}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariantsList((prev) =>
                              prev.map((v, i) => (i === vIdx ? { ...v, sku: val } : v))
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="Sales Price (₹)" className="!mb-1">
                        <InputNumber
                          style={{ width: '100%' }}
                          prefix="₹"
                          value={variant.sales_price}
                          onChange={(val) => {
                            setVariantsList((prev) =>
                              prev.map((v, i) => (i === vIdx ? { ...v, sales_price: val } : v))
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="MRP (₹)" className="!mb-1">
                        <InputNumber
                          style={{ width: '100%' }}
                          prefix="₹"
                          value={variant.mrp}
                          onChange={(val) => {
                            setVariantsList((prev) =>
                              prev.map((v, i) => (i === vIdx ? { ...v, mrp: val } : v))
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item label="Purchase Price (₹)" className="!mb-1">
                        <InputNumber
                          style={{ width: '100%' }}
                          prefix="₹"
                          value={variant.purchase_price}
                          onChange={(val) => {
                            setVariantsList((prev) =>
                              prev.map((v, i) => (i === vIdx ? { ...v, purchase_price: val } : v))
                            );
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>

            <Flex justify="space-between">
              <Button onClick={() => setCurrentStep(1)} icon={<ArrowLeftOutlined />}>
                Back to Attributes
              </Button>
              <Button
                type="primary"
                size="large"
                loading={isSubmitting}
                icon={<ArrowRightOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                onClick={handleSaveVariants}
              >
                Save Variants & Upload Images
              </Button>
            </Flex>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: VARIANT & CATALOG MEDIA                              */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div>
            <Flex justify="space-between" align="center" className="mb-4">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Step 4: Upload Variant Media & Photos
                </Title>
                <Text type="secondary" className="text-xs">
                  Attach specific photographs and swatches to each variant SKU
                </Text>
              </div>
              <Tag color="success" className="font-semibold text-xs px-3 py-1">
                ✓ Base Product & Variants Created
              </Tag>
            </Flex>

            <Row gutter={[16, 16]} className="mb-8">
              {variantsList.map((variant) => (
                <Col xs={24} md={12} key={variant.id}>
                  <Card
                    size="small"
                    className="border border-slate-200 rounded-lg shadow-sm"
                    title={
                      <Flex justify="space-between" align="center">
                        <Space>
                          <Text strong className="text-slate-800">{variant.variant_title}</Text>
                          <Tag color="cyan" className="font-mono text-xs">{variant.sku}</Tag>
                        </Space>
                        <Text strong className="text-sky-700">₹{variant.sales_price}</Text>
                      </Flex>
                    }
                  >
                    <ImgCrop rotationSlider aspect={1 / 1}>
                      <Upload
                        listType="picture-card"
                        fileList={variant.images || []}
                        beforeUpload={(file) => handleUploadVariantImage(variant.id, file)}
                        showUploadList={{ showRemoveIcon: false }}
                      >
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }} className="text-xs">Upload Photo</div>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Card>
                </Col>
              ))}
            </Row>

            <Flex justify="end">
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
                onClick={() => {
                  toast.success('Catalog creation finished successfully!');
                  router.push('/admin/products');
                }}
              >
                Complete & View Products Catalog
              </Button>
            </Flex>
          </div>
        )}
      </Card>

      {/* Master Data Creation Modals */}
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

      {/* Create New Attribute Modal */}
      <Modal
        title="Create New Attribute"
        open={isAttrModalOpen}
        onCancel={() => {
          setIsAttrModalOpen(false);
          attrModalForm.resetFields();
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={attrModalForm}
          layout="vertical"
          onFinish={handleCreateAttributeSubmit}
          initialValues={{ display_type: 'button' }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Attribute Name"
            rules={[{ required: true, message: 'Please enter attribute name (e.g. Color, Size, Material)' }]}
          >
            <Input placeholder="e.g. Color, Size, Material, Storage" size="large" autoFocus />
          </Form.Item>

          <Form.Item
            name="display_type"
            label="Display Style"
            rules={[{ required: true, message: 'Please select display style' }]}
            tooltip="Controls how options are rendered to customers on storefront"
          >
            <Select size="large">
              <Option value="button">Button / Pill (Default)</Option>
              <Option value="color">Color Swatch</Option>
              <Option value="select">Dropdown Menu</Option>
            </Select>
          </Form.Item>

          <Divider style={{ margin: '16px 0' }} />

          <Flex justify="end" gap="middle">
            <Button
              onClick={() => {
                setIsAttrModalOpen(false);
                attrModalForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingAttribute}
              style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
            >
              Create Attribute
            </Button>
          </Flex>
        </Form>
      </Modal>

      {/* Create New Attribute Value Modal */}
      <Modal
        title={(() => {
          if (valueModalTargetRowIndex === null) return 'Create New Option Value';
          const row = selectedAttributes[valueModalTargetRowIndex];
          return `Create New Value for ${row?.name || 'Attribute'}`;
        })()}
        open={isValueModalOpen}
        onCancel={() => {
          setIsValueModalOpen(false);
          valueModalForm.resetFields();
        }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          form={valueModalForm}
          layout="vertical"
          onFinish={handleCreateValueSubmit}
          initialValues={{ sort_order: 1, color_code: '#1BA098' }}
          className="mt-4"
        >
          <Form.Item
            name="value"
            label="Option Value"
            rules={[{ required: true, message: 'Please enter option value (e.g. Red, XL, 64GB)' }]}
          >
            <Input placeholder="e.g. Red, XL, 64GB, Cotton" size="large" autoFocus />
          </Form.Item>

          {(() => {
            const targetRow = valueModalTargetRowIndex !== null ? selectedAttributes[valueModalTargetRowIndex] : null;
            const targetLibraryAttr = targetRow ? libraryAttributes.find(
              (a) => (targetRow.attribute_id && a.id === targetRow.attribute_id) || (targetRow.name && a.name?.toLowerCase() === targetRow.name?.toLowerCase())
            ) : null;
            const isColorAttr = (targetRow?.display_type === 'color' || targetLibraryAttr?.display_type === 'color' || (targetRow?.name && targetRow.name.toLowerCase().includes('color')));

            return (
              <Row gutter={16}>
                {isColorAttr && (
                  <Col span={14}>
                    <Form.Item
                      name="color_code"
                      label="Color Hex Code"
                      tooltip="Used for Color Swatches on Storefront (e.g. #FF0000)"
                    >
                      <div className="flex items-center gap-2">
                        <Input placeholder="e.g. #FF0000 or #1BA098" size="large" />
                        <Form.Item name="color_code" noStyle>
                          <input
                            type="color"
                            className="w-10 h-10 p-0.5 border border-slate-300 rounded cursor-pointer shrink-0"
                            onChange={(e) => valueModalForm.setFieldsValue({ color_code: e.target.value })}
                          />
                        </Form.Item>
                      </div>
                    </Form.Item>
                  </Col>
                )}
                <Col span={isColorAttr ? 10 : 24}>
                  <Form.Item
                    name="sort_order"
                    label="Sort Order"
                    tooltip="Sequence order for listing option values"
                  >
                    <InputNumber min={0} className="w-full" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            );
          })()}

          <Divider style={{ margin: '16px 0' }} />

          <Flex justify="end" gap="middle">
            <Button
              onClick={() => {
                setIsValueModalOpen(false);
                valueModalForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreatingValue}
              style={{ backgroundColor: '#1BA098', borderColor: '#1BA098' }}
            >
              Create Value
            </Button>
          </Flex>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateProduct;