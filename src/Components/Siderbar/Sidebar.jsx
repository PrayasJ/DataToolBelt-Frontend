import React from "react";
import { Link, useParams } from "react-router-dom";
import "./Sidebar.scss";

import logoFull from "../../Images/logo-full-white.svg";
import logo from "../../Images/logo-white.svg";

import { RiArrowDropDownLine } from "react-icons/ri";

import { Scrollbars } from "react-custom-scrollbars-2";

import $ from "jquery";
import Axios from "axios";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { testColumns } from "../../test_data";
import { AiOutlineMenu } from "react-icons/ai";
import { config } from "../../config";

const defaultData = [];

testColumns.forEach((c) => {
  defaultData.push({
    title: c[0],
    type: c[1],
    avg: "N/a",
  });
});

//const columnHelper = createColumnHelper()

let operation = "avg";

// const columns = [
// 	columnHelper.accessor('title', {
// 		header: () => <div className='head'>Title</div>,
// 		cell: info => <div className='item'>{info.renderValue()}</div>,
// 	}),
// 	columnHelper.accessor('type', {
// 		header: () => <div className='head'>Type</div>,
// 		cell: info => <div className='item'>{info.renderValue()}</div>,
// 	}),
// 	columnHelper.accessor(row => row[operation] , {
// 		id: operation,
// 		cell: info => <div className='item'>{info.renderValue()}</div>,
// 		header: () => <div className='head'>
// 			Avg
// 			<RiArrowDropDownLine />
// 		</div>,
// 	}),
// ]

const columns = [
  { field: "title", name: "Title" },
  { field: "type", name: "Type" },
  { field: "avg", name: "Avg" },
  { field: "min", name: "Min" },
  { field: "max", name: "Max" },
];

$(function () {
  $(".menu").on("click", function () {
    console.log("menu clicked");
    $(".overlay").toggleClass("anim");
    $(this).addClass("open");
  });

  $(".open").on("click", function () {
    console.log("open clicked");
    $(".overlay").toggleClass("reverse-animation");
  });

  $(".logo").on("click", function () {
    console.log("logo clicked");
    $(".overlay").removeClass("anim");
  });
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: props.taskId,
      data: [...defaultData],
      title: "",
      size: "",
      rows: [],
      columns: [],
      columnCount: 0,
      rowCount: 0,
    };

    Axios.get(config.routes.fetch + `/${props.taskId}`)
      .then((res) => {
        let rows = Object.values(res.data.col);
        this.setState({
          title: res.data.name,
          size: res.data.size,
          date: res.data.dt,
          rows,
          columns,
          columnCount: columns.length,
          rowCount: res.data.rows,
        });
      })
      .catch((err) => {
        //show error page
      });
  }

  render() {
    return (
      <div>
        <header className="sidebar hide-on-med">
          <Link to={"/"}>
            <img className="logo full" src={logoFull} />
            <img className="logo small" src={logo} />
          </Link>
          <div className="info-container">
            <div className="title">File Name</div>
            <div className="info">{this.state.title}</div>
            <div className="title">File Details</div>
            <div className="info-container2">
              <div className="info-block">
                <div className="title2">Size</div>
                <div className="info2">
                  {config.bytesToHuman(this.state.size)}
                </div>
              </div>
              <div className="info-block">
                <div className="title2">Date</div>
                <div className="info2">{this.state.date}</div>
              </div>
              <div className="info-block">
                <div className="title2">Row Count</div>
                <div className="info2">{this.state.rowCount}</div>
              </div>
              <div className="info-block">
                <div className="title2">Coloumn Count</div>
                <div className="info2">{this.state.columnCount}</div>
              </div>
            </div>
            <div className="table">
              <Scrollbars className="table-container">
                {this.state.rows && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        {this.state.columns.map((col) => {
                          return (
                            <th key={col.field} className="head">
                              {col.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.rows.map((row, idx) => {
                        return (
                          <tr key={idx}>
                            {this.state.columns.map((col) => {
                              return (
                                <td key={col.field} className="item">
                                  {row[col.field]}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </Scrollbars>
            </div>
          </div>
        </header>
        <div className="wrapper show-on-med">
          <AiOutlineMenu className="menu" />
          <div className="overlay">
            <header className="sidebar">
              <img className="logo full" src={logoFull} />
              <img className="logo small" src={logo} />
              <div className="info-container">
                <div className="title">File Name</div>
                <div className="info">{this.state.title}</div>
                <div className="title">File Details</div>
                <div className="info-container2">
                  <div className="info-block">
                    <div className="title2">Size</div>
                    <div className="info2">
                      {config.bytesToHuman(this.state.size)}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Date</div>
                    <div className="info2">{this.state.date}</div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Row Count</div>
                    <div className="info2">{this.state.rowCount}</div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Coloumn Count</div>
                    <div className="info2">{this.state.columnCount}</div>
                  </div>
                </div>
                <div className="table">
                  <Scrollbars className="table-container ag-theme-alpine">
                    {this.state.rows && (
                      <table className="data-table">
                      <thead>
                        <tr>
                          {this.state.columns.map((col) => {
                            return (
                              <th key={col.field} className="head">
                                {col.name}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.rows.map((row, idx) => {
                          return (
                            <tr key={idx}>
                              {this.state.columns.map((col) => {
                                return (
                                  <td key={col.field} className="item">
                                    {row[col.field]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    )}
                  </Scrollbars>
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
