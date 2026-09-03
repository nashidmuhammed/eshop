'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, Row, Col, Typography } from 'antd';
import { DotzBaseUrl } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';
import axiosInstance from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
const { Option } = Select;  

const RegisterOrg = ({isModalVisible, setIsModalVisible}) => {
  const username = JSON.parse(localStorage.getItem('userDetails')).username;
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [formState, setFormState] = useState({});
  const router = useRouter()

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    // Handle form submission here
    // setFormState(values);
    setIsModalVisible(false);
    handleSubmit(values)
  };

  // --------
  const [form] = Form.useForm();
  const [skipFirstRender, setSkipFirstRender] = useState(true);
  const [Logo, setLogo] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedstates, setSelectedStates] = useState([]);
  const [selectedcontry, setSelectedContry] = useState([]);
  // const Logo = null
  const [state, setState] = useState({
    taxTypes: []
  })
  
 
  
  const taxTypes = [
    {name:'None',id:4},
    {name:'GSTIN',id:1}, 
    {name:'Value Added Tax (VAT)',id:2},
    {name:'Other',id:3}
  ];
  const orgTypes = [
    {name:'Retailers',id:1},
    {name:'Wholesalers',id:2}, 
    {name:'Manufactures',id:3},
    {name:'Distributors',id:4},
    {name:'Service Providers',id:5},
    {name:'Marketplaces',id:6},
    {name:'Dropshippers',id:7},
    {name:'Subscription Services',id:8},
  ];
  const categories = [
    {name:'Electronics',id:1},
    {name:'Fashion',id:2}, 
    {name:'Home & Kitchen',id:3},
    {name:'Beauty & Personal Care',id:4},
    {name:'Health & Wellness',id:5},
    {name:'Sports & Outdoors',id:6},
    {name:'Automotive',id:7},
    {name:'Toys & Games',id:8},
    {name:'Books, Movies & Music',id:9},
    {name:'Groceries',id:10},
    {name:'Pet Suppliers',id:11},
    {name:'Office Suppliers',id:12},
    {name:'Baby Products',id:13},
    {name:'Jewelry & Watches',id:14},
    {name:'Art & Crafts',id:15},
  ];

  const validateShopName = (_, value) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (value && !regex.test(value)) {
      return Promise.reject(
        'Unique name can only include letters, numbers, underscores (_), and hyphens (-).'
      );
    }
    return Promise.resolve();
  };
  const handleCountryChange = (value) => {
    setSelectedContry(value);
    };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setLogo(file);


    // if (file) {
    //   const reader = new FileReader();

    //   reader.onload = (e) => {
    //     props.setLogo(e.target.result)
    //   };

    //   reader.readAsDataURL(file);
    // }
  };

  const handleSubmit = async(formState) => {
    try {
      // console.log('called submit');
      // const postData = {
      //   name: formState.organization_name,
      //   s_name: null,
      //   tax_type: formState.tax_type,
      //   tax_number: formState.taxNumber,
      //   crn_number: null,
      //   logo: Logo, // or any other representation of your logo
      //   website: null,
      //   edition: formState.edition || 1,
      //   state: formState.state,
      //   phone_number: formState.phoneNumber,
      //   email: formState.email,
      // };
    //   console.log("state===>: " + state);
        console.log('formState:', formState);

      
      const formData = new FormData();
      formData.append('name', formState.organization_name || '');
      formData.append('s_name', formState.shop_name || '');
      formData.append('shopname', formState.shop_name || '');
      formData.append('tax_type', formState.tax_type || '');
      formData.append('tax_number', formState.taxNumber || '');
      formData.append('edition', formState.edition || 0);
      formData.append('state', formState.state || '');
      formData.append('phone_number', formState.phoneNumber || '');
      formData.append('email', formState.email || '');
      formData.append('website', formState.website || '');
      formData.append('crn_number', formState.crn_number || '');
      formData.append('street', formState.street || '');
      formData.append('logo', Logo);

      const response = await axiosInstance.post(DotzBaseUrl+'/v1/organization/organizations/',formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('called submit=respose==>',response);
      if (response.data.status === 1000){
        toast.success(response.data.message)
        setState({
          country:'',
            logo:'',
            taxTypes:''
        });
        // setNewOrg(false);
        // setNewUser(false);
        router.push('/admin')
      }else if (response.data.status === 1001){
        toast.error(response.data.error)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error){
      console.error('Error fetching data:', error);
      // setLoader(false); // Disable the loader in case of an error
      toast.error("Something went wrong!, please try again")
    }
  }

  useEffect(() => {
    // Function to fetch the list of countries
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${DotzBaseUrl}/v1/main/list_country/`);
        const data = await response.json();
        setCountries(data); // Assuming the API response is an array of countries
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    // Function to fetch the list of states
    const fetchStates = async () => {
      try {
        const response = await fetch(`${DotzBaseUrl}/v1/main/list_state/`);
        const data = await response.json();
        setStates(data); // Assuming the API response is an array of states
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    // Call both API functions when the component mounts
    fetchCountries();
    fetchStates();
  }, []);

  useEffect(() => {
    // Filter the states based on the selected country ID
    const filteredStates = states.filter(state => state.country === selectedcontry);
    setSelectedStates(filteredStates);
  }, [states, selectedcontry]);
  return (
    <Modal
        title="Register Your Organization"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered
        width={1250}
      >
        <Form encType="multipart/form-data" onFinish={onFinish} form={form}   name="register" style={{marginTop:'15px',padding:'10px'}}>
          <Row gutter={16}>
                <Col xs={24} sm={20}>
                <Form.Item
                        name="organization_name"
                        label="Organization Name"
                        rules={[{ required: true, message: 'Please enter organization name' }]}
                    >
                    <Input placeholder='Company name' />
                </Form.Item>
                    
                </Col>
                <Col  className='hidden md:block'>
                <img
                  src={Logo?.url ? (Logo.url) : 'https://www.pinclipart.com/picdir/middle/357-3579339_unknown-person-icon-png-wordpress-clipart.png'}
                  alt="avatar"
                  style={{ maxWidth: '100%', maxHeight: '60px', textAlign: 'right' }}
                />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={20}>
                <Form.Item
                  name="shop_name"
                  label="Unique Name"
                  tooltip="Unique name for the organization. This name will be used to generate a custom link for your organization. eg: www.eshop.nfour.com/in/shop-name"
                  rules={[
                    { required: true, message: 'Please input the unique name!' },
                    { validator: validateShopName }
                  ]}
                >
                  <Input placeholder="shop-name" />
                </Form.Item>
                </Col>
                {/* <Col xs={24} sm={12}>
                    <Form.Item
                    label="City"
                    name="city"
                    >
                    <Input placeholder="City" />
                    </Form.Item>
                </Col> */}
            </Row>
          
          
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                    tooltip="Your Organization is registered with any Tax based on your country?"
                    label="Tax Type"
                    name="tax_type"
                    rules={[
                        { required: true, message: 'Please select tax type' }
                    ]}
                    >
                      <Select placeholder="Select Tax Type" onChange={(value)=> setState({...state,taxTypes:value})}>
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
                label="Tax Number"
                name="taxNumber"
                >
                <Input 
                disabled={state.taxTypes === 'None' || state.taxTypes === '' ?true:false} placeholder="Tax Number" />
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please select your country' }]}
                >
                <Select placeholder="Select Country" value={state.country} onChange={handleCountryChange}>
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
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please select your state' }]}
                >
                <Select placeholder="Select State">
                {selectedstates.map((state) => (
                  <Option key={state.id} value={state.id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="Building No/Name"
                    name="building"
                    >
                    <Input placeholder="Building" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="City"
                    name="city"
                    >
                    <Input placeholder="City" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="Street"
                    name="street"
                    >
                    <Input placeholder="Street / Land Mark" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="Pin Code"
                    name="pin"
                    >
                    <Input placeholder="PIN Code" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
            <Col xs={24} sm={12}>
                    <Form.Item
                      tooltip="Types of organization you can belong to"
                      label="Type"
                      name="org_type"
                      rules={[
                          { required: true, message: 'Please select organization type' }
                      ]}
                      >
                        <Select placeholder="Select Organization Type" onChange={(value)=> setState({...state,orgTypes:value})}>
                          {orgTypes.map((type) => (
                          <Option key={type.id} value={type.id}>
                              {type.name}
                          </Option>
                          ))}
                      </Select>

                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                      tooltip="The product categories can be quite extensive to cover a wide range of goods"
                      label="Category"
                      name="category"
                      rules={[
                          { required: true, message: 'Please select product category' }
                      ]}
                      >
                        <Select placeholder="Select Product Category" onChange={(value)=> setState({...state,category:value})}>
                          {categories.map((type) => (
                          <Option key={type.id} value={type.id}>
                              {type.name}
                          </Option>
                          ))}
                      </Select>

                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                    <Input addonBefore="+91" placeholder="Phone Number" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Logo" >
              <Input  type='file' accept="image/*" onChange={handleFileChange}/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block >
                Register
              </Button>
            </Form.Item>


        </Form>
      </Modal>
  )
}

export default RegisterOrg