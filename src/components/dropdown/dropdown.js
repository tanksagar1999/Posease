import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { Content, DropdownStyle } from "./dropdown-style";
import FeatherIcon from "feather-icons-react";

const Dropdown = (props) => {
  const {
    content,
    placement,
    title,
    action,
    children,
    style,
    className,
  } = props;

  return (
    <DropdownStyle
      overlayClassName={className}
      style={style}
      placement={placement}
      title={title}
      overlay={<Content>{content}</Content>}
      trigger={action}
    >
      {children}
    </DropdownStyle>
  );
};

const content = (
  <>
    <h1>hi</h1>
    {/* <NavLink to="#" onClick={() =>setModelVisible(true)}>
        <FeatherIcon size={16} icon="book-open"  />
        <span>PDF</span>
      </NavLink>
      <NavLink to="#" onClick={() =>setModelVisible(true)}>
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink to="#" onClick={() =>setModelVisible(true)}>
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink> */}
  </>
);

Dropdown.defaultProps = {
  action: ["hover"],
  placement: "bottomCenter",
  content,
  style: {},
  className: "strikingDash-dropdown",
};

Dropdown.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.array,
  content: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export { Dropdown };
