'use client'
import NButton from "@/components/NButton"
import { useCart } from "@/hooks/useCart"
import Link from "next/link"
import { MdArrowBack } from "react-icons/md"
import ItemContent from "./ItemContent"
import { roundOffNumber } from "@/utils/functions"
import { useState } from "react"
import { Input, Modal } from "antd"
import toast from "react-hot-toast"
const { TextArea } = Input;

const CartClient = ({shopname}) => {
  const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

  const {cartProducts, handleClearCart, cartTotalQty, cartTotalAmount} = useCart()
  // const orgCartProducts = cartProducts?.filter(product => product.orgId === organizationDetails?.id)
  const orgCartProducts = cartProducts
  console.log("cartProducts==>",cartProducts);
  console.log("orgCartProducts==>",orgCartProducts);
  console.log("organizationDetails?.id==>",organizationDetails?.id);
  
  const base_url = window.location.origin;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  if(!orgCartProducts || orgCartProducts.length === 0){
    return(
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your cart is empty</div>
        <div>
          <Link href={`/in/${shopname}/`} className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack />
            <span>Start shopping</span>
          </Link>
        </div>
      </div>
    )
  }

  const buyWhatsApp = async () => {
    if(!formData.name || !formData.address || !formData.phone){
      toast.error('Please fill all the fields')
      return
    }else{
      const message = orgCartProducts.map((product, index) => `
          =>Item ${index + 1}:
          - Name: ${product.name}
          - product_code: ${product.product_code}
          - Variant: ${product.selectedVariant.name} 
          - Quantity: ${product.qty}
          - Price: ₹ ${product.price}
          - Total: ₹ ${product.qty * product.price}
          - Link: ${base_url}/in/${shopname}/product/${product.id} 
      `).join('\n')+ `
        Total Quantity: ${cartTotalQty}
        Total Amount: ₹ ${cartTotalAmount}
        \n-----*-----
        Name: ${formData.name}
        Delivery Address: ${formData.address}
        Contact Phone: ${formData.phone}
        `;
  
      const encodedMessage = encodeURIComponent(message.trim());
      const phoneNumber = organizationDetails.phone_number
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
      window.open(whatsappUrl, '_blank');

    }
    
    
  }

  return (
    <div>
      <h2 className='text-3xl font-medium text-slate-700 text-center'>Shopping Cart</h2>
      
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
        
        <div className="col-span-2 justify-self-start">
          PRODUCT
        </div>
        <div className="justify-self-center">
          PRICE
        </div>
        <div className="justify-self-center">
          QUANTITY
        </div>
        <div className="justify-self-end">
          TOTAL
        </div>
      </div>
      <div>
        {orgCartProducts &&
          orgCartProducts.map((item) => {
            return (<ItemContent key={item.id} item={item} shopname={shopname} /> )
          })
        }
      </div>
      <div className="border-t-[1.5px] border-r-slate-200 py-4 flex justify-between gap-4">
        <div className="w-[90px]">
          <NButton label="Clear Cart" onClick={() => handleClearCart()} small outline />
        </div>
        <div className="text-sm flex flex-col gap-1 items-start">
          <div className="flex justify-between w-full text-base font-semibold">
            <span>Subtotal</span>
            <span>
              {/* ₹ {roundOffNumber(cartTotalAmount, 2)} */}
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(cartTotalAmount)}
            </span>
          </div>
          <p className="text-slate-500">Taxes and shipping calculated at checkout</p>
          {/* <NButton label="Checkout" onClick={() => {}} disabled={true} /> */}
          <NButton label="Buy on WhatsApp" onClick={() => showModal()} wb />
          <Link href={`/in/${shopname}/`} className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack />
            <span>Countinue shopping</span>
          </Link>
        </div>
      </div>

      <Modal 
        title="Add address" 
        open={isModalOpen} 
        onOk={buyWhatsApp} 
        okText="Submit"
        onCancel={handleCancel}
        >
        <p>Name: </p>
        <Input placeholder="Enter your name" name="name" value={formData.name} onChange={handleChange} />
        <p className="mt-3">Phone: </p>
        <Input placeholder="Enter your phone number" name="phone" value={formData.phone} onChange={handleChange} />
        <p className="mt-3">Address: </p>
        <TextArea placeholder="Enter your post address" rows={4} name="address" value={formData.address} onChange={handleChange} />
      </Modal>
    </div>

  )
}

export default CartClient