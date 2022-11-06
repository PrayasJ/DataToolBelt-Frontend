import React, { useCallback, useEffect, useState } from "react";
import "./Home.scss";
import Select from "react-select";
import info from "../../Images/info.png";
import process_img from "../../Images/home-process.svg";
import logos from "../../Images/logos.png";

import algo from "../../Images/algo.svg";
import analyze from "../../Images/analyze.svg";
import clean from "../../Images/clean.svg";
import convert from "../../Images/convert.svg";
import visualize from "../../Images/visualize.svg";

import { BsPlusLg } from "react-icons/bs";
import { MdRemoveCircle } from "react-icons/md";

import { useDropzone } from "react-dropzone";
import Header from "../Header/Header";
import Axios from "axios";
import { config } from "../../config";

import Loader from "../../Loader";

import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
const cookies = new Cookies();
//Features on our platform with their image links

interface Features {
  name: string;
  key: string;
  desc: string;
  src: string;
}

const features: Features[] = [
  {
    name: "Data Conversion",
    key: "convert",
    desc: "Convert different formats of data into one other.",
    src: convert,
  },
  {
    name: "Data Cleaning",
    key: "cleaning",
    desc: "Cleaning the data becomes way more easy with features like, Null Value Handling, Outlier Handling, etc",
    src: algo,
  },
  {
    name: "Data Visualization",
    key: "visualization",
    desc: "Helps you to visualize your data with features like, Pie chart creation, Column Representation, Heatmap Generation, etc.",
    src: clean,
  },
  {
    name: "Data Processing",
    key: "processing",
    desc: "Process the data via clustering, PCA, etc .",
    src: visualize,
  },
];

//Used to display the UI steps to DTB
interface Steps {
  title: string;
  text: string;
}

const taskNames = new Map<string, string>()

const steps: Steps[] = [
  {
    title: "Upload",
    text: "You upload your file to our servers",
  },
  {
    title: "Data Conversion",
    text: "We convert your data into something desired.",
  },
  {
    title: "Processing/Visualization/cleaning",
    text: "Anything you want, you can have it here with a click.",
  },
  {
    title: "Download",
    text: "Your result is available to download for free.",
  },
];

function Home() {
  //Function Declaration for file drag and drop hook

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 1) return;
    console.log(acceptedFiles[0]);
    setFiles(acceptedFiles[0]);
  }, []);

  //remove selected file
  const removeFile = () => {
    setFiles(undefined);
  };

  //select Feature

  const onFeatureSelect = (e: any) => {
    setFeature(e == null ? undefined : e);
  };

  //Validate Inputs

  const validateInputs = () => {
    return file != undefined;
  };

  const onSubmitPress = () => {
    if (file == undefined) return;
    let formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    Axios.post(config.routes.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setLoading(false);
        console.log({ res });
        let taskId: string = res.data;
        let newTaskIds = taskIds || [];
        newTaskIds.push(taskId);
        setTaskIds(newTaskIds);
        cookies.set("taskIds", newTaskIds, { path: "/" });
        if (featureSelected) {
          window.location.href = `/${taskId}/${featureSelected.key}`;
        } else {
          window.location.href = `/${taskId}`;
        }
      })
      .catch((err) => {
        console.log({ err });
      });
    //window.location.href = `/12345/${featureSelected.key}`
  };

  //Variable declaration

  const removeAndSetTaskIds = async () => {
    let oldIds = cookies.get("taskIds") || [];
    let ids: string[] = [];
    for (let i in oldIds) {
      let isValid = await isValidTaskId(oldIds[i]);
      if (isValid) {
        ids.push(oldIds[i]);
      }
    }
    cookies.set("taskIds", ids, { path: "/" });
    console.log({ taskIds: ids });
    setTaskIds(ids);
  };

  const isValidTaskId = (id: string) => {
    return new Promise((resolve, reject) => {
      Axios.get(config.routes.fetch + `/${id}`)
        .then((res) => {
          taskNames.set(id, res.data.name)
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  };

  useEffect(() => {
    if (!taskIds) removeAndSetTaskIds();
  });

  const [file, setFiles] = useState<File>();
  const [taskIds, setTaskIds] = useState<string[]>();
  const [featureSelected, setFeature] = useState<Features>(features[4]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/xml": [".xml"],
      "application/xml": [".xml"],
      "application/json": [".json"],
    },
    maxFiles: 1,
  });

  if (isLoading)
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Loader />
      </div>
    );
  return (
    <div className="Home noselect">
      <Header />
      <div className="infographic">
        <div className="file-upload">
          <div className="info-h1">
            Taking too much time to Handle and work on your Data?
          </div>
          <div className="info-h2">Let us work on it!</div>
          <div className="input-title">Select Operation to Perform</div>
          <Select<Features>
            getOptionLabel={(feature: Features) => feature.name}
            getOptionValue={(feature: Features) => feature.key}
            options={features}
            isClearable={true}
            backspaceRemovesValue={true}
            className="dropdown"
            defaultValue={features[4]}
            onChange={onFeatureSelect}
          />

          <div className="input-title">Upload File</div>
          {file ? (
            <div className="file-info" onClick={removeFile}>
              {file.name + " - " + config.bytesToHuman(file.size)}
              <MdRemoveCircle className="remove-btn" />
            </div>
          ) : (
            <div
              className={`drop-area ${isDragActive ? "drag" : ""}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="drop-drag">Drop the files here ...</div>
              ) : (
                <div>
                  <BsPlusLg fontSize={"2em"} />
                  <br />
                  <br />
                  Drag & Drop or <div className="blue">Browse</div>
                </div>
              )}
            </div>
          )}

          {validateInputs() && (
            <div className="submit-btn" onClick={onSubmitPress}>
              Submit
            </div>
          )}

          <div className="tc">
            By using Data Tool Belt you agree to our{" "}
            <a className="blue">Terms of Service</a> and{" "}
            <a className="blue">Privacy Policy</a>.
          </div>
        </div>
        {taskIds && taskIds.length > 0 ? (
          <div className="task-ids">
            <div className="task-text">Previous Sessions</div>
            {taskIds.map(id => {
              return (
                <Link to={'/' + id} className="task-id">{`${id} - ${taskNames.get(id)}`}</Link>
              )
            })}
          </div>
        ) : (
          <div className="info">
            <img width="400px" className="text" src={info} />
          </div>
        )}
      </div>
      <div className="process">
        <div className="title">The process we follow</div>
        <div className="steps">
          {steps.map((step, index) => {
            return (
              <div className="step" key={step.title + index}>
                <img src={process_img} className="process-img" />
                <div className="title2">{step.title}</div>
                <div className="text">{step.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="info-block">
        <div className="text">
          <div className="title">Can import any type of data files!</div>
          <div className="desc">
            Data Tool Belt offers a feature to import any type of data files in
            all famous format. Moreover you can perform all type of operations
            with any type of data file in all famous format.
          </div>
        </div>
        <img className="logos" src={logos} />
      </div>
      <div className="feature-block">
        <div className="main-title">Tailor-made features</div>
        <div className="main-desc">
          Data Tool Belt offer the best-in-class feature to its best-in-class
          users. All Features are crafted to fullfill all needs of the users.
        </div>
        <div className="features">
          {features.map((feature) => {
            return (
              <div className="feature" key={feature.key}>
                <img src={feature.src} className="feature-img" />
                <div className="title">{feature.name}</div>
                <div className="text">{feature.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
