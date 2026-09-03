'use client';
import HeaderMain from "@/components/HeaderMain";
import FilterList from "./FilterList";
import ListProducts from "./ListProducts"
import { useParams, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { EshopBaseUrlV1 } from "@/utils/GlobalVariables";
import toast from "react-hot-toast";
import { Button, Drawer } from "antd";
import Loader from "@/components/Loader";
import MobNavbar from "@/components/MobNavbar";


const page = () => {
  const params = useParams();
  const organizationDetails = JSON.parse(localStorage.getItem('organizationDetails'));
  // const shopname = organizationDetails?.name
  const queryParams = useSearchParams()
  const search = queryParams.get('q');
  console.log("search------>",search);

  const [loader, setLoader] = useState(true)
  const [state, setState] = useState({
    search: "",
    categories: [],
    variants: [],
    brands: [],
    selectedCategories: [],
    selectedVariants: [],
    selectedBrands: [],
    products: [],
    sort: 1,
    page: 1,
  })
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchInitial = async () => {
        try {
            const organization_id = organizationDetails.id
            const catPayload = {
                organization_id: organization_id,
                data: []
            }
            const brandPayload = {
                organization_id: organization_id,
                data: []
            }
            const catgoryResponse = await axios.post(`${EshopBaseUrlV1}/products/list-categories/`,catPayload)
            const brandsResponse = await axios.post(`${EshopBaseUrlV1}/products/list-brands/`, brandPayload)
            if (catgoryResponse.data.status === 1000 && brandsResponse.data.status === 1000){
                console.log("response.data.data===>",catgoryResponse.data.data);
                const productPayload = {
                  organization_id: organization_id,
                  search: search ? search : "",
                  selected_brands: state.selectedBrands,
                  selected_variants: state.selectedVariants,
                  selected_categories: state.selectedCategories,
                  page: state.page,
                  sort: state.sort,
                  data: []
                }
                const productResponse = await axios.post(`${EshopBaseUrlV1}/products/list-products/`, productPayload)

                
                setState({
                   ...state,
                    categories: catgoryResponse.data.data,
                    brands: brandsResponse.data.data,
                    products: productResponse.data.data,
                })
                
            }else if (catgoryResponse.data.status === 1001){
                toast.error("ERROR: "+catgoryResponse.data.message)
            }else{
                toast.error('Something went wrong!')
            }
        } catch (error) {
            console.log("error123: " + error);
        }
        setLoader(false)
    }

    fetchInitial();

}, [search, state.selectedBrands, state.selectedVariants, state.selectedCategories, state.sort])

console.log("state=88==>",state);


  return (
    <>
    {loader && <Loader lite />}
    <HeaderMain setLoader={setLoader} />
    <MobNavbar showDrawer={showDrawer} />

    <div>
    <Drawer title="Apply" onClose={onClose} open={open} placement="left" width={300}>
      <FilterList categories={state.categories} variants={state.variants} brands={state.brands} sort={state.sort} setState={setState} />
    </Drawer>
    </div>
    <div className="">
      <div className="container">
        <div className="grid lg:grid-cols-8 py-8 gap-3 ">
          <div className="hidden lg:flex lg:col-span-2">
            <FilterList categories={state.categories} variants={state.variants} brands={state.brands} sort={state.sort} setState={setState}/>
          </div>
          <div className="lg:col-span-6">
            <ListProducts showDrawer={showDrawer} productData={state.products} setLoader={setLoader} />
          </div>
        </div>
      </div>
    </div>
    <Footer />

    </>
  )
}

export default page