'use client';
import ProductDetails from './ProductDetails';
import ListRating from './ListRating';
import NewProducts from '@/components/NewProducts';
import AddRating from './AddRating';
import Navbar from '@/components/Navbar';
import HeaderMain from '@/components/HeaderMain';
import MobNavbar from '@/components/MobNavbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Product = ({params}) => {
console.log('params==>',params); 
const user = params 
const shopname = params.shopName;
const productId = params.productId;
const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

const [product, setProduct] = useState()
const [loader, setLoader] = useState(false)

useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${EshopBaseUrlV1}/products/get-details/${productId}/`)
            if (response.data.status === 1000){
                console.log("response.data.data===>",response.data.data);
                const result = response.data.data
                setProduct(result)
                // setInitialValues({
                //     ...initialValues,
                //     is_active:result.is_active,
                //     heading:result.heading,
                //     view_order:result.order,
                //     sub_heading:result.sub_heading,
                //     content:result.description,
                //     link:result.link,
                //     // image:result.image,
                // })
                
            }else if (response.data.status === 1001){
                toast.error("ERROR: "+response.data.message)
            }else{
                toast.error('Something went wrong!')
            }
        } catch (error) {
            console.log("error123: " + error);
        }
        // setLoader(false)
    }

    fetchProduct();

}, [])

console.log("product====>", product);

// const product = {
//     id: 'wert345dfg1243',
//     name: 'Apple Macbook Air M1, 8GB/256GB Silver Gray',
//     description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda exercitationem aliquid tempore sit, culpa non unde consequuntur modi asperiores illum earum distinctio iure excepturi iste, deserunt minus aspernatur quasi aperiam.",
//     rating: 4.5,
//     price: 70,
//     brand: 'Apple',
//     category: "Laptop",
//     inStock: true,
//     image_type: 'none',
//     variants: [
//         {
//             id: '123',
//             name: 'Black'
//         },
//         {
//             id: '124',
//             name: 'White'
//         },
//     ],
//     images:[
//         {
//             // color: "Black",
//             // colorCode: "#000000",
//             id: '122',
//             image: "/jacket-1.png"
//         },
//         {
//             // color: "Blue",
//             // colorCode: "blue",
//             id: '1233',
//             image: "/t-shirt-1.jpg"
//         },
//         {
//             // color: "Red",
//             // colorCode: "red",
//             id: '1244',
//             image: "/bag-1.webp"
//         },
//     ],
//     reviews:[
//         {
//             id: 1,
//             user: {
//                 name: 'Nishal Muhammed',
//             },
//             createdDate: '2024-03-23',
//             rating: 4,
//             comment: 'I really liked it!!'

//         },
//         {
//             id: 2,
//             user: {
//                 name: 'Naadh',
//             },
//             createdDate: '2024-06-23',
//             rating: 2.5,
//             comment: 'Ok tobe okay !!'

//         },
//         {
//             id: 3,
//             user: {
//                 name: 'Nihal',
//             },
//             createdDate: '2024-05-23',
//             rating: 5,
//             comment: 'Its awsome product mann!!'

//         },
//     ]

// }
return (
    <>
    <HeaderMain />
    <Navbar />
    <MobNavbar />

    {product &&
        <div className='p-8'>
            <div className="container">
                <ProductDetails product={product} shopname={shopname} />
            </div>

            <NewProducts organization_id={organizationDetails?.id} setLoader={setLoader} />

            <div className='container flex flex-col mt-20 gap-4'>
                <AddRating product={product} user={user} />
                <ListRating product={product} />
            </div>
            {/* </div> */}
        </div>
    }

    <Footer />
    </>
  )
}

export default Product