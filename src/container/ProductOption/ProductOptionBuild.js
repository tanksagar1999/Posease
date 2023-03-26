import React, { useState } from "react";
import { Tabs } from "antd";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main } from "../styled";
import { VariantListData } from "./Variant/VariantList";
import { VariantListGroup } from "./VariantGroup/VariantListGroup";
import { AddonListData } from "./Addons/AddonList";
import { AddonListGroup } from "./AddonsGroup/AddonListGroup";
import { ItemListGroup } from "./ItemGroup/ItemListGroup";

const ProductOptionBuild = (props) => {
  const { TabPane } = Tabs;
  const search = new URLSearchParams(props.location.search);
  let type = search.get("type");
  const [activeTab, changeTab] = useState(
    type == null
      ? "VARIANT"
      : type == "variant_group"
      ? "VARIANT_GROUP"
      : type == "addon"
      ? "ADDON"
      : type == "addon_group"
      ? "ADDON_GROUP"
      : type == "ITEM_GROUP"
      ? "ITEM_GROUP"
      : "VARIANT"
  );
  return (
    <>
      <Main>
        <PageHeader
          className="comman-custom-pageheader"
          size="small"
          ghost
          title={
            <>
              <Tabs
                type="card"
                activeKey={activeTab}
                size="small"
                onChange={changeTab}
              >
                <TabPane
                  tab="Variant"
                  key="VARIANT"
                  className="ant-tabs-tab-active"
                ></TabPane>
                <TabPane tab="Variant Group" key="VARIANT_GROUP"></TabPane>
                <TabPane tab="Addons" key="ADDON"></TabPane>
                <TabPane tab="Addon Groups" key="ADDON_GROUP"></TabPane>
                <TabPane tab="Item Groups" key="ITEM_GROUP"></TabPane>
              </Tabs>
            </>
          }
        />

        {activeTab === "VARIANT" ? <VariantListData /> : ""}
        {activeTab === "VARIANT_GROUP" ? <VariantListGroup /> : ""}
        {activeTab === "ADDON" ? <AddonListData /> : ""}
        {activeTab === "ADDON_GROUP" ? <AddonListGroup /> : ""}
        {activeTab === "ITEM_GROUP" ? <ItemListGroup /> : ""}
      </Main>
    </>
  );
};

export default ProductOptionBuild;
