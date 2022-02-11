import React, { useState } from "react"
import {EditIcon, LogoutIcon } from "@egovernments/digit-ui-react-components";
import TopBar from "./TopBar";
import { useHistory } from "react-router-dom";

import SideBar from "./SideBar";

const TopBarSideBar = ({ t, stateInfo, userDetails, CITIZEN, cityDetails, mobileView, handleUserDropdownSelection, logoUrl, showSidebar = true ,showLanguageChange}) => {
    const [isSidebarOpen, toggleSidebar] = useState(false);
    const history = useHistory();

    const handleLogout = () => {
      toggleSidebar(false);
      Digit.UserService.logout();
    };
    const userProfile=()=>{
      history.push("/digit-ui/employee/user/profile");

    }
  
    const userOptions = [{ name: t("Edit_PROFILE"), icon: <EditIcon className="icon" />, func: userProfile },{ name: t("CORE_COMMON_LOGOUT"), icon: <LogoutIcon className="icon" />, func: handleLogout }];
  
    return (
      <React.Fragment>
        <TopBar
          t={t}
          stateInfo={stateInfo}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          handleLogout={handleLogout}
          userDetails={userDetails}
          CITIZEN={CITIZEN}
          cityDetails={cityDetails}
          mobileView={mobileView}
          userOptions={userOptions}
          handleUserDropdownSelection={handleUserDropdownSelection}
          logoUrl={logoUrl}
          showLanguageChange={showLanguageChange}
        />
        {showSidebar && <SideBar
          t={t}
          CITIZEN={CITIZEN}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
          mobileView={mobileView}
          userDetails={userDetails}
        />
        }
      </React.Fragment>
    );
  }

  export default TopBarSideBar