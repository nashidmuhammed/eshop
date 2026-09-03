"use client";
import Slider from 'react-slick';
import Slide from './Slide';
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Hero = ({organization_id}) => {

    const [sliderData, setSliderData] = useState([])

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await fetch(`${EshopBaseUrlV1}/posters/poster-list/`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ organization_id: organization_id })
                    }
                );
                const data = await response.json();
                if (data.status === 1000){
                    setSliderData(data.data);
                }else{
                    console.error('Error fetching sliders:', data.message);
                }
            } catch(e){
                console.error('Error fetching sliders:', e);
                // toast.error("Some error occurred while fetching sliders");
            }
        }
      fetchSliders();
    }, [organization_id])
    

    var settings = {
        dots: true,
        infinite: sliderData.length > 1,
        // speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
      };
    
    // const sliderData = [
    //     {
    //         id:0,
    //         img: "/banner-1.jpg",
    //         title: "Trending Item",
    //         mainTitle: "WOMEN'S LATEST FASHION SALE",
    //         price: "$20",
    //     },
    //     {
    //         id:1,
    //         img: "/banner-2.jpg",
    //         title: "Trending Accessories",
    //         mainTitle: "MODERN SUNGLASSES",
    //         price: "$15",
    //     },
    //     {
    //         id:2,
    //         img: "/banner-3.jpg",
    //         title: "Sale Offer",
    //         mainTitle: "NEW FASHION SUMMER SALE",
    //         price: "$30",
    //     },
    // ]

    console.log("SliderData===>",sliderData);
    

  return (
    <div>
        <div className="container pt-6 lg:pt-0">
            <Slider {...settings} >
                {sliderData.map((item) => (
                    <Slide
                        key={item.id}
                        img={item.image}
                        title={item.sub_heading}
                        mainTitle={item.heading}
                        link={item.link} 
                        description={item.description}
                        heading_color={item.heading_color}
                        sub_heading_color={item.sub_heading_color}
                        button_color={item.button_color}
                    />
                ))}
            </Slider>
        </div>
    </div>
  )
}

export default Hero