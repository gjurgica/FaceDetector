import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import FaceRecognation from './components/faceRecognation/FaceRecognation'
import './App.css';

const app = new Clarifai.App({
  apiKey: 'your api key'
 });

const particleOptions = {
  particles:{
    number:{
      value:180,
      density:{
        enable:true,
        value_area:800
      }
    },
    move:{
      direction:'top-left'
    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box:{},
      route: "signin",
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        join: ""
      }
    }
  }
  loadUser = (user) => {
    this.setState({user:{
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        join: user.join
    }})
  }
  calculateFaceLocation = (data) => {
    console.log(data.outputs[0].data.regions);
    const faces = data.outputs[0].data.regions[0].region_info.bounding_box;
    const imageElement = document.getElementById("image");
    const width = Number(imageElement.width);
    const height = Number(imageElement.height);
    console.log(width,height);
    return {
      leftCol: faces.left_col * width,
      topCol: faces.top_row *height,
      rightCol: width - (faces.right_col * width),
      bottomCol: height - (faces.bottom_row * height) 
    }
  }
  displayBox = (box) => {
    this.setState({box:box});
    console.log(box)
  }
  onRouteChange = (route) => {
    this.setState({route: route})
  }
  onInputChange = (event) => {
    this.setState({input:event.target.value})
  }
  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
    this.state.input
)
.then((response) => {
  if(response){
    fetch('http://localhost:3000/image',{
          method:'put',
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            id: this.state.user.id
      }) 
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user, { entries: count}))
    })
    .catch(console.log)
  }
  this.displayBox(this.calculateFaceLocation(response))})
 .catch((err) => console.log(err)); 
  }
  render(){
    return (
      <div className="App">
        <Particles className="partical" params={particleOptions}/>
        {this.state.route === "home" ?
         <div>
         <Navigation onRouteChange={this.onRouteChange}/> 
         <Logo/>
         <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
         <FaceRecognation box={this.state.box} imageUrl={this.state.imageUrl}/>
         </div> 
         :(
           this.state.route === "signin" 
           ? <SignIn onRouteChange={this.onRouteChange}/> 
           :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
         ) 
       }
      </div>
    );
  }
}

export default App;
