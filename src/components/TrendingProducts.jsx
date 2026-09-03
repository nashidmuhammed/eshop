'use client';
import { truncateString } from '@/utils/functions';
import ProductCard from './ProductCard'
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
import { RiseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const TrendingProducts = ({organization_id, setLoader}) => {
  const router = useRouter()
  const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));


  // const router = useRouter
  const [productData, setProductData] = useState([])
  const handleClick = () => {
    setLoader(true)
    router.push(`/in/${organizationDetails.shopname}/explore`);
  };

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const response = await fetch(`${EshopBaseUrlV1}/products/trending-products/`,
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
      fetchTrendingProducts();
    }, [organization_id])

    
  return (
    <div>
      <div className='container pt-16 flex justify-between'>

        <h2 className="font-medium text-2xl pb-4"><RiseOutlined style={{color:"blue"}}/> Trending Now</h2>
        <Button onClick={handleClick}>Explore more</Button>
        </div>
        <div className="bg-gray-100 w-full min-h-3 gap-6 flex-wrap flex justify-center items-center">
          
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
            <h2 className="font-medium text-2xl pb-4">Trending Now</h2>
            <div className="grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 xl:gap-x-20 xl:gap-y-10">
              {productData.map((item, index) => 
              <ProductCard
                key={index}
                img={item.images[0]}
                title={item.name}
                // desc={truncateString(item.description, 55)}
                rating={item.rating}
                price={item.price}
                id={item.id}
                setLoader={setLoader}
              />
              )}
            </div>
        </div> */}
    </div>
  )
}

export default TrendingProducts