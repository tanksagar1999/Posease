import React from "react";
import PropTypes from "prop-types";
import { PageHeaderStyle } from "./style";

const PageHeaderOrder = (props) => {
  const { title, subTitle, routes, buttons, ghost, bgColor, className } = props;
  return (
    <>
      <div
        className="pageheader-order"
        style={{
          backgroundColor: bgColor || "#F4F5F7",
        }}
      >
        <PageHeaderStyle
          style={{
            backgroundColor: "rgb(244, 245, 247)",
          }}
          // onBack={() => window.history.back()}
          title={title}
          subTitle={subTitle}
          breadcrumb={routes && { routes }}
          extra={buttons}
          ghost={ghost}
          className={className}
        />
      </div>
    </>
  );
};

PageHeaderOrder.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),

  buttons: PropTypes.array,
  ghost: PropTypes.bool,
};

export { PageHeaderOrder };
