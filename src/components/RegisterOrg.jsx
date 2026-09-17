'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Steps 
} from 'antd';
import { 
  FiShoppingBag, 
  FiBriefcase,
  FiMapPin, 
  FiFileText, 
  FiPhone, 
  FiArrowRight, 
  FiArrowLeft, 
  FiCheck, 
  FiUploadCloud, 
  FiTrash2,
  FiTrendingUp,
  FiCpu,
  FiRepeat
} from 'react-icons/fi';
import { DotzBaseUrl } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const { Option } = Select;

const taxTypes = [
  { name: 'None', id: 4 },
  { name: 'GSTIN', id: 1 }, 
  { name: 'Value Added Tax (VAT)', id: 2 },
  { name: 'Other', id: 3 }
];

const orgTypes = [
  { 
    id: 'TRADING', 
    title: 'Trading & Retail',
    badge: 'Buy & Sell',
    name: 'Trading & Retail',
    desc: 'For shops, wholesalers, and e-commerce stores purchasing finished items to resell.',
    icon: FiTrendingUp,
    color: 'text-blue-600 bg-blue-50 border-blue-100'
  },
  { 
    id: 'MANUFACTURING', 
    title: 'Manufacturing',
    badge: 'Production',
    name: 'Manufacturing',
    desc: 'For factories, workshops, and brands crafting goods directly from raw materials.',
    icon: FiCpu,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  },
  { 
    id: 'TRADING_MANUFACTURING', 
    title: 'Hybrid (Mfg + Trade)',
    badge: 'Hybrid',
    name: 'Both Mfg & Trade',
    desc: 'For businesses that produce in-house as well as trade third-party merchandise.',
    icon: FiRepeat,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
  },
  { 
    id: 'SERVICE', 
    title: 'Service Provider',
    badge: 'Services',
    name: 'Services',
    desc: 'For agencies, consultants, and professionals delivering non-physical services.',
    icon: FiBriefcase,
    color: 'text-amber-600 bg-amber-50 border-amber-100'
  }
];

const stepFields = [
  ['organization_name', 'shop_name'],
  ['org_type'],
  ['country', 'state'],
  ['tax_type'],
  ['email', 'phoneNumber']
];

export default function RegisterOrg({ isModalVisible, setIsModalVisible }) {
  const router = useRouter();
  const { user } = useUser();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const fileInputRef = useRef(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTaxType, setSelectedTaxType] = useState(4); // Default to None

  const selectedOrgType = Form.useWatch('org_type', form);
  const formValues = Form.useWatch([], form);

  // Real-time step validation checking
  const checkIsStepValid = () => {
    if (!formValues) return false;

    if (currentStep === 0) {
      const orgNameValid = !!formValues.organization_name?.trim();
      const shopNameValid = 
        !!formValues.shop_name?.trim() && 
        /^[a-zA-Z0-9_-]+$/.test(formValues.shop_name);
      return orgNameValid && shopNameValid;
    }

    if (currentStep === 1) {
      return !!formValues.org_type;
    }

    if (currentStep === 2) {
      return !!formValues.country && !!formValues.state;
    }

    if (currentStep === 3) {
      const taxTypeValid = formValues.tax_type !== undefined && formValues.tax_type !== null;
      if (formValues.tax_type !== 4) {
        return taxTypeValid && !!formValues.taxNumber?.trim();
      }
      return taxTypeValid;
    }

    if (currentStep === 4) {
      if (formValues.email?.trim()) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
      }
      return true;
    }

    return true;
  };

  const isStepValid = checkIsStepValid();

  // Fetch Countries & States
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${DotzBaseUrl}/v1/main/list_country/`);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await fetch(`${DotzBaseUrl}/v1/main/list_state/`);
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchCountries();
    fetchStates();
  }, []);

  // Auto-fill Contact Email/Phone from UserContext when modal opens
  useEffect(() => {
    if (isModalVisible && user) {
      const currentEmail = form.getFieldValue('email');
      const currentPhone = form.getFieldValue('phoneNumber');
      
      if (!currentEmail && user.email) {
        form.setFieldsValue({ email: user.email });
      }
      if (!currentPhone && (user.phoneNumber || user.phone)) {
        form.setFieldsValue({ phoneNumber: user.phoneNumber || user.phone });
      }
    }
  }, [isModalVisible, user, form]);

  // Filter States when Country changes
  useEffect(() => {
    if (selectedCountry) {
      const filtered = states.filter(state => state.country === selectedCountry);
      setSelectedStates(filtered);
    } else {
      setSelectedStates([]);
    }
  }, [states, selectedCountry]);

  const slugify = (text) => {
    return (text || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-alphanumeric chars with hyphen
      .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
  };

  const handleOrgNameChange = (e) => {
    const orgName = e.target.value;
    if (!isSlugTouched) {
      const generatedSlug = slugify(orgName);
      form.setFieldsValue({ shop_name: generatedSlug });
    }
  };

  const handleCountryChange = (val) => {
    setSelectedCountry(val);
    form.setFieldsValue({ state: undefined });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = (e) => {
    if (e) e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateShopName = (_, value) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (value && !regex.test(value)) {
      return Promise.reject(
        'Unique name can only include letters, numbers, underscores (_), and hyphens (-).'
      );
    }
    return Promise.resolve();
  };

  // Step Navigation Validation
  const handleNext = async () => {
    try {
      const currentFieldsToValidate = stepFields[currentStep];
      if (currentFieldsToValidate && currentFieldsToValidate.length > 0) {
        await form.validateFields(currentFieldsToValidate);
      }
      setCurrentStep(prev => prev + 1);
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setIsSlugTouched(false);
  };

  // Final Submission
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue(true);
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', formValues.organization_name?.trim() ?? '');
      formData.append('s_name', formValues.shop_name?.trim() ?? '');
      formData.append('shopname', formValues.shop_name?.trim() ?? '');
      formData.append('tax_type', formValues.tax_type ?? '');
      formData.append('tax_number', formValues.taxNumber?.trim() ?? '');
      formData.append('edition', formValues.edition ?? 0);
      formData.append('state', formValues.state ?? '');
      formData.append('phone_number', (formValues.phoneNumber || user?.phone_number || user?.phone || '').toString().trim());
      formData.append('email', (formValues.email || user?.email || '').toString().trim());
      formData.append('website', formValues.website?.trim() ?? '');
      formData.append('crn_number', formValues.crn_number?.trim() ?? '');
      formData.append('building', formValues.building?.trim() ?? '');
      formData.append('city', formValues.city?.trim() ?? '');
      formData.append('street', formValues.street?.trim() ?? '');
      formData.append('pin', formValues.pin?.trim() ?? '');
      formData.append('org_type_code', formValues.org_type ?? '');

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await axiosInstance.post(
        `${DotzBaseUrl}/v1/organization/organizations/`,
        formData
      );

      const isSuccess =
        response.data?.status === 1000 ||
        response.data?.status_code === 1000 ||
        response.status === 201 ||
        response.status === 200;

      if (isSuccess) {
        const createdOrg = response.data?.data;
        if (createdOrg) {
          localStorage.setItem('organizationDetails', JSON.stringify(createdOrg));
        }

        toast.success(response.data?.message || 'Organization registered successfully!');
        setIsModalVisible(false);
        form.resetFields();
        setLogoFile(null);
        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
          setLogoPreview(null);
        }
        setCurrentStep(0);
        setIsSlugTouched(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        router.push('/admin');
      } else {
        const errorMsg = response.data?.error || response.data?.message || 'Registration failed';
        toast.error(errorMsg);
      }
    } catch (error) {
      if (error?.errorFields && error.errorFields.length > 0) {
        const firstErrorField = error.errorFields[0].name[0];
        const stepIndex = stepFields.findIndex((fields) => fields.includes(firstErrorField));
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
        }
        toast.error('Please complete all required fields correctly.');
      } else {
        console.error('Error registering organization:', error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong! Please check the fields and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsItems = [
    {
      title: 'Profile',
      icon: <FiShoppingBag className="w-4 h-4" />
    },
    {
      title: 'Business Model',
      icon: <FiBriefcase className="w-4 h-4" />
    },
    {
      title: 'Address',
      icon: <FiMapPin className="w-4 h-4" />
    },
    {
      title: 'Tax & Legal',
      icon: <FiFileText className="w-4 h-4" />
    },
    {
      title: 'Review',
      icon: <FiPhone className="w-4 h-4" />
    }
  ];

  const currentValues = form.getFieldsValue(true);

  return (
    <Modal
      title={
        <div className="py-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Register Your Organization</h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Complete the multi-step form to launch your dedicated storefront
          </p>
        </div>
      }
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      centered
      width={820}
      className="rounded-3xl overflow-hidden"
    >
      <div className="pt-1 pb-2">
        
        {/* Stepper Header */}
        <div className="bg-slate-50/80 rounded-2xl p-3 mb-4 border border-slate-100">
          <Steps 
            current={currentStep} 
            items={stepsItems}
            size="small"
            responsive
          />
        </div>

        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            tax_type: 4
          }}
          className="px-1"
        >

          {/* STEP 0: GENERAL PROFILE */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Organization Identity</h3>
                <p className="text-xs text-slate-400">Enter basic branding and shop handle information</p>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="organization_name"
                    label={<span className="text-xs font-semibold text-slate-700">Organization Name</span>}
                    rules={[{ required: true, message: 'Please enter organization name' }]}
                  >
                    <Input 
                      placeholder="e.g. Acme Retail Store" 
                      size="large" 
                      className="rounded-xl" 
                      onChange={handleOrgNameChange}
                    />
                  </Form.Item>

                  <Form.Item
                    name="shop_name"
                    label={<span className="text-xs font-semibold text-slate-700">Store URL Slug</span>}
                    tooltip="Custom path identifier. e.g. eshop.nfour.com/in/shop-name"
                    rules={[
                      { required: true, message: 'Please enter unique shop handle' },
                      { validator: validateShopName }
                    ]}
                  >
                    <Input 
                      addonBefore="eshop.nfour.com/in/" 
                      placeholder="acme-store" 
                      size="large" 
                      className="rounded-xl" 
                      onChange={(e) => {
                        if (!e.target.value.trim()) {
                          setIsSlugTouched(false);
                        } else {
                          setIsSlugTouched(true);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item 
                    label={<span className="text-xs font-semibold text-slate-700">Brand Logo</span>}
                  >
                    <div 
                      onClick={() => {
                        if (!logoPreview) {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-300 transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer group"
                    >
                      {logoPreview ? (
                        <div className="relative group/logo">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-20 h-20 object-contain rounded-xl shadow-xs bg-white p-1" 
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors"
                            title="Remove logo"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center w-full py-1 pointer-events-none">
                          <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600 mb-2 group-hover:scale-110 transition-transform">
                            <FiUploadCloud className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">Upload Image</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* STEP 1: DEDICATED BUSINESS TYPE & MODEL SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in-50 duration-200">
              <div className="border-b border-slate-100 pb-2 mb-3">
                <h3 className="text-sm font-bold text-slate-800">Business Model & Operations</h3>
                <p className="text-xs text-slate-400">Select how your organization produces, trades, or serves customers</p>
              </div>

              {/* Hidden Form Item for Validation */}
              <Form.Item
                name="org_type"
                rules={[{ required: true, message: 'Please select your organization business model' }]}
                className="hidden mb-0"
              >
                <input type="hidden" />
              </Form.Item>

              {/* Sleek Minimal 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {orgTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedOrgType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => form.setFieldValue('org_type', item.id)}
                      className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-500/20' 
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl ${item.color} border flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{item.title}</h4>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-indigo-600 bg-indigo-600' 
                                : 'border-slate-300 bg-white group-hover:border-slate-400'
                            }`}>
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed font-normal pl-0.5 mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS & LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Physical Location & Address</h3>
                <p className="text-xs text-slate-400">Specify your headquarters or primary fulfillment center</p>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="country"
                    label={<span className="text-xs font-semibold text-slate-700">Country</span>}
                    rules={[{ required: true, message: 'Please select country' }]}
                  >
                    <Select 
                      placeholder="Select Country" 
                      onChange={handleCountryChange} 
                      size="large"
                      className="rounded-xl"
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.id}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="state"
                    label={<span className="text-xs font-semibold text-slate-700">State / Province</span>}
                    rules={[{ required: true, message: 'Please select state' }]}
                  >
                    <Select 
                      placeholder="Select State" 
                      disabled={!selectedCountry || selectedStates.length === 0}
                      size="large"
                      className="rounded-xl"
                    >
                      {selectedStates.map((st) => (
                        <Option key={st.id} value={st.id}>
                          {st.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="city"
                    label={<span className="text-xs font-semibold text-slate-700">City / District</span>}
                  >
                    <Input placeholder="e.g. Mumbai, Bangalore" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="pin"
                    label={<span className="text-xs font-semibold text-slate-700">Postal / PIN Code</span>}
                  >
                    <Input placeholder="e.g. 560001" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="building"
                    label={<span className="text-xs font-semibold text-slate-700">Building / Suite No.</span>}
                  >
                    <Input placeholder="e.g. Suite 402, Matrix Tower" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="street"
                    label={<span className="text-xs font-semibold text-slate-700">Street / Area Landmark</span>}
                  >
                    <Input placeholder="e.g. MG Road, Near Metro" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* STEP 3: TAX & LEGAL */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Tax & Regulatory Information</h3>
                <p className="text-xs text-slate-400">Configure compliant invoicing and business registration numbers</p>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="tax_type"
                    label={<span className="text-xs font-semibold text-slate-700">Tax Registration Type</span>}
                    rules={[{ required: true, message: 'Please select tax type' }]}
                  >
                    <Select 
                      placeholder="Select Tax Type" 
                      onChange={(val) => setSelectedTaxType(val)}
                      size="large"
                      className="rounded-xl"
                    >
                      {taxTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="taxNumber"
                    label={<span className="text-xs font-semibold text-slate-700">Tax / GSTIN Number</span>}
                    rules={[
                      { 
                        required: selectedTaxType !== 4 && selectedTaxType !== undefined, 
                        message: 'Please enter tax number' 
                      }
                    ]}
                  >
                    <Input 
                      placeholder={selectedTaxType === 4 ? 'Not Applicable' : 'Enter Tax Number'} 
                      disabled={selectedTaxType === 4}
                      size="large"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="crn_number"
                    label={<span className="text-xs font-semibold text-slate-700">Company Registration (CRN / CIN)</span>}
                  >
                    <Input placeholder="e.g. U72200KA2024PTC123456" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="website"
                    label={<span className="text-xs font-semibold text-slate-700">Official Website</span>}
                  >
                    <Input placeholder="https://www.yourdomain.com" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* STEP 4: CONTACT & REVIEW */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-800">Contact Details & Final Review</h3>
                <p className="text-xs text-slate-400">Verify your details before creating your organization storefront</p>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label={
                      <span className="text-xs font-semibold text-slate-700">
                        Official Contact Email <span className="text-slate-400 font-normal">(Optional)</span>
                      </span>
                    }
                    rules={[
                      { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                  >
                    <Input placeholder={user?.email || "store@yourdomain.com"} size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phoneNumber"
                    label={
                      <span className="text-xs font-semibold text-slate-700">
                        Support Phone / WhatsApp <span className="text-slate-400 font-normal">(Optional)</span>
                      </span>
                    }
                  >
                    <Input addonBefore="+91" placeholder="9876543210" size="large" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Summary Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mt-2 space-y-2.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Registration Summary</div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Organization:</span>
                    <span className="font-semibold text-slate-800">{currentValues.organization_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Handle / Slug:</span>
                    <span className="font-semibold text-indigo-600 font-mono">/in/{currentValues.shop_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Business Model:</span>
                    <span className="font-semibold text-slate-800">
                      {orgTypes.find(o => o.id === currentValues.org_type)?.title || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tax Type:</span>
                    <span className="font-semibold text-slate-800">
                      {taxTypes.find(t => t.id === currentValues.tax_type)?.name || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">City / Location:</span>
                    <span className="font-semibold text-slate-800">{currentValues.city || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email:</span>
                    <span className="font-semibold text-slate-800">{currentValues.email || user?.email || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM STEP CONTROLS */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <div>
              {currentStep > 0 && (
                <Button 
                  onClick={handlePrev}
                  className="rounded-xl text-xs font-semibold flex items-center gap-1.5 h-10 px-4"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <Button 
                onClick={handleCancel}
                className="rounded-xl text-xs font-semibold h-10 px-4"
              >
                Cancel
              </Button>

              {currentStep < 4 ? (
                <Button 
                  type="primary" 
                  onClick={handleNext}
                  disabled={!isStepValid}
                  className={`rounded-xl text-xs font-semibold flex items-center gap-1.5 h-10 px-5 transition-all ${
                    isStepValid 
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xs' 
                      : 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <span>Next Step</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={!isStepValid}
                  className={`rounded-xl text-xs font-bold flex items-center gap-1.5 h-10 px-6 transition-all ${
                    isStepValid 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' 
                      : 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <FiCheck className="w-4 h-4" />
                  <span>Register Organization</span>
                </Button>
              )}
            </div>
          </div>

        </Form>
      </div>
    </Modal>
  );
}