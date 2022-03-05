import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const config = {
  select: (response) => {
    return {
      totalCount: response?.totalCount,
      vehicleLog: response?.vehicleTrip.map((trip) => {
        const owner = trip.tripOwner;
        const displayName = owner.name + (owner.userName ? `- ${owner.userName}` : "");
        const tripOwner = { ...owner, displayName };
        return { ...trip, tripOwner };
      }),
    };
  },
};

const FstpInbox = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [searchParams, setSearchParams] = useState({ applicationStatus: "WAITING_FOR_DISPOSAL" });
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { isLoading: isVehiclesLoading, data: vehicles } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: { registrationNumber: searchParams?.registrationNumber },
    config: { enabled: searchParams?.registrationNumber?.length > 0 },
  });


  const userInfo = Digit.UserService.getUser();

  const { isLoading: applicationLoading, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: searchParams?.refernceNos, uuid: userInfo.uuid },
    { staleTime: Infinity }
  );

  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { name: searchParams?.name },
    { enabled: searchParams?.name?.length > 1 }
  );
  let filters = {
    businessService: "FSM_VEHICLE_TRIP",
    refernceNos: applicationData !== undefined && searchParams?.refernceNos?.length > 0 ? applicationData?.applicationNo || "null" : "",
    vehicleIds: vehicles !== undefined && searchParams?.registrationNumber?.length > 0 ? vehicles?.vehicle?.[0]?.id || "null" : "",
    // vehicleIds: applicationData !== undefined && searchParams?.applicationNos?.length > 0 ? applicationData?.vehicleId || "null" : vehicles !== undefined && searchParams?.registrationNumber?.length > 0 ? vehicles?.vehicle?.[0]?.id || "null" : "",
    tripOwnerIds: dsoData !== undefined && searchParams?.name?.length > 0 ? dsoData?.[0]?.ownerId || "null" : "",
    applicationStatus: searchParams?.applicationStatus,
  };
  if (applicationData == undefined){
    filters = {
      "responseInfo": {
          "apiId": "Rainmaker",
          "ver": null,
          "ts": null,
          "resMsgId": "uief87324",
          "msgId": "1645827148736|en_IN",
          "status": "successful"
      },
      "vehicle": [],
      "totalCount": 0
  }
  }
  const { isLoading, data: { totalCount, vehicleLog } = {}, isSuccess } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters,
    config,
    options: { searchWithDSO: true },
  });

  const onSearch = (params = {}) => {
    setSearchParams({ applicationStatus: "WAITING_FOR_DISPOSAL", ...params });
  };

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleFilterChange = () => { };

  const searchFields = [
    {
      label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
      name: "refernceNos",
    },
    {
      label: t("ES_FSTP_OPERATOR_VEHICLE_NO"),
      name: "registrationNumber",
    },
    {
      label: t("ES_FSTP_DSO_NAME"),
      name: "name",
    },
  ];

  let isMobile = window.Digit.Utils.browser.isMobile();
  // if (isSuccess) {
  if (isMobile) {
    return (
      <MobileInbox
        onFilterChange={handleFilterChange}
        vehicleLog={vehicleLog}
        isLoading={isLoading}
        userRole={"FSM_EMP_FSTPO"}
        linkPrefix={"/digit-ui/employee/fsm/fstp-operator-details/"}
        onSearch={onSearch}
        searchFields={searchFields}
      />
    );
  } else {
    return (
      <div>
        <Header>{t("ES_COMMON_INBOX")}</Header>
        <DesktopInbox
          data={{ table: vehicleLog }}
          isLoading={isLoading}
          userRole={"FSM_EMP_FSTPO"}
          onFilterChange={handleFilterChange}
          searchFields={searchFields}
          onSearch={onSearch}
          onNextPage={fetchNextPage}
          onPrevPage={fetchPrevPage}
          currentPage={Math.floor(pageOffset / pageSize)}
          pageSizeLimit={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalRecords={totalCount || 0}
        />
      </div>
    );
  }
  // }
};

export default FstpInbox;
