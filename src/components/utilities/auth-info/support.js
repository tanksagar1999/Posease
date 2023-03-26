import React from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { NestedDropdwon } from "./auth-info-style";
import { Popover } from "../../popup/popup";
import Heading from "../../heading/heading";

const Support = () => {
  // const { Link } = Anchor;
  const content = (
    <NestedDropdwon>
      <div className="support-dropdwon">
        <ul>
          <Heading as="h5">Check out our user guide</Heading>
          <li>
            <Link
              to="#"
              onClick={() => window.open("https://help.posease.com/")}
            >
              Getting Started
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() =>
                window.open(
                  "https://help.posease.com/userguide/billing-taking-order"
                )
              }
            >
              Selling
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() =>
                window.open("https://help.posease.com/userguide/product-setup")
              }
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => window.open("https://help.posease.com/")}
            >
              More topics
            </Link>
          </li>
        </ul>

        <ul>
          <Heading as="h5">Need help or support?</Heading>
          {/* <li>
            <Link to="#">Launch live support</Link>
          </li> */}
          <li>
            <Link to="#">Email to support@posease.com</Link>
          </li>
        </ul>
      </div>
    </NestedDropdwon>
  );

  return (
    <div className="support">
      <Popover placement="bottomLeft" content={content} action="click">
        <Link to="#" className="head-example">
          <FeatherIcon icon="help-circle" size={20} />
        </Link>
      </Popover>
    </div>
  );
};

export default Support;
