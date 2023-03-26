import React, { useState, useRef, useEffect } from "react";
import { Table, Input, Modal } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Cards } from "../../../../../components/cards/frame/cards-frame";
import { Popover } from "../../../../../components/popup/popup";
import FeatherIcon from "feather-icons-react";
import { CaretDownOutlined } from "@ant-design/icons";
import "../../setting.css";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllPrinterList,
  deletePrinter,
  getAllSetUpPrinterList,
} from "../../../../../redux/printer/actionCreator";

const Printers = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let [search, setsearch] = useState("");
  let isMounted = useRef(true);
  const [printerList, setPrinterlist] = useState([]);
  const [selectionType] = useState("checkbox");
  const [modalDeleteVisible, setModelDeleteVisible] = useState(false);
  const offLineMode = useSelector((state) => state.auth.offlineMode);
  useEffect(() => {
    async function fetchPrinterList() {
      const getPrinterList = await dispatch(getAllPrinterList("sell"));
      if (getPrinterList) {
        setPrinterlist(getPrinterList);
      }
    }
    if (isMounted.current) {
      fetchPrinterList();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [state, setState] = useState({
    item: [],
  });

  const [offLineModeCheck, setOfflineModeCheck] = useState(false);
  const contentforaction = (
    <>
      <NavLink to="#" onClick={() => setModelDeleteVisible(true)}>
        <FeatherIcon size={16} icon="book-open" />
        <span>Delete Selected item</span>
      </NavLink>
    </>
  );

  const dataSource = [];
  let seachPrinterList = printerList.filter((value) =>
    value.printer_name.toLowerCase().includes(search.toLowerCase())
  );
  const rowSelection = {
    onChange: (selectedRows) => {
      setState({
        ...state,
        allSelectedRowsForDelete: selectedRows,
      });
    },
  };

  const handleCancel = (e) => {
    setModelDeleteVisible(false);
  };

  const deleteSelectedRegister = async () => {
    const { allSelectedRowsForDelete } = state;
    const getDeletedRegister = await dispatch(
      deletePrinter({ ids: allSelectedRowsForDelete })
    );

    if (getDeletedRegister) {
      const getPrinterList = await dispatch(getAllPrinterList());
      const setUpList = await dispatch(getAllPrinterList());
      if (getPrinterList && setUpList) {
        setModelDeleteVisible(false);
        setPrinterlist(getPrinterList);
        setState({
          ...state,
          selectedRows: [],
        });
      }
    }
  };

  if (seachPrinterList.length)
    seachPrinterList.map((value) => {
      const { printer_name, _id, printer_size, printer_type } = value;
      return dataSource.push({
        id: _id,
        printer_name: printer_name,
        printer_size: printer_size,
        printer_type: printer_type,
      });
    });

  const columns = [
    {
      title: (
        <>
          <Popover
            placement="bottomLeft"
            content={contentforaction}
            trigger="click"
          >
            <CaretDownOutlined style={{ marginLeft: "12px" }} />
          </Popover>
        </>
      ),
      key: "action",
      dataIndex: "action",

      width: "2%",
    },
    {
      title: "Name",
      dataIndex: "printer_name",
      textAlign: "center",
      key: "printer_name",
      fixed: "left",
      render(text, record) {
        return {
          children: <div style={{ color: "#008cba" }}>{text}</div>,
        };
      },
    },
    {
      title: "Size",
      dataIndex: "printer_size",
      key: "printer_size",
    },
    {
      title: "Type",
      dataIndex: "printer_type",
      key: "printer_type",
      align: "left",
      render(text, record) {
        return {
          children: <div>{text}</div>,
        };
      },
    },
  ];

  return (
    <>
      <Cards
        title={
          <div style={{ boxShadow: "none", margin: " 0 0 0 3px" }}>
            <Input
              suffix={<SearchOutlined />}
              className="set_serbt"
              autoFocus
              placeholder="Search by Printer Name"
              style={{
                borderRadius: "30px",
                width: "250px",
              }}
              onChange={(e) => setsearch(e.target.value)}
              value={search}
            />
          </div>
        }
        isbutton={[
          <NavLink
            to={offLineMode ? "#" : "printers/setup"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF", marginRight: "8px" }}
            onClick={() => {
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false);
            }}
          >
            Setup
          </NavLink>,
          <NavLink
            to={offLineMode ? "#" : "printers/add"}
            className="ant-btn ant-btn-primary ant-btn-md"
            style={{ color: "#FFF" }}
            onClick={() => {
              offLineMode
                ? setOfflineModeCheck(true)
                : setOfflineModeCheck(false);
            }}
          >
            <FeatherIcon icon="plus" size={16} className="pls_iconcs" />
            Add Printer
          </NavLink>,
        ]}
      >
        <Modal
          title="Confirm Delete"
          okText="Delete"
          visible={modalDeleteVisible}
          onOk={deleteSelectedRegister}
          onCancel={handleCancel}
          width={600}
        >
          <p>Are you sure you want to delete Printer ?</p>
        </Modal>
        <Modal
          title="You are Offline"
          visible={offLineModeCheck}
          onOk={() => setOfflineModeCheck(false)}
          onCancel={() => setOfflineModeCheck(false)}
          width={600}
        >
          <p>You are offline not add and update </p>
        </Modal>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          size="small"
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onRow={(row) => ({
            onClick: () =>
              offLineMode
                ? setOfflineModeCheck(true)
                : history.push(`printers/add`, {
                    printer_id: row.id,
                  }),
          })}
          style={{ marginTop: "8px" }}
        />
      </Cards>
    </>
  );
};

export default Printers;
