import React, { useState } from 'react';
import { Checkbox, Divider, Input, Radio, Space } from 'antd';
const FilterList = ({categories, variants, brands, sort, setState}) => {
  const [value, setValue] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);   // State to store selected brand ids
  const [selectedCategories, setSelectedCategories] = useState([]); // State to store selected category ids
  const [selectedVariant, setSelectedVariant] = useState([]); // State to store selected category ids

  const categoryOptions = [
    {
      label: 'Apple',
      value: 'Apple',
    },
    {
      label: 'Pear',
      value: 'Pear',
    },
    {
      label: 'Orange',
      value: 'Orange',
    },
  ];
  const colorOptions = [
    {
      label: 'Black',
      value: 'Black',
    },
    {
      label: 'White',
      value: 'White',
    },
    {
      label: 'Red',
      value: 'Red',
    },
  ];
  const sizeOptions = [
    {
      label: 'XS',
      value: 'XS',
    },
    {
      label: 'S',
      value: 'S',
    },
    {
      label: 'M',
      value: 'M',
    },
    {
      label: 'L',
      value: 'L',
    },
    {
      label: 'XL',
      value: 'XL',
    },
  ];
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    // setValue(e.target.value);
    // setState({...state, sort: parseInt(e.target.value) })
    setState(prevState => ({
      ...prevState,
      sort: parseInt(e.target.value)
  }));
  };

//   const handleCheckboxChange = (event, id, type) => {
//     const isChecked = event.target.checked;

//     if (type === 'brand') {
//         if (isChecked) {
//             // Add brand id to selectedBrands if checked
//             setSelectedBrands(prev => [...prev, id]);
//         } else {
//             // Remove brand id from selectedBrands if unchecked
//             setSelectedBrands(prev => prev.filter(brandId => brandId !== id));
//         }
//     } else if (type === 'category') {
//         if (isChecked) {
//             // Add category id to selectedCategories if checked
//             setSelectedCategories(prev => [...prev, id]);
//         } else {
//             // Remove category id from selectedCategories if unchecked
//             setSelectedCategories(prev => prev.filter(categoryId => categoryId !== id));
//         }
//     } else if (type === 'variant') {
//       if (isChecked) {
//           setSelectedVariant(prev => [...prev, id]);
//       } else {
//           setSelectedVariant(prev => prev.filter(variantId => variantId !== id));
//       }
//   }
// };
const handleCheckboxChange = (event, id, type) => {
  const isChecked = event.target.checked;

  setState(prevState => {
      // Determine which list to update (brands or categories)
      const updatedList = isChecked
          ? [...prevState[type], id]  // Add the id if checked
          : prevState[type].filter(itemId => itemId !== id); // Remove the id if unchecked

      return {
          ...prevState,
          [type]: updatedList   // Update the appropriate list (brands or categories)
      };
  });
};

  
  return (
    <div className="container rounded-lg p-5" style={{background:'#d3d3d357'}}>
        <h2 className="font-medium text-2xl pb-1">Filter By</h2>
        
        <div>
        <Divider style={{marginBottom: '10px'}} orientation="left" className='m-0'>Sorting Order</Divider>
        <Radio.Group onChange={onChange} value={sort}>
        <Space direction="vertical">
            <Radio value={1}>Newest</Radio>
            <Radio value={2}>Price Low - High</Radio>
            <Radio value={3}>Price High - Low</Radio>
        </Space>
        </Radio.Group>
        </div>
        <div  className='mt-5'>
        <Divider style={{marginBottom: '10px'}}  orientation="left">Categories</Divider>
            {categories.map(option => (
            <div key={option.id} className='mb-1'>
                <Checkbox value={option.id} onChange={(e) => handleCheckboxChange(e, option.id, 'selectedCategories')}>{option.name}</Checkbox>
            </div>
            ))}
        </div>
        {variants.length > 0 &&
          <div  className='mt-5'>
          <Divider style={{marginBottom: '10px'}}  orientation="left">Variants</Divider>
              {variants.map(option => (
              <div key={option.id} className='mb-1'>
                  <Checkbox value={option.id} onChange={(e) => handleCheckboxChange(e, option.id, 'selectedVariants')}>{option.name}</Checkbox>
              </div>
              ))}
          </div>
        }
        <div  className='mt-5'>
        <Divider style={{marginBottom: '10px'}}  orientation="left">Brands</Divider>
            {brands.map(option => (
            <div key={option.id} className='mb-1'>
                <Checkbox value={option.id} onChange={(e) => handleCheckboxChange(e, option.id, 'selectedBrands')}>{option.name}</Checkbox>
            </div>
            ))}
        </div>
    </div>
  )
}

export default FilterList