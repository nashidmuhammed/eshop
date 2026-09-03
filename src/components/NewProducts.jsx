'use client';
import { truncateString } from '@/utils/functions';
import ProductCard from './ProductCard'
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
import { SoundOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';


const NewProducts = ({organization_id, setLoader}) => {
  const router = useRouter()
  const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));

  // const router = useRouter
  const [productData, setProductData] = useState([])
  const handleClick = () => {
    setLoader(true)
    router.push(`/in/${organizationDetails.shopname}/explore`);
  };

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const response = await fetch(`${EshopBaseUrlV1}/products/new-products/`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ organization_id: organization_id })
                    }
                );
                const data = await response.json();
                if (data.status === 1000){
                    setProductData(data.data);
                }else{
                    console.error('Error fetching sliders:', data.message);
                }
            } catch(e){
                console.error('Error fetching sliders:', e);
                // toast.error("Some error occurred while fetching sliders");
            }
        }
      fetchNewProducts();
    }, [organization_id])

    
  return (
    <>
          {/* <div  className="w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl mt-4 mb-4 lg:mt-0"> */}
          <div className='container pt-16 flex justify-between mb-5'>

            <h2 className="font-medium text-2xl pb-4"><SoundOutlined style={{color:"orange"}}/> Latest Arrivals</h2>
            <Button onClick={handleClick} >Explore more</Button>
          </div>
          <div className="lg:container bg-gray-100 w-full min-h-3 gap-1 lg:gap-6 xl:gap-5 flex-wrap flex justify-center items-center">
              
              {productData.map((item, index) => 
              <ProductCard
                key={index}
                img={item.images[0]}
                title={item.name}
                desc={item.description ? truncateString(item.description, 75) : "...\n...\n..."}
                rating={item.rating}
                price={item.price}
                mrp={item.mrp}
                id={item.id}
                setLoader={setLoader}
              />
              )}
          </div>
          
        {/* <div className="container pt-16">
            <h2 className="font-medium text-2xl pb-4">Latest Arrivals</h2>
            <div className="grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 xl:gap-x-20 xl:gap-y-10">
              
              {productData.map((item, index) => 
              <ProductCard
                key={index}
                img={item.images[0]}
                title={item.name}
                desc={item.description ? truncateString(item.description, 55) : ""}
                rating={item.rating}
                price={item.price}
                id={item.id}
                setLoader={setLoader}
              />
              )}
            </div>
        </div> */}
    </>
  )
}

export default NewProducts