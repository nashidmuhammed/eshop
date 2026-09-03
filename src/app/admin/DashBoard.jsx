import { EyeOutlined, RiseOutlined, FallOutlined, ShoppingCartOutlined, ShoppingOutlined, TeamOutlined } from '@ant-design/icons';
import LineChart from './dashboard/LineChart';
import BarGraph from './dashboard/BarGraph';
import TopProducts from './dashboard/TopProducts';
import TopCustomers from './dashboard/TopCustomers';

const DashBoard = () => {
  return (
    <div>
        <div className="mx-auto max-w-screen-2xl ">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            {/* <!-- Card Item Start --> */}
                  <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
                    <div className="flex  items-center justify-center rounded-full bg-slate-700  p-3 ">
                    <EyeOutlined style={{fontSize:'30px'}} className='text-white' />
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <h4  className="font-bold text-white text-lg">
                          $3.456K
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Total views</span>
                      </div>

                      <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-[#12b981]" >
                        0.43%
                        <RiseOutlined />
                      </span>
                    </div>
                  </div>
            {/* <!-- Card Item End --> */}
            {/* <!-- Card Item Start --> */}
                  <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
                    <div className="flex  items-center justify-center rounded-full bg-slate-700  p-3 ">
                    <ShoppingCartOutlined style={{fontSize:'30px'}} className='text-white' />
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <h4  className="font-bold text-white text-lg">
                          $3.456K
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Total Profit</span>
                      </div>

                      <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-[#12b981]" >
                        0.43%
                        <RiseOutlined />
                      </span>
                    </div>
                  </div>
            {/* <!-- Card Item End --> */}
            {/* <!-- Card Item Start --> */}
                  <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
                    <div className="flex  items-center justify-center rounded-full bg-slate-700  p-3 ">
                    <ShoppingOutlined style={{fontSize:'30px'}} className='text-white' />
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <h4  className="font-bold text-white text-lg">
                          $3.456K
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Total Sales</span>
                      </div>

                      <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-[#12b981]" >
                        0.43%
                        <RiseOutlined />
                      </span>
                    </div>
                  </div>
            {/* <!-- Card Item End --> */}
            {/* <!-- Card Item Start --> */}
                  <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
                    <div className="flex  items-center justify-center rounded-full bg-slate-700  p-3 ">
                    <TeamOutlined style={{fontSize:'30px'}} className='text-white' />
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <h4  className="font-bold text-white text-lg">
                          $3.456K
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Total Users</span>
                      </div>

                      <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-[#249ae6]" >
                        0.43%
                        <FallOutlined />
                      </span>
                    </div>
                  </div>
            {/* <!-- Card Item End --> */}
          </div>

          <div className=" mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
          {/* <!-- Card Item Start --> */}
          <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
              <div className="flex  items-center justify-center rounded-full bg-orange-400  p-3 text-lg">
                Pending Orders: <span className='font-bold ml-1'> 23</span>
              </div>

                   
          </div>
            {/* <!-- Card Item End --> */}
            {/* <!-- Card Item Start --> */}
            <div className="border rounded-lg border-slate-900  bord px-7.5 py-6 p-5 bg-[#23303f]">
                    

                    <div className=" flex items-end justify-between">
                    <div>
                        <h4  className="font-bold text-blue-400 text-xl text-center">
                          7
                        </h4>
                        <span className="text-sm font-medium text-slate-400">On-going</span>
                      </div>
                    <div>
                        <h4  className="font-bold text-red-400 text-xl text-center">
                          1
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Cancelled</span>
                      </div>
                      <div>
                        <h4  className="font-bold text-green-500 text-xl  text-center">
                          3
                        </h4>
                        <span className="text-sm font-medium text-slate-400">Delivered</span>
                      </div>

                    </div>
                  </div>
            {/* <!-- Card Item End --> */}
          </div>
          <div className="gap-5 lg:columns-2 mt-5 p-4">
            <div className="w-full">
              <LineChart />
            </div>
            <div className="w-full">
              <BarGraph />
            </div>
          </div>
          <div className="gap-5 lg:columns-2 mt-5 p-4">
            <div className="w-full">
              <TopProducts />
            </div>
            <div className="w-full">
              <TopCustomers />
            </div>
          </div>
        </div>
    </div>
  )
}

export default DashBoard