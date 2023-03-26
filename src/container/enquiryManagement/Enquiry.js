import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Row, Col, Table, Input, Modal, Button } from "antd";
import { SearchOutlined, LockTwoTone } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { UserTableStyleWrapper } from "../pages/style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Cards } from "../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import { Popover } from "../../components/popup/popup";
import { AutoCompleteStyled } from "../../components/autoComplete/style";
import "./Enquiry.css";
import {
  getAllUsersList,
  changeStatus,
} from "../../redux/enquiryManagement/actionCreator";

const Enquiry = () => {
  let [UsersListData, setUsersListData] = useState([]);
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const dispatch = useDispatch();
  const [modalVisible, setModelVisible] = useState(false);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    async function fetchUsersList() {
      const getUsersList = await dispatch(getAllUsersList());
      if (isMounted.current && getUsersList && getUsersList.UsersList)
        setUsersListData(getUsersList.UsersList);
    }
    if (isMounted.current) {
      fetchUsersList();
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  const showModal = (id) => {
    if (id && id !== "") {
      setModelVisible(true);
      setUserId(id);
    }
  };

  const [state, setState] = useState({
    item: UsersListData,
    searchName: "",
  });

  const { item } = state;

  useEffect(() => {
    if (UsersListData) {
      setState({
        item: UsersListData,
      });
    }
  }, [UsersListData]);

  let isActive = async () => {
    let changedata = {
      user_id: userId,
      status: "activated",
    };
    const ChangeStatus = await dispatch(changeStatus(changedata));
    if (ChangeStatus.status.status === "activated") {
      setModelVisible(false);
      const getUsersList = await dispatch(getAllUsersList());
      setUsersListData(getUsersList.UsersList);
    }
  };

  let searchArr = item.filter((value) =>
    value.number.toLowerCase().includes(search.toLowerCase())
  );

  const content = (
    <>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink to="#" onClick={() => setModelVisible(true)}>
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );
  const dataSource = [];

  if (UsersListData.length > 0) {
    searchArr.map((value, i) => {
      const { _id, first_name, last_name, email, number, status } = value;
      return dataSource.push({
        id: _id,
        first_name: first_name,
        key: i,
        last_name: last_name,
        email: email,
        number: number,
        status: status,
      });
    });
  }

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Action",
      width: "10%",
      render(value, record) {
        return {
          props: {
            style: { textAlign: "right" },
          },
          children: (
            <>
              <Button
                onClick={showModal.bind("", record.id)}
                style={{ cursor: "pointer", fontSize: "17px", marginRight: 10 }}
              >
                <LockTwoTone />
              </Button>
            </>
          ),
        };
      },
    },
  ];

  return (
    <>
      <Main>
        <CardToolbox>
          <PageHeader
            className="admin-custom-pageheader"
            ghost
            title="Total Enquiries"
            subTitle={
              <>
                <span className="title-counter">{item.length} Users</span>
                <AutoCompleteStyled
                  className="certain-category-search"
                  style={{ width: "350px" }}
                  placeholder="Search by mobile number"
                >
                  <Input
                    suffix={<SearchOutlined />}
                    onChange={(e) => setsearch(e.target.value)}
                    value={search}
                    autoFocus
                  />
                </AutoCompleteStyled>
              </>
            }
            buttons={[
              <div key="1" className="page-header-actions">
                <CalendarButtonPageHeader key="1" />
                <Popover
                  placement="bottomLeft"
                  content={content}
                  trigger="click"
                >
                  <Button size="small" type="white">
                    <FeatherIcon icon="download" size={14} />
                    Export
                  </Button>
                </Popover>
              </div>,
            ]}
          />
        </CardToolbox>
        <Row gutter={15}>
          <Col md={24}>
            <Cards headless>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    <Table
                      rowKey="id"
                      size="small"
                      dataSource={dataSource}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        total: dataSource.length,
                      }}
                    />
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
            </Cards>
          </Col>
        </Row>
        <Modal
          title="Confirm Active"
          okText="Active User"
          visible={modalVisible}
          onOk={isActive}
          onCancel={() => setModelVisible(false)}
          width={600}
        >
          <p>Are you sure you want to active this user?</p>
        </Modal>
      </Main>
    </>
  );
};

export default Enquiry;
