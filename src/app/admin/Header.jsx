'use client';

import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import WelcomePage from "./WelcomePage";
import { useRouter } from "next/navigation";
import { DotzBaseUrl } from "@/utils/GlobalVariables";

const Header = () => {
    const router = useRouter()
    // const organization_id = JSON.parse(localStorage.getItem('userDetails')).last_organization;
    // const [newUser, setNewUser] = useState(false);
    // let organization_id = null

    const fetchOrganizationDetails = async () => {
        try {
          const response = await axiosInstance.get(DotzBaseUrl+'/v1/organization/organizations/'+organization_id);
          if (response.status === 1000) {
            console.log("response--==>",response.data);
            localStorage.setItem('organizationDetails', JSON.stringify(response.data.data));
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      }

    useEffect(() => {

        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get('accounts/v1/user/get-user-details/');
                
                console.log("response.data.length----1111-->", response.data);
                localStorage.setItem('userDetails', JSON.stringify(response.data.data));
        
                const organization_id = response.data.data.last_organization;
                console.log("organization_id=1=>", organization_id);
                
                if (organization_id) {  // Ensure that organization_id exists
                    console.log("organization_id=2=>", organization_id);
                    try {
                        const orgResponse = await axiosInstance.get(`${DotzBaseUrl}/v1/organization/organizations/${organization_id}`);
                        if (orgResponse.data.status === 1000) {
                            console.log("response--==>", orgResponse.data);
                            localStorage.setItem('organizationDetails', JSON.stringify(orgResponse.data.data));
                            fetchOrganizationDetails();
                        }
                    } catch (error) {
                        console.error('Error fetching organization:', error);
                    }
                }
            } catch (error) {
                console.error('API request failed:', error);
            }
        };
        const fetchOrganization = async () => {
            try {
                const response = await axiosInstance.get('e_shop/v1/organization/organizations/');
                console.log("response.data.length----00-->",response.data.data.length);
                if (response.data.data.length === 0) {
                    // setNewUser(true);
                    router.push('/admin/welcome');
                }
            } catch (error) {
                console.error('API request failed:', error);
            }
        };

        fetchUserDetails();
        fetchOrganization();
        
        }, []);

  return (
    <div>
        {/* {newUser && <WelcomePage />} */}
    </div>
  )
}

export default Header