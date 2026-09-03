'user client';
import ProductCard from '@/components/ProductCard';
import { truncateString } from '@/utils/functions';
import { Button } from 'antd';
// import { useRouter } from 'next/router'

const ListProducts = ({showDrawer, productData, setLoader}) => {

  // const router = useRouter


  return (
    <div>
        <div className="mb-5">
            <div className='flex justify-between '>
            {/* <div className='lg:hidden' >
                <Button type='primary' onClick={showDrawer} >Filter </Button>
            </div> */}
            <h2 className="font-medium text-xl pb-4 ml-3">Explore Products</h2>
            </div>
            <div className="bg-gray-100 w-full min-h-3 gap-1 lg:gap-2 flex-wrap flex justify-center items-center">
              
              {productData.map((item, index) => 
              <ProductCard
                key={index}
                img={item.images}
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
            {/* <div className="grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 xl:gap-x-7 xl:gap-y-7">
              {productData.map((item, index) => 
              <ProductCard
                key={index}
                img={item.images}
                title={item.name}
                desc={item.description ? truncateString(item.description, 55) : ""}
                rating={item.rating}
                price={item.price}
                id={item.id}
                setLoader={setLoader}
              />
              )}
            </div> */}
        </div>
    </div>
  )
}

export default ListProducts