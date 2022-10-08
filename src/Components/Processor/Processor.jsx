import React from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { config } from "../../config";
import Sidebar from "../Siderbar/Sidebar";
import "./Processor.scss";
import "../../loader.scss";
import Loader from "../../Loader";
import Axios from "axios";

import { Scrollbars } from "react-custom-scrollbars-2";

import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineArrowRight,
  AiFillDelete,
  AiOutlineCloudDownload,
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
      date: "",
      rows: [],
      columns: [],
      columnCount: 0,
      rowCount: 0,
      page: 1,
      totalpages: 1,
      data: {},
      params: {},
      textinp1: "",
      textinp2: "",
      isLoading: true,
      graphURL: "https://matplotlib.org/stable/_images/sphx_glr_pyplot_004.png",
    };
    this.title = this.state.method
      ? config.getSubTitle(this.state.type, this.state.method)
      : config.getTitle(this.state.type);
    if (this.title == undefined) {
      window.location.href = "/";
    }

    document.title = this.title + " - DataToolBelt";
    this.getTableData();
    this.addVariable();
    this.addVariable();
  }

  getTableData = () => {
    this.setState({
      isLoading: true,
    });
    Axios.get(config.routes.fetch + `/${this.state.taskId}`)
      .then((res) => {
        let rows = Object.values(res.data.col);
        this.setState({
          isLoading: false,
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
  };

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
    console.log(this.state);
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
    window.history.pushState(
      null,
      document.title,
      `/${this.state.taskId}/${this.state.type}/${sub}`
    );
    this.setState({
      method: sub,
      params: {},
      textinp1: "",
      textinp2: "",
    });
    window.onpopstate = this.removeSubMethod;

    this.title = config.getSubTitle(this.state.type, sub);
    if (this.title == undefined) {
      window.location.href = "/";
    }

    document.title = this.title + " - DataToolBelt";
    this.getTableData();
    this.addVariable();
    this.addVariable();
  };

  removeSubMethod = () => {
    this.setState({
      method: undefined,
      graphURL: undefined,
    });

    this.title = config.getTitle(this.state.type);
    if (this.title == undefined) {
      window.location.href = "/";
    }

    document.title = this.title + " - DataToolBelt";
    this.getTableData();
    window.onpopstate = () => {};
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
    this.setState({
      isLoading: true,
    });
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
        this.setState({
          isLoading: false,
        });
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

  //For normalization
  onColSelectNormalization = (e) => {
    this.setCol(e.value);
  };

  onMinSetNormalization = (e) => {
    let num = e.target.value;
    this.setInput1(num);
  };

  onMaxSetNormalization = (e) => {
    let num = e.target.value;
    this.setInput2(num);
  };

  normalizeData = (e) => {
    if (!this.validateNormalize()) return;
    this.updateTable();
  };

  validateNormalize = () => {
    let params = this.state.params;
    return (
      params.col != undefined &&
      params.min != undefined &&
      params.max != undefined &&
      params.min != "" &&
      params.max != ""
    );
  };

  //For outlier handling
  onColSelectOutlier = (e) => {
    this.setCol(e.value);
  };

  onMinSetOutlier = (e) => {
    let num = e.target.value;
    this.setInput1(num);
  };

  onMaxSetOutlier = (e) => {
    let num = e.target.value;
    this.setInput2(num);
  };

  handleOutlier = (e) => {
    if (!this.validateOutlier()) return;
    this.updateTable();
  };

  validateOutlier = () => {
    let params = this.state.params;
    return (
      params.col != undefined &&
      params.min != undefined &&
      params.max != undefined &&
      params.min != "" &&
      params.max != ""
    );
  };

  //Null Value Handling
  onColSelectNullValue = (e) => {
    this.setCol(e.value);
  };

  onReplacementMethodNullValue = (e) => {
    let params = this.state.params;
    params.replace = e.value;
    this.setState({
      params,
    });
  };

  handleNullValues = () => {
    if (!this.validateNullValue()) return;
    this.updateTable();
  };

  validateNullValue = () => {
    let params = this.state.params;
    return params.col != undefined && params.replace != undefined;
  };

  //Columnwise Graph
  onColSelectColumnwise = (e) => {
    this.setCol(e.value);
  };

  generateColumnwiseGraph = () => {
    if (!this.validateColumnwise()) return;
    this.getGraph();
  };

  validateColumnwise = () => {
    let params = this.state.params;
    return params.col != undefined;
  };

  //Column Comparison Graph
  onMultiColSelectComparison = (e) => {
    let cols = e.map((col) => col.value);
    this.setState({
      params: {
        cols,
      },
    });
  };

  generateColCompareGraph = () => {
    if (!this.validateColCompare()) return;
    this.getGraph();
  };

  validateColCompare = () => {
    let params = this.state.params;
    return params.cols != undefined && params.cols.length == 2;
  };

  //Heatmap Graph
  onMultiColSelectHeatmap = (e) => {
    let cols = e.map((col) => col.value);
    this.setState({
      params: {
        cols,
      },
    });
  };

  generateColHeatmap = () => {
    if (!this.validateHeatmap()) return;
    this.getGraph();
  };

  validateHeatmap = () => {
    let params = this.state.params;
    return params.cols != undefined && params.cols.length > 1;
  };

  downloadGraph = () => {
    const dl = document.createElement("a");
    dl.href = this.state.graphURL;
    dl.setAttribute("download", this.state.taskId);
    document.body.appendChild(dl);
    dl.click();
    dl.parentNode.removeChild(dl);
  };

  //Feature Creation functions
  variableVarUpdate = (newVar, idx) => {
    let params = this.state.params;
    if (!/^[a-zA-Z]+$/.test(newVar) && newVar != "") return;
    let varList = params.variables.map((variable) => variable.var);
    if (varList.indexOf(newVar) != -1 && newVar != "") return;
    params.variables[idx].var = newVar;
    this.setState({
      params,
    });
  };

  variableColUpdate = (col, idx) => {
    let params = this.state.params;
    params.variables[idx].col = col;
    this.setState({
      params,
    });
  };

  addVariable = () => {
    let params = this.state.params;
    if (!params.variables) {
      params.variables = [];
    }
    params.variables.push({ var: "", col: "" });
    this.setState({
      params,
    });
    console.log(params);
  };

  removeVariable = (idx) => {
    let params = this.state.params;
    if (params.variables.length < 2) return;
    params.variables.splice(idx, 1);
    this.setState({
      params,
    });
  };

  setEquation = (e) => {
    let params = this.state.params;
    params.eq = e.target.value;
    this.setState({
      textinp1: e.target.value,
      params,
    });
  };

  variableObject = (idx) => {
    let variable = this.state.params.variables[idx];
    return (
      <div className="variable-object">
        {this.state.params.variables.length > 1 && (
          <AiFillDelete
            className="clickable"
            style={{ color: "darkred", height: "75%", width: "auto" }}
            onClick={(e) => {
              this.removeVariable(idx);
            }}
          />
        )}
        <div className="input-select">
          <div className="select-title">
            Column Names
            <Select
              options={this.state.rows
                .filter((col) => col.type != "object")
                .map((col) => {
                  return {
                    value: col.title,
                    label: col.title,
                  };
                })}
              value={variable ? variable.col : undefined}
              onChange={(e) => {
                this.variableColUpdate(e, idx);
              }}
              className="selector"
              styles={this.selectStyles}
              components={{
                IndicatorSeparator: () => null,
              }}
            />
          </div>
        </div>
        <div className="select-title" style={{ width: "20%" }}>
          Variable Name
          <input
            className="text-input"
            value={variable ? variable.var : ""}
            onChange={(e) => {
              this.variableVarUpdate(e.target.value, idx);
            }}
          />
        </div>
      </div>
    );
  };

  validateFeatureCreation = () => {
    let params = this.state.params;
    if (
      params.variables == undefined ||
      params.variables.length == 0 ||
      this.state.textinp1 == ""
    )
      return false;
    let variables = params.variables;
    let validate = true;
    let vcount = 0;
    for (let i = 0; i < variables.length; i++) {
      let v = variables[i];
      validate &&= !((v.var != "") ^ (v.col != ""));
      vcount += v.var != "";
    }

    return validate && vcount != 0;
  };

  handleFeatureCreation = () => {
    if (!this.validateFeatureCreation()) return;
    this.updateTable();
  };

  //Misc. functions
  setCol = (col) => {
    let params = this.state.params;
    params.col = col;
    this.setState({
      params,
    });
  };
  setInput1 = (num) => {
    num = num.match("[+-]?([0-9]*[.])?[0-9]*");
    if (num == null) return;
    let params = this.state.params;
    params.min = num[0];
    this.setState({
      textinp1: num[0],
      params,
    });
  };

  setInput2 = (num) => {
    num = num.match("[+-]?([0-9]*[.])?[0-9]*");
    if (num == null) return;
    let params = this.state.params;
    params.max = num[0];
    this.setState({
      textinp2: num[0],
      params,
    });
  };

  getGraph = () => {
    this.setState({
      isLoading: true,
    });
    Axios.post(
      config.routes.function,
      {
        taskId: this.state.taskId,
        operation: this.state.type,
        method: this.state.method,
        params: this.state.params,
      },
      {
        responseType: "blob",
      }
    )
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        let imgUrl = URL.createObjectURL(res.data);
        console.log(imgUrl);
        this.setState({
          graphURL: imgUrl,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateTable = () => {
    Axios.post(config.routes.function, {
      taskId: this.state.taskId,
      operation: this.state.type,
      method: this.state.method,
      params: this.state.params,
    })
      .then((res) => {
        this.getTableData();
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

  //To set sidebar data
  getRows = () => {
    return this.state.rows;
  };

  getCol = () => {
    return this.state.columns;
  };

  getTitle = () => {
    return this.state.title;
  };

  getSize = () => {
    return this.state.size;
  };

  getRowCount = () => {
    return this.state.rowCount;
  };

  getColCount = () => {
    return this.state.columnCount;
  };

  getDate = () => {
    return this.state.date;
  };

  render() {
    if (this.state.isLoading)
      return (
        <div style={{ width: "100vw", height: "100vh" }}>
          <Loader />
        </div>
      );
    return (
      this.state.title && (
        <div className="processor">
          <Sidebar
            taskId={this.state.taskId}
            rows={this.getRows}
            columns={this.getCol}
            title={this.getTitle}
            size={this.getSize}
            rCount={this.getRowCount}
            cCount={this.getColCount}
            date={this.getDate}
          />
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
            {/*Data inputs*/}
            {/*Convert inputs*/}
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
                <div
                  className="submit-btn noselect clickable"
                  onClick={this.convertData}
                >
                  Start Conversion
                  <AiOutlineArrowRight />
                </div>
              </div>
            )}
            {/*Normalization Inputs*/}
            {this.state.method == "normalization" && (
              <div>
                <div className="input-block">
                  <div
                    className="input-col"
                    style={{ marginLeft: "0", width: "40%" }}
                  >
                    <div className="input-title">Column Details</div>
                    <div className="input-select">
                      <div className="select-title">
                        Column Names
                        <Select
                          options={this.state.rows
                            .filter((col) => col.type != "object")
                            .map((col) => {
                              return {
                                value: col.title,
                                label: col.title,
                              };
                            })}
                          onChange={this.onColSelectNormalization}
                          className="selector"
                          styles={this.selectStyles}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-col" style={{ marginRight: "0" }}>
                    <div className="input-title">Range of Integers</div>
                    <div className="input-container">
                      <div className="input-select">
                        <div className="select-title">
                          From
                          <input
                            className="text-input"
                            value={this.state.textinp1}
                            onChange={this.onMinSetNormalization}
                          />
                        </div>
                      </div>
                      <div
                        className="input-select"
                        style={{ marginRight: "0" }}
                      >
                        <div className="select-title">
                          To
                          <input
                            className="text-input"
                            value={this.state.textinp2}
                            onChange={this.onMaxSetNormalization}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.validateNormalize() && (
                  <div
                    className="input-block"
                    style={{ justifyContent: "end" }}
                  >
                    <div
                      className="submit-btn noselect clickable"
                      style={{
                        width: "100%",
                        height: "3rem",
                        maxWidth: "12rem",
                      }}
                      onClick={this.normalizeData}
                    >
                      Normalize Data
                      <AiOutlineArrowRight />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/*Outlier Inputs*/}
            {this.state.method == "outlier" && (
              <div>
                <div className="input-block">
                  <div
                    className="input-col"
                    style={{ marginLeft: "0", width: "40%" }}
                  >
                    <div className="input-title">Column Details</div>
                    <div className="input-select">
                      <div className="select-title">
                        Column Names
                        <Select
                          options={this.state.rows
                            .filter((col) => col.type != "object")
                            .map((col) => {
                              return {
                                value: col.title,
                                label: col.title,
                              };
                            })}
                          onChange={this.onColSelectOutlier}
                          className="selector"
                          styles={this.selectStyles}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-col" style={{ marginRight: "0" }}>
                    <div className="input-title">Range of Integers</div>
                    <div className="input-container">
                      <div className="input-select">
                        <div className="select-title">
                          From
                          <input
                            className="text-input"
                            value={this.state.textinp1}
                            onChange={this.onMinSetOutlier}
                          />
                        </div>
                      </div>
                      <div
                        className="input-select"
                        style={{ marginRight: "0" }}
                      >
                        <div className="select-title">
                          To
                          <input
                            className="text-input"
                            value={this.state.textinp2}
                            onChange={this.onMaxSetOutlier}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.validateOutlier() && (
                  <div
                    className="input-block"
                    style={{ justifyContent: "end" }}
                  >
                    <div
                      className="submit-btn noselect clickable"
                      style={{
                        width: "100%",
                        height: "3rem",
                        maxWidth: "12rem",
                      }}
                      onClick={this.handleOutlier}
                    >
                      Handle Outliers
                      <AiOutlineArrowRight />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/*Null Value Inputs*/}
            {this.state.method == "null-value" && (
              <div>
                <div className="input-block">
                  <div className="input-col" style={{ marginLeft: "0" }}>
                    <div className="input-title">Column Details</div>
                    <div className="input-select">
                      <div className="select-title">
                        Column Names
                        <Select
                          options={this.state.rows
                            .filter((col) => col.type != "object")
                            .map((col) => {
                              return {
                                value: col.title,
                                label: col.title,
                              };
                            })}
                          onChange={this.onColSelectNullValue}
                          className="selector"
                          styles={this.selectStyles}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="input-col" style={{ marginRight: "0" }}>
                    <div className="input-title">Replacement Options</div>
                    <div className="input-select">
                      <div className="select-title">
                        Method
                        <Select
                          options={config.getNullValueOperations()}
                          onChange={this.onReplacementMethodNullValue}
                          className="selector"
                          styles={this.selectStyles}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {this.validateNullValue() && (
                  <div
                    className="input-block"
                    style={{ justifyContent: "end" }}
                  >
                    <div
                      className="submit-btn noselect clickable"
                      style={{
                        width: "100%",
                        height: "3rem",
                        maxWidth: "12rem",
                      }}
                      onClick={this.handleNullValues}
                    >
                      Handle Null Values
                      <AiOutlineArrowRight />
                    </div>
                  </div>
                )}
              </div>
            )}
            {/*Columnwise Inputs*/}
            {this.state.method == "columnwise" && (
              <div className="input-block" style={{ paddingTop: "24px" }}>
                <div className="input-select">
                  <div className="select-title">
                    Column Names
                    <Select
                      options={this.state.rows.map((col) => {
                        return {
                          value: col.title,
                          label: col.title,
                        };
                      })}
                      onChange={this.onColSelectColumnwise}
                      className="selector"
                      styles={this.selectStyles}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                </div>
                <div
                  className="submit-btn noselect clickable"
                  onClick={this.generateColumnwiseGraph}
                >
                  Generate Graph
                  <AiOutlineArrowRight />
                </div>
              </div>
            )}
            {/*Heatmap Inputs*/}
            {this.state.method == "heatmap" && (
              <div className="input-block" style={{ paddingTop: "24px" }}>
                <div className="input-select">
                  <div className="select-title">
                    Column Names
                    <Select
                      options={this.state.rows
                        .filter((col) => col.type != "object")
                        .map((col) => {
                          return {
                            value: col.title,
                            label: col.title,
                          };
                        })}
                      onChange={this.onMultiColSelectHeatmap}
                      isMulti
                      className="selector"
                      styles={this.selectStyles}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                  </div>
                </div>
                <div
                  className="submit-btn noselect clickable"
                  onClick={this.generateColHeatmap}
                >
                  Generate Graph
                  <AiOutlineArrowRight />
                </div>
              </div>
            )}
            {/*Column Comparison Inputs*/}
            {this.state.method == "column-comparison" && (
              <div className="input-block" style={{ paddingTop: "24px" }}>
                <div className="input-select">
                  <div className="select-title">
                    Column Names
                    <Select
                      options={this.state.rows.map((col) => {
                        return {
                          value: col.title,
                          label: col.title,
                        };
                      })}
                      onChange={this.onMultiColSelectComparison}
                      isMulti
                      className="selector"
                      styles={this.selectStyles}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                      isOptionDisabled={(option) =>
                        this.state.params.cols &&
                        this.state.params.cols.length > 1
                      }
                    />
                  </div>
                </div>
                <div
                  className="submit-btn noselect clickable"
                  onClick={this.generateColCompareGraph}
                >
                  Generate Graph
                  <AiOutlineArrowRight />
                </div>
              </div>
            )}
            {/*Feature Creation Inputs*/}
            {this.state.method == "feature-creation" && (
              <div>
                <div className="input-block">
                  <div className="variable-block">
                    <div className="variables">
                      {this.state.params.variables &&
                        this.state.params.variables.map((variable, idx) => {
                          return this.variableObject(idx);
                        })}
                    </div>
                  </div>
                </div>
                <div className="input-block">
                  <div
                    className="input-select"
                    style={{ marginBottom: "20px" }}
                  >
                    <div className="select-title">
                      Equation
                      <input
                        className="text-input"
                        value={this.state.textinp1}
                        onChange={this.setEquation}
                      />
                    </div>
                  </div>
                </div>
                <div className="input-block" style={{ height: "3rem" }}>
                  <div
                    className="submit-btn noselect clickable"
                    style={{ marginLeft: "0" }}
                    onClick={this.addVariable}
                  >
                    Add Variables
                  </div>
                  {this.validateFeatureCreation() && (
                    <div
                      className="submit-btn noselect clickable"
                      onClick={this.handleFeatureCreation}
                    >
                      Create Feature
                      <AiOutlineArrowRight />
                    </div>
                  )}
                </div>
              </div>
            )}
            {/*Graph View*/}
            {this.state.graphURL && (
              <div className="graph-block">
                <div className="graph-dl" onClick={this.downloadGraph}>
                  <AiOutlineCloudDownload />
                </div>
                <div className="graph-container">
                  <img className="graph" src={this.state.graphURL} />
                </div>
              </div>
            )}
            {/*Table View*/}
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
                                      {this.state.data[row.title] ? (
                                        this.state.data[row.title].values[idx]
                                      ) : (
                                        <div className="loader-data">
                                          <span>{"{"}</span>
                                          <span>{"}"}</span>
                                        </div>
                                      )}
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
