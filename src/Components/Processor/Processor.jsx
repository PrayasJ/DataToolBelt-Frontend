import React from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { config } from "../../config";
import Sidebar from "../Siderbar/Sidebar";
import "./Processor.scss";
import Axios from "axios";

import { Scrollbars } from "react-custom-scrollbars-2";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { test, testColumns } from "../../test_data";

import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { processTypes } from "../../processType";

import subicon1 from "../../Images/sub-icon-1.svg";
import subicon2 from "../../Images/sub-icon-2.svg";
import subicon3 from "../../Images/sub-icon-3.svg";
import subicon4 from "../../Images/sub-icon-4.svg";

const methodIcons = {
  0: subicon1,
  1: subicon2,
  2: subicon3,
  3: subicon4,
};

const columns = [
  { field: "title", name: "Title" },
  { field: "type", name: "Type" },
  { field: "avg", name: "Avg" },
  { field: "min", name: "Min" },
  { field: "max", name: "Max" },
];

const withParams = (WrappedComponent) => (props) => {
  const params = useParams();

  return <WrappedComponent {...props} params={params} />;
};

const rowIndexes = [];

for (let i = 0; i < 25; i++) {
  rowIndexes.push(i);
}

class Processor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: props.params.id,
      type: props.params.type,
      method: props.params.method,
      items: 57,
      title: "",
      size: "",
      rows: [],
      columns: [],
      columnCount: 0,
      rowCount: 0,
      page: 1,
      totalpages: 1,
      data: {},
      params: {},
    };
    this.title = this.state.method
      ? config.getSubTitle(this.state.type, this.state.method)
      : config.getTitle(this.state.type);
    if (this.title == undefined) {
      window.location.href = "/";
    }

    document.title = this.title + " - DataToolBelt";
    Axios.get(config.routes.fetch + `/${this.state.taskId}`)
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
          totalpages:
            res.data.rows % 25 == 0 ? 0 : 1 + Math.floor(res.data.rows / 25),
        });

        rows.map((row) => {
          Axios.post(config.routes.get, {
            taskId: this.state.taskId,
            col: row.title,
            page: this.state.page - 1,
          })
            .then((res) => {
              let updateRow = this.state.data;
              updateRow[row.title] = res.data;
              this.setState({
                data: updateRow,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        //show error page
      });
  }

  onPrevPage = () => {
    let page = this.state.page;
    if (page > 1) {
      this.state.rows.map((row) => {
        Axios.post(config.routes.get, {
          taskId: this.state.taskId,
          col: row.title,
          page: page - 2,
        })
          .then((res) => {
            let updateRow = this.state.data;
            updateRow[row.title] = res.data;
            this.setState({
              data: updateRow,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
      this.setState({
        page: page - 1,
        data: {},
      });
    }
  };

  onNextPage = () => {
    let page = this.state.page;
    if (page < this.state.totalpages) {
      this.state.rows.map((row) => {
        Axios.post(config.routes.get, {
          taskId: this.state.taskId,
          col: row.title,
          page: page,
        })
          .then((res) => {
            let updateRow = this.state.data;
            updateRow[row.title] = res.data;
            this.setState({
              data: updateRow,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
      this.setState({
        page: page + 1,
        data: {},
      });
    }
  };

  openSubMethod = (sub) => {
    window.location.href = `/${this.state.taskId}/${this.state.type}/${sub}`;
  };

  //For convert type
  onTypeSelect = (e) => {
    console.log(e);
    this.setState({
      params: {
        type: e.value,
      },
    });
  };

  convertData = (e) => {
    Axios.post(
      config.routes.function,
      {
        taskId: this.state.taskId,
        operation: this.state.type,
        params: this.state.params,
      },
      {
        responseType: "blob",
      }
    )
      .then((res) => {
        console.log(res);
        const dl = document.createElement("a");
        dl.href = window.URL.createObjectURL(res.data);
        dl.setAttribute("download", this.state.taskId);
        document.body.appendChild(dl);
        dl.click();
        dl.parentNode.removeChild(dl);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  selectStyles = {
    option: (provided, state) => ({
      ...provided,
    }),
    control: () => ({
      width: "100%",
      display: "flex",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  render() {
    return (
      this.state.title && (
        <div className="processor">
          <Sidebar taskId={this.state.taskId} />
          <div className="processor-main">
            <div className="title-bar">
              <div className="title noselect">{this.title}</div>
              <div className="task-bar">
                <div className="task-name noselect">TASK ID</div>
                <div className="task-id">#{this.state.taskId}</div>
              </div>
            </div>
            {!this.state.method && processTypes[this.state.type].children && (
              <div className="method-block noselect">
                {Object.keys(processTypes[this.state.type].children).map(
                  (submethod, i) => {
                    let subm =
                      processTypes[this.state.type].children[submethod];
                    return (
                      <div
                        key={i}
                        className="submethod"
                        onClick={() => this.openSubMethod(submethod)}
                      >
                        <img className="sub-icon" src={methodIcons[i]} />
                        <div className="sub-title">{subm.title}</div>
                        <div className="sub-desc">{subm.desc}</div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {this.state.type == "convert" && (
              <div className="input-block">
                <div className="input-select">
                  <div className="select-title">
                    Select Datatype
                    <Select
                      options={config.getSupportedTypes()}
                      onChange={this.onTypeSelect}
                      className="selector"
                      styles={this.selectStyles}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                </div>
                <div className="submit-btn" onClick={this.convertData}>
                  Start Conversion
                  <AiOutlineArrowRight />
                </div>
              </div>
            )}
            <div className="table-block">
              <div className="title noselect">Table Overview</div>
              <div className="table">
                <Scrollbars className="table-container">
                  {this.state.rows && (
                    <table className="data-table">
                      <thead>
                        <tr>
                          {this.state.rows.map((row, j) => {
                            return (
                              <th key={j} className="head">
                                {row.title}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {rowIndexes
                          .slice(
                            0,
                            this.state.page == this.state.totalpages
                              ? Math.min(25, this.state.rowCount % 25)
                              : 25
                          )
                          .map((idx) => {
                            return (
                              <tr key={idx}>
                                {this.state.rows.map((row, j) => {
                                  return (
                                    <td key={j} className="item">
                                      {this.state.data[row.title]
                                        ? this.state.data[row.title].values[idx]
                                        : "Loading"}
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
              <div className="pages noselect">
                <div className="page-item">
                  {`${(this.state.page - 1) * 25 + 1} - ${Math.min(
                    this.state.page * 25,
                    this.state.rowCount
                  )} of ${this.state.rowCount} items`}
                </div>
                <div className="page-item">
                  {this.state.page} of {this.state.totalpages} Pages
                </div>
                <div className="page-item page-row">
                  <AiOutlineLeft
                    onClick={this.onPrevPage}
                    style={{
                      visibility: `${
                        this.state.page > 1 ? "visible" : "hidden"
                      }`,
                    }}
                  />
                  <div className="page-box">{this.state.page}</div>
                  <AiOutlineRight
                    onClick={this.onNextPage}
                    style={{
                      visibility: `${
                        this.state.page < this.state.totalpages
                          ? "visible"
                          : "hidden"
                      }`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default withParams(Processor);
