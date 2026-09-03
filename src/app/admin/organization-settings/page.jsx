"use client";
import React, { useEffect, useState } from 'react'
import { Button, Col, Flex, Input, Row, Select, Space, Typography, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
// import useAxios from '../../utils/useAxios';
// import { baseURL, dotzURL, MEDIA } from '../../utils/apiConfig';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import { baseUrl, DotzBaseUrlV1 } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

const OrgSettings = () => {
  const router = useRouter()
  const { Option } = Select; 
  const {Paragraph} = Typography
  const queryParams = useSearchParams()
  const pk = queryParams.get('pk');
  console.log("pk------>",pk);
  const base_url = window.location.origin;
  const { user } = useUser();

//   const api = useAxios()
  const [enableEdit, setEnableEdit] = useState(false)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedstates, setSelectedStates] = useState([]);

  const [state, setState] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState({isUpdate:false})
  const [fileList, setFileList] = useState([
    // {
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // MEDIA+organization_details.logo
    // },
  ]);

  const taxTypes = [
    {name:'None',id:4},
    {name:'GSTIN',id:1}, 
    {name:'Value Added Tax (VAT)',id:2},
    {name:'Other',id:3}
  ];


  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const onChange = ({ fileList: newFileList }) => {
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
  const validateGSTIN = (gstin) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const handleChange = (e) => {
    const {name, value} = e.target
    console.log("name==>",name);
    console.log("value==>",value);
    if (name === 'tax_number'){
        if (state.tax_type === 1){
            if (validateGSTIN(value)){
                setError({
                    ...error,
                    tax_number:null
                })
            }else{
                setError({
                    ...error,
                    tax_number:'error'
                })
            }
        }
    }else if(name === 'name'){
        if(!value.trim()){
            setError({
                ...error,
                name:'error'
            })
        }else{
            setError({
                ...error,
                name:null
            })
        }
    }
    setState({
        ...state,
        [name]:value
    });
  };
  const handleSelect = (value) => {
    console.log("value--->",value);
    if (value === 4){
        setState({...state,tax_type:value, tax_number:null})
    }else{
        setState({...state,tax_type:value})
    }
    if (value === 1){
        if (validateGSTIN(state.tax_number)){
            setError({
                ...error,
                tax_number:null
            })
        }else{
            setError({
                ...error,
                tax_number:'error'
            })
        }
    }else{
        setError({...error,tax_number:null})
    }
  };

//   ==== API ====
    const handleUpdate = async () => {
        let isValidate = true
        if (state.tax_type === 1 && !validateGSTIN(state.tax_number)){
            isValidate = false
            toast.error("Invalid GSTIN Number")
        }else if(!state.name.trim()){
            isValidate = false
            toast.error("Can't be empty organization name")
        }

        if (isValidate){
            setLoading({...loading,isUpdate:false})
            const formData = new FormData();
            console.log("logoo-->",fileList[0]?.uid);
            if (fileList[0]?.uid === '1'){
                formData.append('logo','1')
            }else{
                formData.append('logo', fileList[0]?.originFileObj); // Only send the first file
            }
            formData.append('name',state.name)
            formData.append('shopname',state.shopname)
            formData.append('tax_type',state.tax_type)
            formData.append('tax_number',state.tax_number)
            formData.append('crn_number',state.crn_number)
            formData.append('website',state.website)
            formData.append('state',state.state)
            formData.append('phone_number',state.phone_number)
            formData.append('email',state.email)
            formData.append('building',state.building)
            formData.append('city',state.city)
            formData.append('street',state.street)
            formData.append('pin_code',state.pin_code)
            console.log("formData====>",formData);
            const response = await axiosInstance.put(DotzBaseUrlV1+`/organization/organizations/${pk}/`,formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              console.log('called submit=respose==>',response);
              console.log('called submit=resposedata==>',response.data);
              if (response.data.status === 1000){
                toast.success('Updated successfully.');
                router.push('/admin')
              }
            setLoading({...loading,isUpdate:false})

        }
        // fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
        //     method: 'POST',
        //     body: formData,
        // })
        //     .then((res) => res.json())
        //     .then(() => {
        //     setFileList([]);
        //     message.success('upload successfully.');
        //     })
        //     .catch(() => {
        //     message.error('upload failed.');
        //     })
        //     .finally(() => {
        //     // setUploading(false);
        //     });
    };

    

// == UseEffect ==
useEffect(() => {
    // Filter the states based on the selected country ID
    if (state?.country){
        const filteredStates = states.filter(i => i.country === state.country);
        setSelectedStates(filteredStates);
    }
  }, [states, state?.country]);

useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${baseURL+dotzURL}main/list_country/`);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    const fetchStates = async () => {
      try {
        const response = await fetch(`${baseURL+dotzURL}main/list_state/`);
        const data = await response.json();
        setStates(data); 
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchCountries();
    fetchStates();
  }, []);

useEffect(() => {
    const fetchData = async ()=> {
        const response = await axiosInstance.get(DotzBaseUrlV1+`/organization/organizations/${pk}`);
        setState(response.data.data)
        if (response.data.data.logo){
            setFileList([{
                uid: '1',
                name: 'defaultLogo.png',
                status: 'done',
                url: baseUrl+response.data.data.logo
            }])
        }
    }
    fetchData()
}, [pk])


  console.log("state===>",state);

  return (
    <div style={{padding:'0px 25px'}}>
        <Row gutter={[40, 8]} style={{marginBottom:'70px'}} >
            <Col span={12} >
            <Flex vertical>
                <div className='mb-3'>
                    <Typography.Title type='secondary'  level={5}>Organization Name</Typography.Title>
                    <Input status={error?.name} name='name' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit} style={{fontWeight:"bold"}}  value={state?.name} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Shopname</Typography.Title>
                    <Input placeholder={enableEdit?'Enter shopname': '-'} name='shopname' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.shopname || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Organization ID</Typography.Title>
                    <Paragraph copyable>{state?.id || ""}</Paragraph>
                    {/* <Input name='org_id' readOnly={!enableEdit} className='ft-15' bordered={false}  value={state?.id || ""} /> */}
                </div>

                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Building No/Name</Typography.Title>
                    <Input placeholder={enableEdit?'Enter building name': '-'} name='building' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.building || ""} />
                </div>

                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>City</Typography.Title>
                    <Input placeholder={enableEdit?'Enter city': '-'} name='city' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.city || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Street</Typography.Title>
                    <Input placeholder={enableEdit?'Enter street': '-'} name='street' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.street || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Pin code</Typography.Title>
                    <Input placeholder={enableEdit?'Enter pin code': '-'} name='pin_code' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.pin_code || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Country</Typography.Title>
                    {/* <Input readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.country || ""} /> */}
                    <Select style={{ width: '100%', }} disabled={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.country || ""} placeholder="Select Country" onChange={(value)=> setState({...state,country:value, state:null})}>
                        {countries.map((i) => (
                        <Option key={i.id} value={i.id}>
                            {i.name}
                        </Option>
                        ))}
                    </Select>
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>State</Typography.Title>
                    {/* <Input readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.state || ""} /> */}
                    <Select style={{ width: '100%', }} disabled={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.state || ""} placeholder="Select State" onChange={(value)=> setState({...state,state:value})}>
                        {selectedstates.map((i) => (
                        <Option key={i.id} value={i.id}>
                            {i.name}
                        </Option>
                        ))}
                    </Select>
                </div>
            </Flex>
            
            </Col>
            <Col span={12}>
            <Flex vertical>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>WebPage link</Typography.Title>
                    <Paragraph copyable>{base_url+'/in/'+state?.shopname || ""}</Paragraph>
                    {/* <Input name='org_id' readOnly={!enableEdit} className='ft-15' bordered={false}  value={state?.id || ""} /> */}
                </div>
                <div className='mb-3 text-right'>
                <ImgCrop rotationSlider>
                <Upload
                    // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    customRequest={dummyRequest}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    className='org-logo'
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
                </ImgCrop>
                </div>
                
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Tax type</Typography.Title>
                    {/* <Input readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.tax_type || ""} /> */}
                    <Select name="tax_type" style={{ width: '100%', }} disabled={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.tax_type || "4"} placeholder="Select Tax Type" onChange={handleSelect}>
                        {taxTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                            {type.name}
                        </Option>
                        ))}
                    </Select>
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Tax No</Typography.Title>
                    <Input placeholder={enableEdit?'Enter tax number': '-'} status={error?.tax_number} name='tax_number' onChange={handleChange} readOnly={!enableEdit} disabled={state?.tax_type === 4} className='ft-15' bordered={enableEdit} value={state?.tax_number || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>CRN Number</Typography.Title>
                    <Input placeholder={enableEdit?'Enter CRN or other cirtificate no': '-'} name='crn_number' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.crn_number || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Phone</Typography.Title>
                    <Input placeholder={enableEdit?'Enter phone no': '-'} name='phone_number' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.phone_number || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Email</Typography.Title>
                    <Input placeholder={enableEdit?'Enter email': '-'} name='email' onChange={handleChange} readOnly={!enableEdit} className='ft-15' type='email' bordered={enableEdit}  value={state?.email || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Website</Typography.Title>
                    <Input placeholder={enableEdit?'Enter website': '-'} name='website' onChange={handleChange} readOnly={!enableEdit} className='ft-15' bordered={enableEdit}  value={state?.website || ""} />
                </div>
                <div className='mb-3'>
                    <Typography.Title type='secondary' level={5}>Software Plan</Typography.Title>
                    {/* <Input value={state?.edition} readOnly style={{backgroundColor:"#ffadd1"}} /> */}
                    <Space.Compact style={{ width: '100%',}} >
                        {/* <Input  value={state?.edition+" Edition"} readOnly style={{backgroundColor:"#ffadd1"}} /> */}
                        <Input  value={user?.edition === 1 ? 'Lite Edition' : 'Trail Edition'} readOnly style={{backgroundColor:"ffef79"}} />
                        <Link href="/admin/billing" passHref>
                        <Button disabled={!enableEdit} type="primary">Upgrade</Button>
                        </Link>
                    </Space.Compact>
                </div>
            </Flex>
            
            </Col>
        </Row>

        <div className="fixed-bottom" style={{padding:'7px'}}>
            <Flex gap="middle" align="center" justify='center'>
                <Button  shape="round"  onClick={() => {setEnableEdit(false)}}
                size={'large'} danger type='dashed'>Cancel</Button>
                
                {enableEdit ?
                <Button loading={loading.isUpdate} type="primary" shape="round"  block  onClick={handleUpdate}
                size={'large'}>Update </Button>
                :
                <Button  shape="round"  block  onClick={() => {setEnableEdit(true)}}
                size={'large'}>Enable Edit </Button>
                }

                
            </Flex>
        </div>
    </div>
  )
}

export default OrgSettings