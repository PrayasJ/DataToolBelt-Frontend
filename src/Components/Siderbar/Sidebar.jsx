import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

import logoFull from "../../Images/logo-full-white.svg";
import logo from "../../Images/logo-white.svg";

import { Scrollbars } from "react-custom-scrollbars-2";

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

// console.log(document.body.querySelector('.processor-main'))
// document.body.querySelector('.processor-main').addEventListener('click', () => {
//   console.log('click')
// })

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
      sideopen: false,
      anim: false,
    };
  }

  toggleOpen = () => {
    this.setState({
      sideopen: !this.state.sideopen,
      anim: !this.state.anim,
    });
  };

  toggleClose = () => {
    this.setState({
      sideopen: false,
      anim: false,
    });
  };

  render() {
    let main = document.body.querySelector(".processor-main");
    if (main) {
      document.body.querySelector(".processor-main").onclick = () => {
        this.toggleClose();
      };
    }
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
          <AiOutlineMenu
            className={`menu ${this.state.sideopen ? "open" : ""}`}
            onClick={this.toggleOpen}
          />
          <div className={`overlay ${this.state.anim ? "anim" : ""}`}>
            <header className="sidebar">
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
