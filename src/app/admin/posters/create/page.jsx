'use client';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, ColorPicker, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Row, Select, Skeleton, Space, Switch, Tabs, Tooltip, Typography, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import './style.css'
import toast from 'react-hot-toast';
import ImgCrop from 'antd-img-crop';
import { baseUrl, DotzBaseUrlV1, EshopBaseUrl, EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter, useSearchParams } from 'next/navigation';
// import useAxios from '../../utils/useAxios';
// import { useSelector } from 'react-redux';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { dotzURL } from '../../utils/apiConfig';
const { Title, Text } = Typography;


const CreatePoster = () => {
    // const dotzURL = ''
    const router = useRouter();
    const [loader, setLoader] = useState(true)
    const searchParams = useSearchParams();
    const posterId = searchParams.get('id');

    const [form] = Form.useForm();
    const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

    
    const [nav, setnav] = useState(false);


    
   
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
            // "tax":tax[0].id,
        }
    )
  
 
    

      

    const onFinish = async (values) => {
        // values.organization = organizationDetails.id;
        let shouldNavigate = nav
        console.log("values===products===>",values);
        console.log("nav===products===>",nav);
        if (!fileList[0]?.originFileObj && fileList[0]?.uid !== '1'){
            toast.error("Image is required")
        }else{
            const formData = new FormData();
            // fileList.forEach((file) => {
            //     formData.append('image', file);
            //   });
            if (fileList[0]?.uid === '1'){
                formData.append('image','1')
            }else{
                formData.append('image', fileList[0]?.originFileObj)
            }

        
            formData.append('is_active', values.is_active);
            formData.append('heading', values.heading);
            formData.append('heading_color', values.heading_color ? values.heading_color.toHexString() : '#000000');
            formData.append('sub_heading_color', values.sub_heading_color ? values.sub_heading_color.toHexString() : '#000000');
            formData.append('button_color', values.button_color ? values.button_color.toHexString() : '#ff89fc');
            formData.append('order', values.view_order);
            formData.append('sub_heading', values.sub_heading ?? '');
            formData.append('description', values.content ?? '');
            formData.append('link', values.link ?? '');
            formData.append('organization', organizationDetails.id);
            // formData.append('image', values.image[0].originFileObj);
            // console.log("formData===>",formData);
              if (posterId){
                formData.append('pk', posterId);
              }
            // if (posterId){
            //     formData.append('pk', posterId);
            //     const response = await api.put('/api/v1/product/products/', formData, {
            //         headers: { 'Content-Type': 'multipart/form-data'}
            //     });
            // }else {
            //     const response = await api.post('/api/v1/product/products/', formData, {
            //         headers: { 'Content-Type': 'multipart/form-data'}
            //     });
            // }
            const response = posterId ?
                await axiosInstance.put(EshopBaseUrlV1+'/posters/poster/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'}
                }) :
                await axiosInstance.post(EshopBaseUrlV1+'/posters/poster/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'}
                });
            // console.log("response===:",response);
            if (response.data.status === 1000){
                toast.success(response.data.message)
                
                if (shouldNavigate){
                    router.push('/admin/posters')
                }else{
                form.resetFields()
                form.setFieldsValue({ product_code: undefined });
                setLoader(true)
                fetchInitial()
                }
    
            }else if (response.data.status === 1001){
                toast.error("ERROR: "+response.data.message)
            }
            else{
                // message.error(response.data.message)
                message.open({
                    type: 'error',
                    content: response.data.message,
                    duration: 10,
                  });
            }

        }
    }


    const resetForm = () => {
        if (posterId){
            // window.location.reload()
            navigate('/admin/poster/create')
        }
        // else{
            form.resetFields()
            form.setFieldsValue({ product_code: undefined });
            setLoader(true)
            fetchInitial()
        // }
    };

    

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
          label: 'Main Page',
          children: (
            <>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                    {/* <Form.Item
                    label="Heading"
                    name="heading"
                    rules={[
                        {
                        required: true,
                        message: 'Please input poster heading!',
                        },
                    ]}
                    >
                    <Space.Compact
                        style={{
                            width: '100%',
                        }}
                        >
                        <Input />
                        <Form.Item  name="heading_color" >
                            <ColorPicker defaultValue="#000" />
                        </Form.Item>
                    </Space.Compact>
                    </Form.Item> */}
                    <Form.Item
                    label="Heading"
                    required
                    >
                    <Space.Compact
                        style={{
                        width: '100%',
                        }}
                    >
                        {/* Input field for heading */}
                        <Form.Item
                        name="heading"
                        noStyle
                        rules={[
                            {
                            required: true,
                            message: 'Please input poster heading!',
                            },
                        ]}
                        >
                        <Input placeholder="Enter heading" />
                        </Form.Item>

                        {/* ColorPicker for heading color */}
                        <Form.Item
                        name="heading_color"
                        noStyle
                        >
                        <ColorPicker defaultValue="#000" />
                        </Form.Item>
                    </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="View order" style={{marginBottom: 0,}}>
                    <Form.Item
                        name='view_order'
                        style={{
                        display: 'inline-block',
                        width: 'calc(80% - 12px)',
                        // width: '70%',
                        }}
                        rules={[
                            {
                            required: true,
                            message: 'Please input poster view order!',
                            },
                        ]}
                    >
                    <Input style={{color:'#000'}} readOnly/>
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
                    <Form.Item label="Sub Heading" >
                       <Space.Compact
                        style={{
                            width: '100%',
                        }}
                        >
                        <Form.Item name='sub_heading'>
                            <Input.TextArea  />
                        </Form.Item>
                        <Form.Item  name="sub_heading_color" >
                            <ColorPicker defaultValue="#000" />
                        </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name='content' label="Content">
                    <Input.TextArea rows={5} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Button Link">
                    <Space.Compact
                        style={{
                            width: '100%',
                        }}
                        >
                    <Form.Item name="link" >
                        <Input />
                    </Form.Item>
                        <Form.Item  name="button_color" >
                            <ColorPicker defaultValue="#ff89fc" />
                        </Form.Item>
                    </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Form.Item label="Image" valuePropName="fileList" getValueFromEvent={normFile}>

                    <ImgCrop aspect={16 / 7} quality={1} rotationSlider>
                        <Upload
                        name="poster"
                        // listType="picture"
                        // onChange={handleChange}
                        // showUploadList={false} 
                        customRequest={dummyRequest}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onImgChange}
                        onPreview={onPreview}
                        className='org-logo'
                        >
                            {fileList.length < 1 && '+ Upload'}
                        {/* <Button icon={<UploadOutlined />}>Upload and Crop Poster</Button> */}
                        </Upload>
                    </ImgCrop>
                    </Form.Item>
                </Col>

                

            </Row>
            </>
          ),
        },
        {
            key: '2',
            label: 'Product List',
            disabled: true,
        },
        {
            key: '3',
            label: 'Single Product',
            disabled: true,
        }
       
      ];
    

    
    useEffect(() => {
        const fetchInitial = async () => {
            console.log("====INITIAL===>");
            try {
                const response1 = await axiosInstance.get(`${EshopBaseUrlV1}/posters/get-order/${organizationDetails.id}/MAIN`)
                if (response1.data.status === 1000){
                    console.log("response1.data.data===>",response1.data.data);
                    setInitialValues({
                        ...initialValues,
                        view_order:response1.data.data,
                        // heading_color:"#ffff"
                    })
                    form.setFieldsValue({ view_order: response1.data.next_order });
                    console.log("initialValues=000====>",initialValues);
                    setLoader(false)
                    
                }else{
                    toast.error('Something went wrong!')
                }
            } catch (error) {
                console.log("error123: " + error);
            }
        }
        const fetchPoster = async () => {
            console.log("====INITIAL=WITH ID==>");
            try {
                const response1 = await axiosInstance.get(`${EshopBaseUrlV1}/posters/poster/${posterId}/`)
                if (response1.data.status === 1000){
                    console.log("response1.data.data===>",response1.data.data);
                    const result = response1.data.data
                    setInitialValues({
                        ...initialValues,
                        is_active:result.is_active,
                        heading:result.heading,
                        view_order:result.order,
                        sub_heading:result.sub_heading,
                        content:result.description,
                        link:result.link,
                        // image:result.image,
                    })
                    if(result.image){
                        setFileList([{
                            uid: '1',
                            name: 'poster.png',
                            status: 'done',
                            url: baseUrl+result.image
                        }])
                    }
                    
                }else if (response1.data.status === 1001){
                    toast.error("ERROR: "+response1.data.message)
                }else{
                    toast.error('Something went wrong!')
                }
            } catch (error) {
                console.log("error123: " + error);
            }
            setLoader(false)
        }
                        
        if (posterId){
            fetchPoster()
        }else{
          fetchInitial();
      }
    }, []);

    // useEffect(()=>{
    //     if (searchParams.get('id')){
    //         se
    //     //   setResetMode(true);
    //     //   setOtp_disable(true)
    //     }    
    //   },[])
    
    //     console.log("nav===0000===>",nav);

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
                name="poster"
                onFinish={onFinish}
                {...formItemLayout}
            >
                <div  style={{display:'flex',justifyContent:'space-between', alignItems:'center'}} >
                <Title level={4}>{posterId ? 'Update Poster' : 'Create Poster'}</Title>
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
            

            
        </div>
        }
    </div>
  )
}

export default CreatePoster