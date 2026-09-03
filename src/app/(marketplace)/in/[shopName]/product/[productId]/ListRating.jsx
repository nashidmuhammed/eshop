'user client';

import { Avatar, Rate } from "antd";
import { UserOutlined } from '@ant-design/icons';
import moment from "moment";

const ListRating = ({ product }) => {
  return (
    <div className="">
        <h1 className="font-bold text-2xl">Product Review</h1>
        <div className="text-sm mt-2">
            {product.reviews &&
                product.reviews.map((review) => {
                    return (
                        <div key={review?.id}  className="max-w-[300px]">
                            <div className="flex gap-2 items-center">
                                <Avatar size='small' icon={<UserOutlined />} />
                                <div className="font-semibold">
                                    {review?.user?.name}
                                </div>
                                <div className="font-light">
                                    {moment(review.createdDate).fromNow()}
                                </div>
                            </div>
                            <div className="mt-2">
                                <Rate value={review?.rating} disabled allowHalf/>
                                <div className="ml-2">
                                    {review?.comment}
                                </div>
                                <hr className="mt-4 mb-4" />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default ListRating