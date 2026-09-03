// components/SettingsList.js
import { Switch, List, Tooltip } from 'antd';
import { CrownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import axiosInstance from '@/utils/axiosInstance';
import { EshopBaseUrlV1 } from '@/utils/GlobalVariables';
import { useEffect, useState } from 'react';

// const settings = [
//   { type: 0, id: 1, name: 'Enable Notifications', defaultChecked: true, premium: false },
//   { type: 0, id: 'enable_variant', name: (<span>Enable Variant <Tooltip title="Product variants are distinguished by specific attributes, such as size (small, medium, large), color (red, blue, green), or material (cotton, polyester)."><QuestionCircleOutlined /></Tooltip></span>), defaultChecked: false, premium: false },
//   { type: 0, id: 2, name: (<span>Enable SubVariant <Tooltip title="Subvariants are used when a product variant itself can be subdivided into more specific categories. For example, if a t-shirt is a product variant with different colors, a subvariant might be different patterns (striped, plain) within a single color."><QuestionCircleOutlined /></Tooltip></span>), defaultChecked: false, premium: true },
//   { type: 0, id: 3, name: 'Multi unit', defaultChecked: false, premium: true },
//   { type: 0, id: 3, name: 'Payment Gateway', defaultChecked: false, premium: true },
//   { type: 0, id: 4, name: 'Dark Mode', defaultChecked: false, premium: true },
//   { type: 0, id: 5, name: 'Delivery Tracking', defaultChecked: false, premium: true },
// ];
// Premium Feature
const GeneralSettings = ({handleUpdate, organization}) => {
  const [settings, setSettings] = useState([
    { group: 0, id: 1, name: 'enable_notification', defaultChecked: true, premium: false },
    { group: 1, id: 'enable_variant', name: (<span>Enable Variant <Tooltip title="Product variants are distinguished by specific attributes, such as size (small, medium, large), color (red, blue, green), or material (cotton, polyester)."><QuestionCircleOutlined /></Tooltip></span>), defaultChecked: false, premium: false },
    { group: 1, id: 2, name: (<span>Enable SubVariant <Tooltip title="Subvariants are used when a product variant itself can be subdivided into more specific categories. For example, if a t-shirt is a product variant with different colors, a subvariant might be different patterns (striped, plain) within a single color."><QuestionCircleOutlined /></Tooltip></span>), defaultChecked: false, premium: true },
    { group: 1, id: 3, name: 'multi_unit', defaultChecked: false, premium: true },
    { group: 0, id: 3, name: 'Payment Gateway', defaultChecked: false, premium: true },
    { group: 0, id: 4, name: 'Dark Mode', defaultChecked: false, premium: true },
    { group: 0, id: 5, name: 'Delivery Tracking', defaultChecked: false, premium: true },
  ])

  const onToggle = (checked, setting) => {
    console.log(`${setting} toggled to:`, checked);
    const data = settings.find(s => s.id === setting);
    console.log("data:", data);
    handleUpdate(checked, data);
    // setSettings(prev => prev.map(item => item.name === data.name ? { ...item, defaultChecked: data.value } : item ) )
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.name === data.name ? { ...setting, defaultChecked: checked } : setting
      )
    );
    // Handle the toggle logic here (e.g., save to state or backend)
  };

  const fetchInitial = async () => {
    try{
      const response = await axiosInstance.get(`${EshopBaseUrlV1}/organization/settings?organization=${organization}&group=0`)
      if (response.data.status === 1000){
        console.log("response==",response.data);
        // response.data.data.map(data => (
        //   setSettings(prev => prev.map(item => item.name === data.name ? { ...item, defaultChecked: data.value } : item ) )

        // )

        // )
        const newSettings = response.data.data;
        console.log("newSettings", newSettings);
        
        setSettings((prevSettings) =>
          prevSettings.map((setting) =>
            newSettings.find((newSetting) => newSetting.name === setting.id)
              ? { ...setting, defaultChecked: newSettings.find((newSetting) => newSetting.name === setting.id).value === "False" ? false : true }
              : setting
          )
        );
        
        // setSettings((prev) => {...prev,})
      }
    } catch (error){
      console.error('Error fetching settings:', error);
    }
  }

  useEffect(() => {
    fetchInitial();
  }, [])

  console.log("settingsss=>",settings);
  
  

  return (
    <List
      itemLayout="horizontal"
      dataSource={settings}
      renderItem={setting => (
        <List.Item
          actions={[
            <>
              {setting.premium && <span>Premium Feature <CrownOutlined className='premium pl-1' /> </span>}
              <Switch
                key={setting.id}
                checked={setting.defaultChecked}
                onChange={(checked) => onToggle(checked, setting.id)}
                disabled={setting.premium}
              />
            </>,
          ]}
        >
          <List.Item.Meta title={setting.name} />
        </List.Item>
      )}
    />
  );
};

export default GeneralSettings;