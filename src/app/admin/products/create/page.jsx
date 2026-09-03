'use client';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Row, Select, Skeleton, Space, Switch, Tabs, Tooltip, Typography, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import './style.css'
import toast from 'react-hot-toast';
import ImgCrop from 'antd-img-crop';
import { useRouter, useSearchParams } from 'next/navigation';
import { baseUrl, DotzBaseUrlV1 } from '@/utils/GlobalVariables';
import axiosInstance from '@/utils/axiosInstance';
// import useAxios from '../../utils/useAxios';
// import { useSelector } from 'react-redux';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { dotzURL } from '../../utils/apiConfig';
const { Title, Text } = Typography;


const CreateProduct = () => {
    // const api = useAxios()
    // const navigate = useNavigate()
    // const organizationDetails = useSelector(state => state.organization_details);
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));
    const [loader, setLoader] = useState(true)
    const router = useRouter()
    // const [searchParams, setSearchParams] = useSearchParams();
    // let { id } = useParams();
    // console.log("iddddddd===>",searchParams.get('id'));
    // const productId = searchParams.get('id')
    const searchParams = useSearchParams();
    
    const productId = searchParams.get('id');
    const [form] = Form.useForm();
    const [categoryForm] = Form.useForm();
    const [brandForm] = Form.useForm();
    const [unitForm] = Form.useForm();
    const [taxForm] = Form.useForm();
    
    const [state, setState] = useState([{
        isVariant: false,
        isSubVariant: false,
        isEdit: false,
        isPurchasePriceSpecific: false,
        isSalesPriceSpecific: false,
    }]);
    const [openCategory, setOpenCategory] = useState(false);
    const [openBrand, setOpenBrand] = useState(false);
    const [openUnit, setOpenUnit] = useState(false);
    const [openTax, setOpenTax] = useState(false);
    const [nav, setnav] = useState(false);

    const [categoryModalOpen, setCategoryModalOpen] = useState(false)
    const [brandModalOpen, setBrandModalOpen] = useState(false)
    const [unitModalOpen, setUnitModalOpen] = useState(false)
    const [taxModalOpen, setTaxModalOpen] = useState(false)

    const [product_category, setProduct_category] = useState([]);
    const [brand, setBrand] = useState([]);
    const [unit, setUnit] = useState([]);
    const [tax, setTax] = useState([]);
    const [stocks, setStocks] = useState([]);
    // const stocks = [
    //     {
    //         variant: 'Red',
    //         subVariant: 'XS',
    //         stock: 0,
    //     },
    //     {
    //         variant: 'Blue',
    //         subVariant: 'S',
    //         stock: 0,
    //     },
    // ]
    const onTabChange = (key) => {
        console.log(key);
        if(key === '4'){
            const variant_names = form.getFieldValue('variant_names');
            const sub_variant_names = form.getFieldValue('sub_variant_names');

            const result = [];
            console.log("variant_names: ", variant_names);
            console.log("sub_variant_names: ", sub_variant_names);

            variant_names.forEach(variant => {
            sub_variant_names.forEach(subVariant => {
                result.push({ variant: variant, subVariant: subVariant, stock: 0 });
            });
            });

            console.log("result: ", result);
            setStocks(result)
            if(variant_names?.length === 1 && variant_names[0] === '' || sub_variant_names?.length === 1 && sub_variant_names[0] === ''){
                toast.error('Please select at least one variant and one sub variant!');
            }
        }
      };

      const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };
      const [fileList, setFileList] = useState([]);
      const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
      const onImgChange = ({ fileList: newFileList }) => {
        console.log("newFileList==>",newFileList);
        setFileList(newFileList);
      };
      const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
        //   src = await new Promise((resolve) => {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file.originFileObj);
        //     reader.onload = () => resolve(reader.result);
        //   });
        console.log("!SRC");
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };

    const [initialValues, setInitialValues] = useState(
        {
            // "product_code":"",
            "is_active":true,
            "hsn_code": '',
            "is_sales": true,
            "available":["Sales","Purchase"],
            "type":["FinishedProduct"],
            "purchase_price_is_included":false,
            "sale_price_is_included":false,
            "variant_names": [''],
            "sub_variant_names": [''],
            "image_specific": 'non'
            // "tax":tax[0].id,
        }
    )

    const addCategory = () => {
        setOpenCategory(false)
        setCategoryModalOpen(true)
    }
    const addBrand = () => {
        setOpenBrand(false)
        setBrandModalOpen(true)
    }
    const addUnit = () => {
        setOpenUnit(false)
        setUnitModalOpen(true)
    }
    const addTax = () => {
        setOpenTax(false)
        setTaxModalOpen(true)
    }

    const createCategory = async (values) => {
        values.organization = organizationDetails.id
        console.log("values===>",values);
        const response = await axiosInstance.post(DotzBaseUrlV1+'/product/categories/',values)
        if (response.data.status === 1000){
            toast.success(response.data.message)
            setCategoryModalOpen(false)
            // setBrand({...initialValues, id:response.data.data, name:values.name})
            const newCategory = { id: response.data.data, name: values.category_name }
            setProduct_category((prevCategory) => [...prevCategory, newCategory])
            form.setFieldsValue({ product_category: newCategory.id })
            categoryForm.resetFields()
        }else if (response.data.status === 1001){
            toast.error(response.data.message)
        }
    }
    const createBrand = async (values) => {
        values.organization = organizationDetails.id
        const response = await axiosInstance.post(DotzBaseUrlV1+'/product/brands/',values)
        if (response.data.status === 1000){
            toast.success(response.data.message)
            setBrandModalOpen(false)
            // setBrand({...initialValues, id:response.data.data, name:values.name})
            const newBrand = { id: response.data.data, name: values.brand_name }
            setBrand((prevBrand) => [...prevBrand, newBrand])
            form.setFieldsValue({ brand: newBrand.id })
            brandForm.resetFields()
        }else if (response.data.status === 1001){
            toast.warning(response.data.message)
        }
    }
    const createUnit = async (values) => {
        values.organization = organizationDetails.id
        const response = await axiosInstance.post(DotzBaseUrlV1+'/product/units/',values)
        if (response.data.status === 1000){
            toast.success(response.data.message)
            setUnitModalOpen(false)
            // setUnit({...initialValues, id:response.data.data, name:values.name})
            const newUnit = { id: response.data.data, name: values.unit_name }
            setUnit((prevUnit) => [...prevUnit, newUnit])
            form.setFieldsValue({ unit: newUnit.id })
            unitForm.resetFields()
        }else if (response.data.status === 1001){
            toast.error(response.data.message)
        }
    }
    const createTax = async (values) => {
        values.organization = organizationDetails.id
        const response = await axiosInstance.post(DotzBaseUrlV1+'/product/taxes/',values)
        if (response.data.status === 1000){
            toast.success(response.data.message)
            setTaxModalOpen(false)
            // setTax({...initialValues, id:response.data.data, name:values.name})
            const newTax = { id: response.data.data, name: values.tax_name }
            setTax((prevTax) => [...prevTax, newTax])
            form.setFieldsValue({ tax: newTax.id })
            taxForm.resetFields()
        }else if (response.data.status === 1001){
            toast.error(response.data.message)
        }
    }
  
 
    const onFinish = async (values) => {
        console.log("values=====>: " + values);
        onSubmit(values);
        
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    
        // Extract and alert the first error message
        if (errorInfo && errorInfo.errorFields.length > 0) {
          const firstError = errorInfo.errorFields[0].errors[0];
          toast.error(firstError); // Show an alert with the first error message
        }
      };

      

    const onSubmit = async (values) => {
        let isValid = true;
        console.log("values=====>: " + values);
        console.log("variant_name=====>: " + values.variant_name);
        
        if (state.isVariant){
            if (values.variant_name === '' || values.variant_name === undefined){
                toast.error("Please enter a variant name")
                isValid = false
            }else if(values.variant_names === '' || values.variant_names === undefined){
                toast.error("Please enter atleast 1 varinat")
                isValid = false
            }
        }

        if (isValid) {
            let shouldNavigate = nav
            
            const formData = new FormData();
            // if (fileList[0]?.uid === '1'){
            //     formData.append('image','1')
            // }else{
            //     formData.append('image', fileList[0]?.originFileObj)
            // }
            fileList.forEach((file) => {
                if (file.name === 'product_image'){
                    formData.append('image', file.uid);
                }else{
                    formData.append('image', file?.originFileObj);
                }
              });
        
            formData.append('is_active', values.is_active);
            formData.append('name', values.name);
            formData.append('product_code', values.product_code);
            formData.append('product_category', values.product_category);
            formData.append('brand', values.brand);
            formData.append('hsn_code', values.hsn_code);
            formData.append('bar_code', values.bar_code);
            formData.append('unit', values.unit);
            formData.append('tax', values.tax);
            formData.append('purchase_price', values.purchase_price ?? 0);
            formData.append('purchase_price_is_included', values.purchase_price_is_included ?? false);
            formData.append('sale_price', values.sale_price ?? 0);
            formData.append('sale_price_is_included', values.sale_price_is_included ?? false);
            formData.append('original_price', values.original_price ?? 0);
            formData.append('mrp', values.mrp ?? 0);
            formData.append('display_name', values.display_name ?? '');
            formData.append('description', values.description ?? null);
            formData.append('image_specific', values.image_specific);
    
            formData.append('available', values.available);
            formData.append('product_type', values.type);  
            formData.append('organization', organizationDetails.id);

            if (state.isVariant){
                formData.append('variant_name', values.variant_name);
                formData.append('variant_names', values.variant_names)
            }
    
    
            // formData.append('image', values.image[0].originFileObj);
            // console.log("formData===>",formData);
              if (productId){
                formData.append('pk', productId);
              }
            // if (productId){
            //     formData.append('pk', productId);
            //     const response = await api.put('/api/v1/product/products/', formData, {
            //         headers: { 'Content-Type': 'multipart/form-data'}
            //     });
            // }else {
            //     const response = await api.post('/api/v1/product/products/', formData, {
            //         headers: { 'Content-Type': 'multipart/form-data'}
            //     });
            // }
            const response = productId ?
                await axiosInstance.put(DotzBaseUrlV1+'/product/products/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'}
                }) :
                await axiosInstance.post(DotzBaseUrlV1+'/product/products/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'}
                });
            // console.log("response===:",response);
            if (response.data.status === 1000){
                toast.success(response.data.message)
                
                if (shouldNavigate){
                    router.push('/admin/products')
                }else{
                form.resetFields()
                form.setFieldsValue({ product_code: undefined });
                setLoader(true)
                fetchInitial()
                }
    
            }else if (response.data.status === 1001){
                toast.error(response.data.message)
            }
            else{
                // message.error(response.data.message)
                toast.error(response.data.message);
            }

        }
    }


    const resetForm = () => {
        if (productId){
            // window.location.reload()
            router.push('/create-product')
        }
        // else{
            form.resetFields()
            form.setFieldsValue({ product_code: undefined });
            setLoader(true)
            fetchInitial()
        // }
    };

    const fetchInitial = async () => {
        console.log("====INITIAL===>");
        try {
            const response0 = await axiosInstance.get(`${DotzBaseUrlV1}/main/settings/${organizationDetails.id}/PRD`)
            const response1 = await axiosInstance.get(`${DotzBaseUrlV1}/main/generate-code/${organizationDetails.id}/PRD`)
            const response2 = await axiosInstance.get(`${DotzBaseUrlV1}/product/categories/${organizationDetails.id}`)
            const response3 = await axiosInstance.get(`${DotzBaseUrlV1}/product/brands/${organizationDetails.id}`)
            const response4 = await axiosInstance.get(`${DotzBaseUrlV1}/product/units/${organizationDetails.id}`)
            const response5 = await axiosInstance.get(`${DotzBaseUrlV1}/product/taxes/${organizationDetails.id}`)
            if (response0.data.status === 1000 && response1.data.status === 1000 && response2.data.status === 1000 && response3.data.status === 1000 && response4.data.status === 1000 && response5.data.status === 1000){
                console.log("response0.data.data===>",response0.data.data);
                const enable_variant = response0.data.data.find(item => item.name === 'enable_variant')
                setState((prev) => ({...prev, isVariant:enable_variant.value  === 'True' ? true : false}))
                setBrand(response3.data.data)
                setProduct_category(response2.data.data)
                setUnit(response4.data.data)
                setTax(response5.data.data)
                if (productId){
                    const response6 = await axiosInstance.get(`${DotzBaseUrlV1}/product/products/${organizationDetails.id}/${productId}`)
                    const result = response6.data.data
                    console.log("result==code==>",result);
                    setInitialValues({
                        ...initialValues,
                        product_code:result.product_code,
                        is_active:result.is_active,
                        name:result.name,
                        product_category:result.product_category,
                        brand:result.brand,
                        unit:result.unit,
                        tax:result.tax,
                        purchase_price:result.price_list.purchase_price,
                        purchase_price_is_included:result.purchase_price_is_included,
                        original_price:result.price_list.original_price,
                        sale_price:result.price_list.sales_price,
                        sale_price_is_included:result.sale_price_is_included,
                        mrp:result.price_list.mrp,
                        type:result.product_type,
                        available:result.available,
                        hsn_code:result.hsn_code,
                        bar_code:result.bar_code,
                        description:result.description,
                        variant_name:result?.variant_name,
                        variant_names:result?.variants,
                        // Image:result.Image,

                    })
                    if(result.images){
                        setFileList(result.images.map((image, index) => ({
                            uid: image.id,
                            name: 'product_image',
                            status: 'done',
                            url: baseUrl+image.url,
                        })))
                    }
                    // form.setFieldsValue({ product_code: response1.data.data });
                }else{

                    setInitialValues({
                        ...initialValues,
                        product_code:response1.data.data,
                        product_category:response2.data.data[0].id,
                        brand:response3.data.data[0].id,
                        unit:response4.data.data[0].id,
                        tax:response5.data.data[0].id,
                    })
                    form.setFieldsValue({ product_code: response1.data.data });
                }
                console.log("initialValues=000====>",initialValues);

                setLoader(false)
                
            }else{
                toast.error('Something went wrong!')
            }
        } catch (error) {
            console.log("error123: " + error);
        }
    }

    const formItemLayout = {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 4,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 20,
          },
        },
      };

      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 20,
            offset: 4,
          },
        },
      };
      const items = [
        {
          key: '1',
          label: 'Product',
          children: (
            <>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item
                    label="Product name"
                    name="name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input product name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Product Code" style={{marginBottom: 0,}}>
                    <Form.Item
                        name='product_code'
                        style={{
                        display: 'inline-block',
                        width: 'calc(80% - 12px)',
                        // width: '70%',
                        }}
                        rules={[
                            {
                            required: true,
                            message: 'Please input product code!',
                            },
                        ]}
                    >
                    <Input name='product_code' style={{color:'#000'}} readOnly/>
                    </Form.Item>
                    <span
                        style={{
                        display: 'inline-block',
                        width: '10px',
                        lineHeight: '32px',
                        textAlign: 'center',
                        }}
                    >
                        
                    </span>
                    <Form.Item
                        name='auto_product_code'
                        style={{
                        display: 'inline-block',
                        // width: '30%',
                        width: 'calc(20% - 12px)',
                        }}
                    >
                        <Switch name='auto_product_code' disabled checkedChildren="Auto" unCheckedChildren="Manual" defaultChecked  style={{width:'100px',}}/>
                    </Form.Item>
                </Form.Item>
                </Col>
                
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Product Category" name='product_category'  >
                <Select  
                open={openCategory}
                onDropdownVisibleChange={(visible) => setOpenCategory(visible)}
                dropdownRender={(menu) => (
                    <>
                    {menu}
                    <Divider
                        style={{
                        margin: '8px 0',
                        }}
                    />
                        <Button block type="text" icon={<PlusOutlined />}
                         onClick={addCategory}
                        >
                        Create New Category
                        </Button>
                    </>
                )}
                >
                    {product_category.map(item =>(
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                </Select>
                </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Brand" name='brand' >
                <Select 
                open={openBrand}
                onDropdownVisibleChange={(visible) => setOpenBrand(visible)}

                dropdownRender={(menu) => (
                    <>
                    {menu}
                    <Divider
                        style={{
                        margin: '8px 0',
                        }}
                    />
                        <Button block type="text" icon={<PlusOutlined />}
                         onClick={addBrand}
                        >
                        Create New Brand
                        </Button>
                    </>
                )}
                >   
                    {brand.map(item =>(
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                </Select>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="HSN/SAC Code" name='hsn_code' >
                        <Input placeholder='1234567'/>
                </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Bar Code" name='bar_code' >
                        <Space.Compact
                        style={{
                            width: '100%',
                        }}
                        >
                        <Input placeholder='1234567' />
                        <Button >Generate</Button>
                        </Space.Compact>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                   <Form.Item name="unit" label="Unit">
                        <Select 
                            open={openUnit}
                            onDropdownVisibleChange={(visible) => setOpenUnit(visible)}            
                            dropdownRender={(menu) => (
                                <>
                                {menu}
                                <Divider style={{margin: '8px 0'}} />
                                    <Button block type="text" icon={<PlusOutlined />}
                                     onClick={addUnit}
                                    >
                                    Create New Unit
                                    </Button>
                                </>
                            )}
                            style={{
                                width: '100%',
                            }}
                            >
                            {unit.map(item => (
                            <Select.Option key={item.id} value={item.id}>
                            {item.name}
                            </Select.Option>
                        ))}
                        </Select>
                        
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Tax" name='tax' >
                <Select 
                open={openTax}
                onDropdownVisibleChange={(visible) => setOpenTax(visible)} 
                dropdownRender={(menu) => (
                    <>
                    {menu}
                    <Divider
                        style={{
                        margin: '8px 0',
                        }}
                    />
                        <Button block type="text" icon={<PlusOutlined />}
                         onClick={addTax}
                        >
                        Create New Tax
                        </Button>
                    </>
                )}
                >
                    {tax.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))}
                </Select>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Purchase Price" name='purchase_price' >
                <InputNumber
                        addonAfter={<Checkbox disabled> <Tooltip title="Specific based on variant or sub variant">Specific</Tooltip></Checkbox>}
                        style={{ width: '100%', }}
                        />
                </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Sales Price" name='sale_price' >
                <InputNumber
                        addonAfter={<Checkbox disabled> Specific</Checkbox>}
                        style={{ width: '100%', }}
                        />
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item  name="original_price" label="Minimum Sales Price" >
                        <InputNumber
                        addonAfter={<Checkbox disabled> Specific</Checkbox>}
                        style={{ width: '100%', }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item  name="mrp" label="MRP" >
                        <InputNumber
                        addonAfter={<Checkbox disabled> Specific</Checkbox>}
                        style={{ width: '100%', }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name='display_name' label="Display name">
                    <Input.TextArea  />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name='description' label="Description">
                    <Input.TextArea rows={5} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Images" name='image_specific'>
                <Radio.Group>
                    <Radio value="non"> Non Specific </Radio>
                    <Radio value="variant" disabled> Variant Specific </Radio>
                    <Radio value="sub_variant" disabled> SubVariant Specific </Radio>
                    <Radio value="both" disabled> Both </Radio>
                </Radio.Group>
                </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
                        <ImgCrop rotationSlider>
                            <Upload
                                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                customRequest={dummyRequest}
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onImgChange}
                                onPreview={onPreview}
                                className='org-logo'
                            >
                                {fileList.length < 5 && '+ Upload'}
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                </Col>

            </Row>
            </>
          ),
        },
        state.isVariant &&
        {
          key: '2',
          label: 'Variant',
          children: (
            <>
            <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
                    <Form.Item
                    label="Variant name"
                    name="variant_name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input product variant name!',
                        },
                    ]}
                    >
                    <Input placeholder='Colour'/>
                    </Form.Item>
                </Col>
               
            </Row>
            <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
                <Form.List
                    name="variant_names"
                    rules={[
                    {
                        validator: async (_, names) => {
                        if (!names || names.length < 1) {
                            return Promise.reject(new Error('At least 1 variant'));
                        }
                        },
                    },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                        <Form.Item
                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                            label={index === 0 ? 'Variants' : ''}
                            required={false}
                            key={field.key}
                        >
                            <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                                {
                                required: true,
                                whitespace: true,
                                message: "Please input variants's name",
                                },
                            ]}
                            noStyle
                            >
                            <Input
                                placeholder="variant name"
                                style={{
                                width: '60%',
                                }}
                            />
                            </Form.Item>
                            {fields.length > 1 ? (
                            <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                            />
                            ) : null}
                        </Form.Item>
                        ))}
                        <Form.Item className='text-center'>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                            width: '60%',
                            }}
                            icon={<PlusOutlined />}
                        >
                            Add variant
                        </Button>
                        {/* <Button
                            type="dashed"
                            onClick={() => {
                            add('The head item', 0);
                            }}
                            style={{
                            width: '60%',
                            marginTop: '20px',
                            }}
                            icon={<PlusOutlined />}
                        >
                            Add field at head
                        </Button> */}
                        <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                    )}
                </Form.List>
            </Col>
            </Row>
            {/* <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Purchase Price" name='purchase_price' >
                <InputNumber
                        addonAfter={<Checkbox> <Tooltip title="Same price as given in product">Same as product</Tooltip></Checkbox>}
                        style={{ width: '100%', }}
                        />
                </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Sales Price" name='sales_price' >
                <InputNumber
                        addonAfter={<Checkbox> Same as product</Checkbox>}
                        style={{ width: '100%', }}
                        />
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item  name="orginal_price" label="Orginal Sales Price" >
                        <InputNumber
                        addonAfter={<Checkbox> Same as product</Checkbox>}
                        style={{ width: '100%', }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item  name="mrp" label="MRP" >
                        <InputNumber
                        addonAfter={<Checkbox> Same as product</Checkbox>}
                        style={{ width: '100%', }}
                        />
                    </Form.Item>
                </Col>
            </Row> */}
            {/* <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Images" valuePropName="fileList" getValueFromEvent={normFile}>
                        <ImgCrop rotationSlider>
                            <Upload
                                customRequest={dummyRequest}
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onImgChange}
                                onPreview={onPreview}
                                className='org-logo'
                            >
                                {fileList.length < 5 && '+ Upload'}
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                </Col>

            </Row> */}
            </>
          ),
        },
        // {
        //   key: '3',
        //   label: 'Sub Variant',
        //   children: (<>
        //   <Row gutter={16}>
        //     <Col xs={24} sm={24} md={12}>
        //             <Form.Item
        //             label="SubVariant name"
        //             name="sub_variant_name"
        //             rules={[
        //                 {
        //                 required: true,
        //                 message: 'Please input product sub variant name!',
        //                 },
        //             ]}
        //             >
        //             <Input placeholder='Size'/>
        //             </Form.Item>
        //         </Col>
               
        //     </Row>
        //     <Row gutter={16}>
        //     <Col xs={24} sm={24} md={12}>
        //         <Form.List
        //             name="sub_variant_names"
        //             rules={[
        //             {
        //                 validator: async (_, names) => {
        //                 if (!names || names.length < 1) {
        //                     return Promise.reject(new Error('At least 1 sub variant'));
        //                 }
        //                 },
        //             },
        //             ]}
        //         >
        //             {(fields, { add, remove }, { errors }) => (
        //             <>
        //                 {fields.map((field, index) => (
        //                 <Form.Item
        //                     {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        //                     label={index === 0 ? 'SubVariant' : ''}
        //                     required={false}
        //                     key={field.key}
        //                 >
        //                     <Form.Item
        //                     {...field}
        //                     validateTrigger={['onChange', 'onBlur']}
        //                     rules={[
        //                         {
        //                         required: true,
        //                         whitespace: true,
        //                         message: "Please input sub variants's name or delete this field.",
        //                         },
        //                     ]}
        //                     noStyle
        //                     >
        //                     <Input
        //                         placeholder="sub variant name"
        //                         style={{
        //                         width: '60%',
        //                         }}
        //                     />
        //                     </Form.Item>
        //                     {fields.length > 1 ? (
        //                     <MinusCircleOutlined
        //                         className="dynamic-delete-button"
        //                         onClick={() => remove(field.name)}
        //                     />
        //                     ) : null}
        //                 </Form.Item>
        //                 ))}
        //                 <Form.Item className='text-center'>
        //                 <Button
        //                     type="dashed"
        //                     onClick={() => add()}
        //                     style={{
        //                     width: '60%',
        //                     }}
        //                     icon={<PlusOutlined />}
        //                 >
        //                     Add SubVariant
        //                 </Button>
        //                 {/* <Button
        //                     type="dashed"
        //                     onClick={() => {
        //                     add('The head item', 0);
        //                     }}
        //                     style={{
        //                     width: '60%',
        //                     marginTop: '20px',
        //                     }}
        //                     icon={<PlusOutlined />}
        //                 >
        //                     Add field at head
        //                 </Button> */}
        //                 <Form.ErrorList errors={errors} />
        //                 </Form.Item>
        //             </>
        //             )}
        //         </Form.List>
        //     </Col>
        //     {/* <Col xs={24} sm={24} md={12}>
                    
        //     </Col> */}
        //     </Row>
        //     <Row gutter={16}>
        //         <Col xs={24} sm={24} md={12}>
        //         <Form.Item label="Purchase Price" name='purchase_price' >
        //         <InputNumber
        //                 addonAfter={<Checkbox> <Tooltip title="Same price as given in product variant">Same as variant</Tooltip></Checkbox>}
        //                 style={{ width: '100%', }}
        //                 />
        //         </Form.Item>
        //         </Col>
        //         <Col xs={24} sm={24} md={12}>
        //         <Form.Item label="Sales Price" name='sales_price' >
        //         <InputNumber
        //                 addonAfter={<Checkbox> Same as variant</Checkbox>}
        //                 style={{ width: '100%', }}
        //                 />
        //         </Form.Item>
        //         </Col>
        //     </Row>
        //     <Row gutter={16}>
        //         <Col xs={24} sm={24} md={12}>
        //             <Form.Item  name="orginal_price" label="Orginal Sales Price" >
        //                 <InputNumber
        //                 addonAfter={<Checkbox> Same as variant</Checkbox>}
        //                 style={{ width: '100%', }}
        //                 />
        //             </Form.Item>
        //         </Col>
        //         <Col xs={24} sm={24} md={12}>
        //             <Form.Item  name="mrp" label="MRP" >
        //                 <InputNumber
        //                 addonAfter={<Checkbox> Same as variant</Checkbox>}
        //                 style={{ width: '100%', }}
        //                 />
        //             </Form.Item>
        //         </Col>
        //     </Row>
            
        //   </>),
        // },
        // {
        //     key: '4',
        //     label: 'Stock',
        //     children: (<>
        //     {stocks.map((stock, index) =>{
        //         return(
        //         <Row gutter={16}>
        //             <Col flex={3}>
        //                 <Text>{stock.variant} </Text>
        //             </Col>
        //             <Col flex={3}>
        //                 <Text>{stock.subVariant}</Text>
        //             </Col>
        //             <Col flex={1}>
        //             <Form.Item
        //                 // label="Stock"
        //                 name={`stock${index}`}
        //                 rules={[
        //                     {
        //                     required: true,
        //                     message: 'Please input product sub variant name!',
        //                     },
        //                 ]}
        //                 >
        //                 <Input placeholder='Opening Stock' defaultValue='0' />
        //             </Form.Item>
        //             </Col>
        //         </Row>
        //         )
        //     })}
        //     </>)
        // }
      ];
    

    
    useEffect(() => {
      fetchInitial();
    //   if (productId){
    //     fetchProduct()
    //   }
    }, []);

    // useEffect(()=>{
    //     if (searchParams.get('id')){
    //         se
    //     //   setResetMode(true);
    //     //   setOtp_disable(true)
    //     }    
    //   },[])
    
        console.log("state===0000===>",state);

  return (
    <div>
        {loader?
        <div>
            <Row>
                <Col span={12} >
                    <Skeleton  active paragraph={{rows: 15,}}  style={{width:'75%'}}/>
                </Col>
                <Col span={12}>
                    <Skeleton active  paragraph={{rows: 15,}}/>
                </Col>
            </Row>
            <br/><br/><br/><br/>
            <Space>
                <Skeleton.Button active   block />
                <Skeleton.Avatar active   />
                <Skeleton.Input active  />
            </Space>

        </div>
        :
        <div className='mb-16'>
            <Form
                encType='multipart/form-data'
                form={form}
                // layout="vertical"
                // style={{
                //     maxWidth: 600,
                //   }}
                initialValues={initialValues}
                name="product"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                {...formItemLayout}
            >
                <div  style={{display:'flex',justifyContent:'space-between', alignItems:'center'}} >
                <Title level={4}>{productId ? 'Update Product' : 'Create Product'}</Title>
                <Form.Item name='is_active'>
                {/* <Space>Status: */}
                    <Switch  defaultChecked={initialValues.is_active} name='is_active' checkedChildren="Active" unCheckedChildren="Inactive" style={{width:'100px',}}/>
                {/* </Space> */}
                </Form.Item>
                </div>
                <Divider />

                <Tabs defaultActiveKey="1" items={items} type="card" onChange={onTabChange} />
        
                

            <Row>
                <Col span={24}>
                <div className="fixed-bottom-sm" style={{padding:'7px'}}>
                    <Flex gap="middle" align="center" justify='center'>
                    <Button  shape="round" 
                    // htmlType='reset'
                    onClick={resetForm} 
                    size={'large'} danger type='dashed'>Clear</Button>
                
                    <Button type="primary" shape="round"  htmlType="submit" 
                    onClick={() => setnav(false)} 
                    style={{backgroundColor:'#008080'}}
                    size={'large'}>Save & Add New </Button>
                    <Button type="primary" shape="round"  block  htmlType="submit" 
                    onClick={() => setnav(true)}
                    size={'large'}>Save </Button>
                    </Flex>
                </div>
                </Col>
            </Row>
            
            </Form>

            {/* --------- MODALS ------ */}
            <Modal
                title="Create a new Category"
                centered
                open={categoryModalOpen}
                // onOk={createBrand()}
                okText='Create'
                onCancel={() => setCategoryModalOpen(false)}
                footer={null}
            >
                 <Form
                    form={categoryForm}
                    name="category_form"
                    labelCol={{
                    span: 4,
                    }}
                    // wrapperCol={{
                    // span: 16,
                    // }}
                    style={{
                    maxWidth: 600,
                    paddingTop:'17px'
                    }}
                    // initialValues={{
                    // remember: true,
                    // }}
                    onFinish={createCategory}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Name"
                    name="category_name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your category name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    >
                    <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" block >
                        Create
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Create a new Brand"
                centered
                open={brandModalOpen}
                // onOk={createBrand()}
                okText='Create'
                onCancel={() => setBrandModalOpen(false)}
                footer={null}
            >
                 <Form
                    name="brand_form"
                    form={brandForm}
                    labelCol={{
                    span: 4,
                    }}
                    // wrapperCol={{
                    // span: 16,
                    // }}
                    style={{
                    maxWidth: 600,
                    paddingTop:'17px'
                    }}
                    // initialValues={{
                    // remember: true,
                    // }}
                    onFinish={createBrand}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Name"
                    name="brand_name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your brand name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    >
                    <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" block >
                        Create
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Create a new Unit"
                centered
                open={unitModalOpen}
                // onOk={createBrand()}
                okText='Create'
                onCancel={() => setUnitModalOpen(false)}
                footer={null}
            >
                 <Form
                    form={unitForm}
                    name="unit_form"
                    labelCol={{
                    span: 4,
                    }}
                    // wrapperCol={{
                    // span: 16,
                    // }}
                    style={{
                    maxWidth: 600,
                    paddingTop:'17px'
                    }}
                    // initialValues={{
                    // remember: true,
                    // }}
                    onFinish={createUnit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Name"
                    name="unit_name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your unit name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Abbreviation"
                    name="abbreviation"
                    >
                    <Input placeholder='eg:- KG, Ltr, Mg, etc...' />
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    >
                    <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" block >
                        Create
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <Modal
                title="Create a new Tax"
                centered
                open={taxModalOpen}
                // onOk={createBrand()}
                okText='Create'
                onCancel={() => setTaxModalOpen(false)}
                footer={null}
            >
                 <Form
                    form={taxForm}
                    name="tax_form"
                    labelCol={{
                    span: 6,
                    }}
                    // wrapperCol={{
                    // span: 14,
                    // }}
                    style={{
                    maxWidth: 600,
                    paddingTop:'17px'
                    }}
                    // initialValues={{
                    // remember: true,
                    // }}
                    onFinish={createTax}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Name"
                    name="tax_name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your tax name!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Purchase Rate"
                    name="purchase_rate"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your purchase rate!',
                        },
                    ]}
                    >
                    <Input type='number' placeholder='0 - 100 (%)' />
                    </Form.Item>
                    <Form.Item
                    label="Sale Rate"
                    name="sale_rate"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your sale rate!',
                        },
                    ]}
                    >
                    <Input type='number' placeholder='0 - 100 (%)' />
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    >
                    <Input.TextArea />
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" block >
                        Create
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>

            
        </div>
        }
    </div>
  )
}

export default CreateProduct