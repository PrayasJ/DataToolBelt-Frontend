import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

import logoFull from "../../Images/logo-full-white.svg";
import logo from "../../Images/logo-white.svg";

import { Scrollbars } from "react-custom-scrollbars-2";

import $ from "jquery";

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

let operation = "avg";

const columns = [
  { field: "title", name: "Title" },
  { field: "type", name: "Type" },
  { field: "avg", name: "Avg" },
  { field: "min", name: "Min" },
  { field: "max", name: "Max" },
];

window.document.onload = () => {
  console.log('loaded')
}
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
      title: props.title,
      size: props.size,
      rows: props.rows,
      columns: props.columns,
      columnCount: props.cCount,
      rowCount: props.rCount,
      date: props.date,
    };
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
            <div className="info">{this.state.title()}</div>
            <div className="title">File Details</div>
            <div className="info-container2">
              <div className="info-block">
                <div className="title2">Size</div>
                <div className="info2">
                  {config.bytesToHuman(this.state.size())}
                </div>
              </div>
              <div className="info-block">
                <div className="title2">Date</div>
                <div className="info2">{this.state.date()}</div>
              </div>
              <div className="info-block">
                <div className="title2">Row Count</div>
                <div className="info2">{this.state.rowCount()}</div>
              </div>
              <div className="info-block">
                <div className="title2">Coloumn Count</div>
                <div className="info2">{this.state.columnCount()}</div>
              </div>
            </div>
            <div className="table">
              <Scrollbars className="table-container">
                {this.state.rows && (
                  <table className="data-table">
                    <thead>
                      <tr>
                        {this.state.columns().map((col) => {
                          return (
                            <th key={col.field} className="head">
                              {col.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.rows().map((row, idx) => {
                        return (
                          <tr key={idx}>
                            {this.state.columns().map((col) => {
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
                <div className="info">{this.state.title()}</div>
                <div className="title">File Details</div>
                <div className="info-container2">
                  <div className="info-block">
                    <div className="title2">Size</div>
                    <div className="info2">
                      {config.bytesToHuman(this.state.size())}
                    </div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Date</div>
                    <div className="info2">{this.state.date()}</div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Row Count</div>
                    <div className="info2">{this.state.rowCount()}</div>
                  </div>
                  <div className="info-block">
                    <div className="title2">Coloumn Count</div>
                    <div className="info2">{this.state.columnCount()}</div>
                  </div>
                </div>
                <div className="table">
                  <Scrollbars className="table-container ag-theme-alpine">
                    {this.state.rows && (
                      <table className="data-table">
                      <thead>
                        <tr>
                          {this.state.columns().map((col) => {
                            return (
                              <th key={col.field} className="head">
                                {col.name}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.rows().map((row, idx) => {
                          return (
                            <tr key={idx}>
                              {this.state.columns().map((col) => {
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
