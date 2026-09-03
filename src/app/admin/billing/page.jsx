'use client'
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import { Row, Col, Card,  Modal, Select, Input, Button } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {ExclamationCircleFilled, GoogleOutlined } from '@ant-design/icons';
import axiosInstance from '@/utils/axiosInstance';
import Plans from './PlansTable';
const { confirm } = Modal;

const { Option } = Select;

const Billing = () => {
  const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

    const [isModalVisible, setIsModalVisible] = useState(false);
  const [plan, setPlan] = useState('lite');
  const [addon, setAddon] = useState(1);
  const [totalAmount, setTotalAmount] = useState(199);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [payments, setPayments] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  // const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('orgId',organizationDetails?.id)

    const response = await axiosInstance.post(AccountsBaseUrl+`/v1/payments/validate_payment/`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.status === 1000){
      toast.success('Updated successfully.');
      setIsModalOpen(false)
      // router.push('/admin')
    }
  
    // fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('File uploaded successfully', data);
    //   })
    //   .catch(error => {
    //     console.error('Error uploading file:', error);
    //   });
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (screenshot) {
      // Call the upload API
      handleUpload(screenshot);
    } else {
      alert("Please upload a screenshot.");
    }
  };

  // Pricing logic (example: Plan and Addon prices)
  const editions = {
    lite: 0,
    premium: 0,
    enterprise: 0,
  };

  const addonPrices = {
    1: 199,
    6: 1149,
    12: 1999,
  };

  // const validCoupons = {
  //   'WELCOME10': 10,  // 10% discount
  //   'WELCOMESP20': 20,  // 20% discount
  // };

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle dropdown selections
  const handlePlanChange = (value) => {
    setPlan(value);
    calculateTotal(value, addon, discount);
  };

  const handleAddonChange = (value) => {
    setAddon(value);
    calculateTotal(plan, value, discount);
  };

  // Handle coupon code application
  const handleApplyCoupon = async () => {
    try {
      const payload = {
        code: coupon,
        orgId: organizationDetails.id,
      }
      const response = await axiosInstance.post(`${AccountsBaseUrl}/v1/payments/validate_coupon/`,payload)
      if (response.data.status === 1000){
        const discountPercentage = response.data.percent;
        setDiscount(discountPercentage);
        toast.success(`Coupon applied! You got ${discountPercentage}% off.`);
        calculateTotal(plan, addon, discountPercentage);
      }else if (response.data.status === 1001){
        toast.error(response.data.message);
        setDiscount(0);
        calculateTotal(plan, addon, 0);
      } else {
        toast.error('Something went wrong!');
        setDiscount(0);
        calculateTotal(plan, addon, 0);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }

    // if (validCoupons[coupon]) {
    //   const discountPercentage = validCoupons[coupon];
    //   setDiscount(discountPercentage);
    //   toast.success(`Coupon applied! You got ${discountPercentage}% off.`);
    //   calculateTotal(plan, addon, discountPercentage);
    // } else {
    //   toast.error('Invalid coupon code.');
    //   setDiscount(0);
    //   calculateTotal(plan, addon, 0);
    // }
  };

  // Calculate total amount with discount applied
  const calculateTotal = (selectedPlan, selectedAddon, appliedDiscount) => {
    const planPrice = editions[selectedPlan] || 0;
    const addonPrice = addonPrices[selectedAddon] || 0;
    const total = planPrice + addonPrice;
    console.log("selectedAddon==>",selectedAddon);
    console.log("planPrice==>",planPrice);
    console.log("addonPrice==>",addonPrice);
    console.log("total==>",total);
    
    const discountedTotal = total - (total * appliedDiscount / 100);
    setTotalAmount(discountedTotal);
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Buy Now action
  const createTransactionAPI = async () => {
    try {
      const payload = {
        orgId: organizationDetails.id,
        edition: plan,
        plan: addon,
        amount: totalAmount,
        coupon: coupon,
      }
      const response = await axiosInstance.post(`${AccountsBaseUrl}/v1/payments/create_transaction/`, payload)
      if (response.data.status === 1000) {
        // Add payment gateway integration logic here
        fetchTransactions()
        const transaction_id = response.data.transaction_id
        const recipient = 'nfoureshop@axl'; // Replace with the actual recipient email or phone
        const amount = totalAmount.toFixed(2); // Format amount
        const description = `Purchase for ${plan} plan${addon ? ' with ' + addon : ''}`;
        
        // Generate Google Pay link
    
        // const googlePayLink = `https://pay.google.com/gp/p2p?action=pay&recipient=${recipient}&amount=${amount}&currency=INR&description=${encodeURIComponent(description)}`;
        const googlePayLink = `upi://pay?pa=${recipient}&am=${amount}&pn=${encodeURIComponent('NFOUR eShop')}&cu=INR&tn=${encodeURIComponent(transaction_id)}`;
        // const upiPayLink = `upi://pay?cu=INR&pa=${recipient}&pn=nfour&am=100`
        // upi://pay?pa=user@hdfgbank&pn=SenderName&tn=TestingGpay&am=100&cu=INR
        // Open Google Pay link in a new tab
        handleCancel()
        window.open(googlePayLink, '_blank');
      }else if(response.data.status === 1001){
        toast.error(response.data.message);
      }else{
        toast.error('Something went wrong!');
      }
    } catch (e) {
      console.log("error creating transaction", e);
    }
  }
  const handleBuyNow = () => {
    // confirm(`Proceeding with a total of ₹${totalAmount}`);
    confirm({
      title: 'Confirm amount',
      icon: <ExclamationCircleFilled />,
      content: `Proceeding with a total of ₹${totalAmount}`,
      onOk() {
        console.log('OK');
        createTransactionAPI()
        
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };



    const handlePayment = async () => {
        // Initiate payment by calling Django's initiate_payment endpoint
        try {
          const response = await axios.post(AccountsBaseUrl+'/v1/payments/initiate/');
          const upiLink = response.data.upi_link;
            console.log("upiLink: " + upiLink);
            
          // Redirect user to UPI payment link
        //   window.location.href = upiLink;
        } catch (error) {
          console.error('Payment initiation failed:', error);
        }
      };


      // const payments = [
      //   {
      //     id: 1,
      //     date: '2024-10-15',
      //     amount: '$100.00',
      //     transactionId: 'TX123456',
      //     status: 'Paid',
      //   },
      //   {
      //     id: 2,
      //     date: '2024-10-16',
      //     amount: '$50.00',
      //     transactionId: 'TX654321',
      //     status: 'Pending',
      //   },
      //   {
      //     id: 3,
      //     date: '2024-10-17',
      //     amount: '$75.00',
      //     transactionId: 'TX987654',
      //     status: 'Failed',
      //   },
      // ];
    
      // Function to get color based on status
      const getStatusColor = (status) => {
        switch (status) {
          case 1:
            return 'bg-green-500';
          case 0:
            return 'bg-yellow-500';
          case 2:
            return 'bg-red-500';
          default:
            return 'bg-gray-500';
        }
      };

       // Open the modal and set the current transaction
  const openModal = (transactionId) => {
    setCurrentTransaction(transactionId);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
    setScreenshot(null);
    // setMessage('');
  };

  // Handle file change
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please upload a screenshot.');
      return;
    }
    // Submit logic (e.g., API request to upload the file)
    setMessage('Screenshot submitted successfully!');
    closeModal();
  };
  const fetchTransactions = async () =>{
    try {
      const response = await axiosInstance.get(`${AccountsBaseUrl}/v1/payments/transactions/${organizationDetails.id}`);
      if (response.data.status === 1000) {
        setPayments(response.data.data);
      } else {
        console.error('Error fetching transactions:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  useEffect(() => {

    fetchTransactions()
  }, [])
  
  return (
    <div style={{ padding: '50px', background: '#fff', textAlign: 'center' }}>
      {/* <h2 className="text-2xl text-gray-700 mb-6">Plan Details</h2> */}
      <h1 className="text-2xl font-bold text-center mb-8">NFOUR eShop Plans</h1>

      <Row gutter={16} justify="center">
      
      {/* Lite Plan */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Lite Edition" bordered={false}>
          <p style={{ textDecoration: 'line-through', color: 'red' }}>₹249/month</p>
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹199/month</p>
          <p className='p-3'>Perfect for new businesses</p>
          <ul className="list-disc text-left ml-6">
            <li>Basic uploading limits</li>
            <li>Email support</li>
            <li>Access to the admin portal</li>
            <li>1 User account</li>
            <li>Custom Domain</li>
          </ul>
          <p className="mt-3">6 months: ₹1149 (₹192/month)</p>
          <p>1 year: ₹1999 <span className='text-green-700'>(₹167/month)</span></p>
          <p><a type="link" href='#detail_plans' >Show more</a></p>
          <Button type="primary" className='m-2 mt-7' onClick={showModal}>Checkout</Button>
        </Card>
      </Col>

      {/* Pro Plan */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Pro Edition" bordered={false}>
          <p style={{ textDecoration: 'line-through', color: 'red' }}>₹499/month</p>
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹299/month</p>
          <p className='p-3'>Advanced tools for growing businesses</p>
          <ul className="list-disc text-left ml-6">
            <li>Advanced analytics</li>
            <li>Priority email support</li>
            <li>Up to 5 user accounts</li>
            <li>Custom branding</li>
          </ul>
          <p className="mt-3">6 months: ₹1739 (₹290/month)</p>
          <p>1 year: ₹3399 <span className='text-green-700'>(₹283/month)</span></p>
          <p><a type="link" href='#detail_plans' >Show more</a></p>
          <Button type="primary" className='m-2' disabled>Checkout</Button>
        </Card>
      </Col>

      {/* Enterprise Plan */}
      <Col xs={24} sm={12} md={8}>
        <Card title="Enterprise Edition" bordered={false}>
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>₹</p>
          <p>Contact us for pricing</p>
          <p className='p-3'>Custom solutions for large enterprises</p>
          <ul className="list-disc text-left ml-6">
            <li>Unlimited users</li>
            <li>Dedicated account manager</li>
            <li>24/7 support</li>
            <li>Custom integrations</li>
          </ul>
          <p><a type="link" href='#detail_plans' >Show more</a></p>
          <Button type="primary" className='m-2 mt-[70px]'>Contact Us</Button>
        </Card>
      </Col>

    </Row>


    <div className="p-6 mt-5 mb-7">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 ">Amount</th>
              <th className="py-3 px-6 text-left">Transaction ID</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="py-3 px-6 text-left">{payment.date}</td>
                
                <td className="py-3 px-6">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payment.amount)}</td>
                <td className="py-3 px-6 text-left">{payment.transaction_id}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(
                        payment.status
                      )}`}
                    ></div>
                    <span>{payment.status === 0 ? 'Pending' : payment.status === 1 ? 'Paid' : 'Failed'}</span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  {payment.status !== 1 && (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => openModal(payment.transactionId)}
                    >
                      Submit Screenshot
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Submit Screenshot</h2>
            <p>Transaction ID: {currentTransaction}</p>
            <form onSubmit={handleUploadSubmit}>
              <div className="my-4">
                <label className="block mb-2 text-lg">Upload Screenshot:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full p-2 border rounded-md"
                />
              </div>
              {message && <p className="text-red-600">{message}</p>}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

      <hr />
      <Plans  />

      <Modal
        title="Select Your Plan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="custom-modal" // Tailwind styling for modal
      >
        <div className="space-y-4">
          {/* Dropdown for Plan Selection */}
          <div>
            <label className="block text-gray-700">Select Plan:</label>
            <Select
              placeholder="Select a Plan"
              className="w-full"
              onChange={handlePlanChange}
              defaultValue="lite"
            >
              <Option value="lite">Lite Edition</Option>
              <Option value="premium" disabled>Premium Edition</Option>
              <Option value="enterprise" disabled>Enterprise Edition</Option>
            </Select>
          </div>

          {/* Dropdown for Addon Selection */}
          <div>
            <label className="block text-gray-700">Select validity:</label>
            <Select
              placeholder="Select an Add-on"
              className="w-full"
              onChange={handleAddonChange}
              defaultValue="1"
            >
              <Option value="1">1 month - ₹199</Option>
              <Option value="6">6 months - ₹1149</Option>
              <Option value="12">12 months - ₹1999</Option>
            </Select>
          </div>

          {/* Coupon Code Input */}
          <div>
            <label className="block text-gray-700">Coupon Code:</label>
            <Input
              placeholder="Enter Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="w-full"
            />
            <Button
              className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleApplyCoupon}
            >
              Apply Coupon
            </Button>
          </div>

          {/* Total Amount Display */}
          <div className="text-xl font-semibold">
            Total: ₹{totalAmount}
          </div>

          {/* Buy Now Button */}
          <div className="text-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleBuyNow}

            >
              Buy Now (UPI)
            </button>
            {/* <button
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                onClick={handleBuyNow}
                >
                <GoogleOutlined style={{color:"gray"}} className='pr-2'/> 
                Buy with Google Pay
                </button> */}
                <p className="mt-3">
                    <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline ml-4"
                    onClick={() => {openModal("payment.transactionId") 
                      handleCancel()}}
                    >
                    Already Paid?
                    </a>
                </p>

                {/* {showUpload && (
                <div className="mt-4">
                <form onSubmit={handleUploadSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Screenshot
                    </label>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                    <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mt-3 rounded"
                    >
                    Submit
                    </button>
                </form>
                </div>
            )} */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Billing;