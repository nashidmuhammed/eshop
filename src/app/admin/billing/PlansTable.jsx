// pages/plans.js
import React from 'react';
import { plans } from './plans';

const Plans = () => {
  return (
    <div className="py-12  text-primary px-4" id="detail_plans">
      <h1 className="text-2xl font-bold text-center mb-8">NFOUR eShop Plans Details</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="p-4 bg-primary text-white font-semibold">Feature</th>
              {plans.map((plan) => (
                <th key={plan.title} className="p-4 bg-primary text-white font-semibold">
                  {plan.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border">Products</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-products`} className="p-4 border text-center">
                  {plan.products}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Images</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-images`} className="p-4 border text-center">
                  {plan.images}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Categories</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-categories`} className="p-4 border text-center">
                  {plan.categories}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Brands</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-brands`} className="p-4 border text-center">
                  {plan.brands}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Poster</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-poster`} className="p-4 border text-center">
                  {plan.poster}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">User</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-user`} className="p-4 border text-center">
                  {plan.user}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">About Page</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-aboutPage`} className="p-4 border text-center">
                  {plan.aboutPage ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Variant</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-variant`} className="p-4 border text-center">
                  {plan.variant ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">SubVariant</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-subVariant`} className="p-4 border text-center">
                  {plan.subVariant ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">MultiUnit</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-multiUnit`} className="p-4 border text-center">
                  {plan.multiUnit ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Product Feedback</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-productFeedback`} className="p-4 border text-center">
                  {plan.productFeedback ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Warehouse Management</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-warehouseManagement`} className="p-4 border text-center">
                  {plan.warehouseManagement ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Payment Integration</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-paymentIntegration`} className="p-4 border text-center">
                  {plan.paymentIntegration ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Sales</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-sales`} className="p-4 border text-center">
                  {plan.sales ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Sales Order</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-salesOrder`} className="p-4 border text-center">
                  {plan.salesOrder ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">Sales Return</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-salesReturn`} className="p-4 border text-center">
                  {plan.salesReturn ? '✓' : '✕'}
                </td>
              ))}
            </tr>
            {/* Add rows for all other features as well */}
            <tr>
              <td className="p-4 border">Trial Period</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-trialPeriod`} className="p-4 border text-center">
                  {plan.trialPeriod}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">1 Month Price</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-oneMonth`} className="p-4 border text-center">
                  {plan.oneMonth}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">6 Month Price</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-sixMonth`} className="p-4 border text-center">
                  {plan.sixMonth}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border">12 Month Price</td>
              {plans.map((plan) => (
                <td key={`${plan.title}-twelveMonth`} className="p-4 border text-center">
                  {plan.twelveMonth}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Plans;