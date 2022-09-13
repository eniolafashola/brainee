import React, { Component } from 'react';
import './App.css';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

//user id: xi
//authorize: ad122638ad7740e187f84d7b438f68c7
//app id: c667e9248e3d41d1b80e3cc345abd224
//mvi: fe995da8cb73490f8556416ecf25cea3
//mi: face-detection
//image: https://images.app.goo.gl/ke1PDJJ9e8zgnLt96

// const USER_ID = 'xi';
// const PAT = 'ad122638ad7740e187f84d7b438f68c7';
// const APP_ID = 'c667e9248e3d41d1b80e3cc345abd224';
// const MODEL_ID = 'face-detection';
// const MODEL_VERSION_ID = 'YOUR_MODEL_VERSION_ID';
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

const particlesInit = async (main) => {
    await loadFull(main);
  };

const particlesLoaded = (container) => {

};

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

   calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info_bounding_box;
    const faces = [];
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    for (let i = 0; i < JSON.parse(data).outputs[0].data.regions.length; i++) {
    const clarifaiFace = JSON.parse(data).outputs[0].data.regions[i].region_info.bounding_box;
    faces.push({
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    });
    console.log(faces)
  }

  return faces;
}


  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  oninputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
     this.setState({imageUrl: this.state.input});
      const raw = JSON.stringify({
          "user_app_id": {
              "user_id": 'xi',
              "app_id": 'c667e9248e3d41d1b80e3cc345abd224'
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": 'https://samples.clarifai.com/metro-north.jpg'
                      }
                  }
              }
          ]
      });

      const requestOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key ad122638ad7740e187f84d7b438f68c7'
          },
          body: raw
      };


      fetch("https://api.clarifai.com/v2/models/face-detection/versions/45fb9a671625463fa646c3523a3087d5/outputs", requestOptions)
          .then(response => response.text())
          .then(response => {this.displayFaceBox(this.calculateFaceLocation(response)) })
          .catch(error => console.log('error', error));
  }



  onRouteChange = (route) => {
    if (route === 'signout') {
       this.setState({isSignedIn: false})
    } else if (route === 'home') {
       this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
       <Particles
        className="particles"
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#f5e4c4",
            },
            links: {
              color: "#f5e4c4",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
       { this.state.route === 'home'
         ? <div>
             <Logo />
             <Rank />
             <ImageLinkForm
              oninputChange={this.oninputChange}
              onButtonSubmit={this.onButtonSubmit}
             />
             <FaceRecognition box={this.state.box} imageUrl={this.state.input} />
           </div>
          : (
            this.state.route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
