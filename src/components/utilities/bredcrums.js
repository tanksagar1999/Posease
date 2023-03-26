import React, { useEffect } from "react";
import { Breadcrumb } from "antd";
import { NavLink, Link } from "react-router-dom";

const HeaderBreadcrumbs = (props) => {
  return (
    <>
      {props.location == "/admin/products/pricebook/items" ? (
        <Breadcrumb size="large">
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/pricebook">Price Book</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>100 Pipers (12 Yo)</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/receipts/BL-BTU-2025-2996" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/receipts">Receipts</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variant" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Variant</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variantgroup" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Variant Group</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addon" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Addon</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addongroup" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Addon Group</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/itemgroup" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Item Group</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variant/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variant/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variant/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variantgroup/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variantgroup/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/variantgroup/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addon/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addon/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addon/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addongroup/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addongroup/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/addongroup/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/itemgroup/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/itemgroup/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-options/itemgroup/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-options/">Product Options</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/product-categories/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-categories">Category</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location ==
      "/admin/product-categories/add-new-order-ticket-group" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/product-categories">Category</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New order ticket group</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/products/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/">Product</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/products/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/">Product</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/products/pricebook/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/">Product</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/pricebook">Price Book</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/products/pricebook/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/">Product</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/pricebook">Price Book</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/customers/import" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/customers/">Customers</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Import</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/customers/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/customers/">Customers</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/products/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/products/">Product</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/shop/subscription" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/shop">Shop</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Your Subscription</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/registers/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/registers">Registers</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add New</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/registers/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/admin/dashboard">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/registers">Registers</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/preferences" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>Preferences</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/custom-fields/add/payment" ||
      props.location == "/admin/settings/custom-fields/add/tag" ||
      props.location ==
        "/admin/settings/custom-fields/add/pettyCashCategories" ||
      props.location == "/admin/settings/custom-fields/add/additional" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/custom-fields">Custom Fields</NavLink>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Add</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/custom-fields/edit/payment" ||
      props.location == "/admin/settings/custom-fields/edit/tag" ||
      props.location ==
        "/admin/settings/custom-fields/edit/pettyCashCategories" ||
      props.location == "/admin/settings/custom-fields/edit/additional" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/custom-fields">Custom Fields</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/additional-charges/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/additional-charges">
              Additional Charges
            </NavLink>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Add</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/additional-charges/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/additional-charges">
              Additional Charges
            </NavLink>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/discount-rules/add" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/discount-rules">Discount Rule</NavLink>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Add</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}

      {props.location == "/admin/settings/discount-rules/edit" ? (
        <Breadcrumb>
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/admin/settings/discount-rules">
              Discount Rules
            </NavLink>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
      ) : (
        ""
      )}
    </>
  );
};

export default HeaderBreadcrumbs;
