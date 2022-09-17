import React from 'react';
import './Home.scss';
import Select from 'react-select';
import info from '../../Images/info.png'
import process_img from '../../Images/home-process.svg'
import logos from '../../Images/logos.png'

import algo from '../../Images/algo.svg'
import analyze from '../../Images/analyze.svg'
import clean from '../../Images/clean.svg'
import convert from '../../Images/convert.svg'
import visualize from '../../Images/visualize.svg'

import { BsPlusLg } from 'react-icons/bs'

interface Features {
  name: string;
  key: string;
  desc: string;
  src: string;
}

const features: Features[] = [
  {
    name: 'Convert',
    key: 'convert',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.',
    src: convert
  },
  {
    name: 'Algorithm',
    key: 'algo',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.',
    src: algo
  },
  {
    name: 'Clean',
    key: 'clean',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.',
    src: clean
  },
  {
    name: 'Analyze',
    key: 'analyze',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.',
    src: analyze
  },
  {
    name: 'Visualize',
    key: 'visualize',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.',
    src: visualize
  }
]

interface Steps {
  title: string;
  text: string;
}

const steps: Steps[] = [
  {
    title: 'Ideate',
    text: 'Turn your idea from concept to MVP'
  },
  {
    title: 'Ideate',
    text: 'Turn your idea from concept to MVP'
  },
  {
    title: 'Ideate',
    text: 'Turn your idea from concept to MVP'
  },
  {
    title: 'Ideate',
    text: 'Turn your idea from concept to MVP'
  }
]

function Home() {
  return (
    <div className="Home">
      <div className='infographic'>
        <div className='file-upload'>
          <div className='info-h1'>
            Taking too much time to Handle and work on your Data?
          </div>
          <div className='info-h2'>
            Let us work on it!
          </div>
          <div className='input-title'>
            Select Operation to Perform
          </div>
          <Select<Features>
            getOptionLabel={(feature: Features) => feature.name}
            getOptionValue={(feature: Features) => feature.key}
            options={features}
            isClearable={true}
            backspaceRemovesValue={true}
            className='dropdown'
          />

          <div className='input-title'>
            Upload File
          </div>
          <div className='drop-area'>
            <BsPlusLg fontSize={"2em"} /><br /><br />
            Drag & Drop or <div className='blue'>Browse</div>
          </div>
          <div className='tc'>
            By using Data Tool Belt you agree to our <a className='blue'>Terms of Service</a> and <a className='blue'>Privacy Policy</a>.
          </div>
        </div>
        <div className='info'>
          <img width="400px" className='text' src={info} />
        </div>
      </div>
      <div className='process'>
        <div className='title'>
          The process we follow
        </div>
        <div className='steps'>
          {(steps.map((step) => {
            return (
              <div className='step'>
                <img src={process_img} className='process-img' />
                <div className='title2'>
                  {step.title}
                </div>
                <div className='text'>
                  {step.text}
                </div>
              </div>
            )
          }))}
        </div>
      </div>
      <div className='info-block'>
        <div className='text'>
          <div className='title'>
            Can import any type of data files!
          </div>
          <div className='desc'>
            Data Tool Belt offers a feature to import any type of data files in all famous format. Moreover you can perform all type of operations with any type of data file in all famous format.
          </div>
        </div>
        <img className='logos' src={logos}/>
      </div>
      <div className='feature-block'>
        <div className='main-title'>
        Tailor-made features
        </div>
        <div className='main-desc'>
        Data Tool Belt offer the best-in-class feature to its best-in-class users. All Features are crafted to fullfill all needs of the users.
          </div>
          <div className='features'>
          {(features.map((feature) => {
            return (
              <div className='feature'>
                <img src={feature.src} className='feature-img' />
                <div className='title'>
                  {feature.name}
                </div>
                <div className='text'>
                  {feature.desc}
                </div>
              </div>
            )
          }))}
          </div>
      </div>
    </div>
  );
}

export default Home;
