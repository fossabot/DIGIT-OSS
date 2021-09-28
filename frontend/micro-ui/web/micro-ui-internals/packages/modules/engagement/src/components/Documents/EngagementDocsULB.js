import React, { useEffect, useMemo } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";

const SelectULB = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  const { data: ulbArray, isLoading } = Digit.Hooks.useTenants();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const selectedTenat = useMemo(()=>{
    const filtered = ulbArray?.filter((item)=> item.code===tenantId)
    return filtered;
  },[tenantId, ulbArray])

  debugger
  return (
    <React.Fragment>
      <LabelFieldPair 
      style={{alignItems:'start'}}
      >
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_ULB") + " *"}</CardLabel>
        <div className="field">
          <Controller
            name={config.key}
            control={control}
            defaultValue={selectedTenat}
            render={(props) => (
              <Dropdown
                allowMultiselect={true}
                optionKey={"i18nKey"}
                option={ulbArray}
                select={(e) => {
                  props.onChange([...(formData?.[config?.key]?.filter?.((f) => e.code != f.code) || []), e]);
                }}
                keepNull={true}
                selected={props.value}
                disable={ulbArray?.length === 1}
                t={t}
              />
            )}
          />
          <div className="tag-container">
            {formData?.[config.key]?.map((ulb, index) => {
              return (
                <RemoveableTag
                  key={index}
                  text={t(ulb?.i18nKey)}
                  onClick={() =>
                    setValue(
                      config.key,
                      formData?.[config.key]?.filter((e) => e.i18nKey != ulb.i18nKey)
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SelectULB;
