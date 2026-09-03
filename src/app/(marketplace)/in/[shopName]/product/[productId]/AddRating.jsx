'use client';
import NButton from "@/components/NButton";
import { Button, Input, Rate } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation"
import { useState } from "react";


const AddRating = ({product, user}) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // const {} = useForm
  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
        <h1 className="font-bold text-2xl">Rate this product</h1>
        <Rate allowHalf />
        <TextArea placeholder="Comment" />
        <NButton label={isLoading ? "Loading" : "Rate Product"} onClick={() => {}} small />
        
    </div>
  )
}

export default AddRating