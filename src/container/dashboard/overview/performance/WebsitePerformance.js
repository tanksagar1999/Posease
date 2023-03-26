import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { NavLink, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { PerformanceChartWrapper, Pstates, CardBarChart } from "../../style";
import CashFlow from "./CashFlow";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { ChartjsAreaChart } from "../../../../components/charts/chartjs";
import {
  chartLinearGradient,
  customTooltips,
} from "../../../../components/utilities/utilities";
import {
  performanceFilterData,
  performanceGetData,
  setIsLoading,
} from "../../../../redux/chartContent/actionCreator";

const moreContent = (
  <>
    <NavLink to="#">
      <FeatherIcon size={16} icon="printer" />
      <span>Printer</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="book-open" />
      <span>PDF</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file-text" />
      <span>Google Sheets</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="x" />
      <span>Excel (XLSX)</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file" />
      <span>CSV</span>
    </NavLink>
  </>
);

const WebsitePerformance = () => {
  const dispatch = useDispatch();
  const { performanceState, preIsLoading } = useSelector((state) => {
    return {
      performanceState: state.chartContent.performanceData,
      preIsLoading: state.chartContent.perLoading,
    };
  });

  const [state, setState] = useState({
    performance: "year",
    performanceTab: "users",
  });

  const { performance, performanceTab } = state;

  useEffect(() => {
    if (performanceGetData) {
      dispatch(performanceGetData());
    }
  }, [dispatch]);

  const handleActiveChangePerformance = (value) => {
    setState({
      ...state,
      performance: value,
    });
    dispatch(performanceFilterData(value));
  };

  const onPerformanceTab = (value) => {
    setState({
      ...state,
      performanceTab: value,
    });
    return dispatch(setIsLoading());
  };

  // const performanceDatasets = performanceState !== null && [
  //   {
  //     data: performanceState[performanceTab][1],
  //     borderColor: "#5F63F2",
  //     borderWidth: 4,
  //     fill: true,
  //     backgroundColor: () =>
  //       chartLinearGradient(document.getElementById("performance"), 300, {
  //         start: "#5F63F230",
  //         end: "#ffffff05",
  //       }),
  //     label: "Current period",
  //     pointStyle: "circle",
  //     pointRadius: "0",
  //     hoverRadius: "9",
  //     pointBorderColor: "#fff",
  //     pointBackgroundColor: "#FFF",
  //     hoverBorderWidth: 5,
  //   },
  //   {
  //     data: performanceState[performanceTab][2],
  //     borderColor: "#C6D0DC",
  //     borderWidth: 2,
  //     fill: false,
  //     backgroundColor: "#00173750",
  //     label: "Previous period",
  //     borderDash: [3, 3],
  //     pointRadius: "0",
  //     hoverRadius: "0",
  //   },
  // ];

  return (
    <div className="performance-lineChart sale_mobtitle">
      <CashFlow />
    </div>
  );
};

export { WebsitePerformance };
