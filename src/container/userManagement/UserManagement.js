import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Row, Col, Table, Input, Radio, Button, Modal, Form } from "antd";
import { SearchOutlined, LockTwoTone, DeleteOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import { CardToolbox } from "./Style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Main, TableWrapper } from "../styled";
import { Cards } from "../../components/cards/frame/cards-frame";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";
import { Popover } from "../../components/popup/popup";
import "./UserManagement.css";
import {
  getAllActiveUsersList,
  changeStatus,
  FilterActiveInactiveStatus,
  deleteUser,
  ExportUser,
} from "../../redux/users/actionCreator";
import { AutoCompleteStyled } from "../../components/autoComplete/style";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  let [search, setsearch] = useState("");
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [modalVisible, setModelVisible] = useState(false);
  let [modalVisibleExport, setModelVisibleExport] = useState(false);
  const [userId, setUserId] = useState(false);
  const [modalVisibleDelete, setModelVisibleDelete] = useState(false);
  const [exportType, setExportType] = useState();

  const { ActiveUsersList } = useSelector(
    (state) => ({
      ActiveUsersList: state.users.ActiveUsersList,
    }),
    shallowEqual
  );
  //fatch data

  useEffect(() => {
    dispatch(getAllActiveUsersList());
  }, []);

  //change status
  let isDeActive = async () => {
    let changedata = {
      user_id: userId,
      status: "deactivated",
    };
    await dispatch(changeStatus(changedata));
    setModelVisible(false);
    dispatch(getAllActiveUsersList());
  };

  const showModal = (id) => {
    if (id && id !== "") {
      setModelVisible(true);
      setUserId(id);
    }
  };

  const submitExport = (values) => {
    values.type = exportType;
    if (exportType) {
      dispatch(ExportUser(values));
      setModelVisibleExport(false);
      form.resetFields();
    }
  };
  const DeleteUser = async () => {
    if (userId) {
      let allUserId = [];
      allUserId.push(userId);
      const getDeleteUser = await dispatch(deleteUser({ ids: allUserId }));
      dispatch(getAllActiveUsersList());
      setModelVisibleDelete(false);
    }
  };

  let searchArr = ActiveUsersList.filter((value) =>
    value.number.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangeForFilter = (e) => {
    dispatch(FilterActiveInactiveStatus(e.target.value));
  };

  const showModalDelete = (id) => {
    if (id && id !== "") {
      setModelVisibleDelete(true);
      setUserId(id);
    }
  };

  const content = (
    <>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisibleExport(true);
          setExportType("PDF");
        }}
      >
        <FeatherIcon size={16} icon="book-open" />
        <span>PDF</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisibleExport(true);
          setExportType("XLSX");
        }}
      >
        <FeatherIcon size={16} icon="x" />
        <span>Excel (XLSX)</span>
      </NavLink>
      <NavLink
        to="#"
        onClick={() => {
          setModelVisibleExport(true);
          setExportType("CSV");
        }}
      >
        <FeatherIcon size={16} icon="file" />
        <span>CSV</span>
      </NavLink>
    </>
  );

  const dataSource = [];

  if (ActiveUsersList.length > 0) {
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
            style: { textAlign: "center", display: "flex" },
          },

          children: (
            <>
              {record.status !== "deactivated" ? (
                <Button
                  onClick={showModal.bind("", record.id)}
                  style={{
                    cursor: "pointer",
                    fontSize: "17px",
                    marginRight: 10,
                  }}
                >
                  <LockTwoTone />
                </Button>
              ) : (
                ""
              )}
              <Button
                onClick={showModalDelete.bind("", record.id)}
                style={{ cursor: "pointer", fontSize: "17px" }}
              >
                <DeleteOutlined />
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
            title="Users Management"
            subTitle={
              <>
                <span className="title-counter">
                  {ActiveUsersList.length} Users
                </span>
                <AutoCompleteStyled
                  className="certain-category-search"
                  style={{ width: "350px" }}
                  placeholder="Search by mobile number"
                >
                  <Input
                    suffix={<SearchOutlined />}
                    autoFocus
                    onChange={(e) => setsearch(e.target.value)}
                    value={search}
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
        <Cards headless>
          <Row gutter={15}>
            <Col xs={24}>
              <Row gutter={15} className="justify-content-center">
                <Col xxl={24} lg={24} xs={24}>
                  <div
                    className="table-toolbox-menu"
                    style={{ float: "right", marginBottom: 10 }}
                  >
                    <span className="toolbox-menu-title">
                      {" "}
                      Status:&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                    </span>
                    <Radio.Group
                      onChange={handleChangeForFilter}
                      defaultValue=""
                    >
                      <Radio.Button value="all">All</Radio.Button>
                      <Radio.Button value="active">Actived</Radio.Button>
                      <Radio.Button value="deactivated">
                        DeActivated
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col md={24}>
              <TableWrapper className="table-order table-responsive">
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
            </Col>
          </Row>
          <Modal
            title="Confirm Delete"
            okText="Delete Entry"
            visible={modalVisibleDelete}
            onOk={DeleteUser}
            onCancel={() => setModelVisibleDelete(false)}
            width={600}
          >
            <p>
              Deleting the entry will permanently remove it and will no longer
              appear on reports. Are you sure you want to proceed?
            </p>
          </Modal>
          <Modal
            title="Confirm Deactivate"
            okText="Deactivate User"
            visible={modalVisible}
            onOk={isDeActive}
            onCancel={() => setModelVisible(false)}
            width={600}
          >
            <p>Are you sure you want to Deactivate this user?</p>
          </Modal>
          <Modal
            title="Export Users"
            visible={modalVisibleExport}
            onOk={form.submit}
            onCancel={() => setModelVisibleExport(false)}
            width={600}
          >
            <div>
              <Form
                style={{ width: "100%" }}
                name="export"
                form={form}
                onFinish={submitExport}
              >
                <div className="add-product-block">
                  <div className="add-product-content">
                    <Form.Item
                      label="Send to Email Address"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your email",
                          type: "email",
                        },
                      ]}
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </Modal>
        </Cards>
      </Main>
    </>
  );
};

export default UserManagement;
