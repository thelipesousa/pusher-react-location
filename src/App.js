    // src/App.js
    import React, { Component } from 'react';
    import GoogleMap from 'google-map-react';
    import axios from 'axios';
    import Pusher from 'pusher-js';
    import { ToastContainer, toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
        

    
    const mapStyles = {
      width: '100%',
      height: '100%'
    }
    
    const markerStyle = {
      height: '50px',
      width: '50px',
      marginTop: '-50px'
    }
    
    const imgStyle = {
      height: '100%'
    }
    
    
    const Marker = ({ title }) => (
      <div style={markerStyle}>
        <img style={imgStyle} src="https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png" alt={title} />
        <h3>{title}</h3>
      </div>
    );
    
    class App extends Component {

      constructor(props) {
        super(props)
        this.state = {
          center: { lat: 5.6219868, lng: -0.23223 },
          locations: {},
          users_online: [],
          current_user: ''
        }
      }
      

      componentDidMount() {
          let pusher = new Pusher('168aba3dfd9f19ba806d', {
            authEndpoint: "http://localhost:3128/pusher/auth",
            cluster: "sa1"
          })
          this.presenceChannel = pusher.subscribe('presence-channel');
          
          this.presenceChannel.bind('pusher:subscription_succeeded', members => {
            this.setState({
              users_online: members.members,
              current_user: members.myID
            });
            this.getLocation();
            this.notify();
          })
          
          this.presenceChannel.bind('location-update', body => {
            this.setState((prevState, props) => {
              const newState = { ...prevState }
              newState.locations[`${body.username}`] = body.location;
              return newState;
            });
          });
          
          this.presenceChannel.bind('pusher:member_removed', member => {
            this.setState((prevState, props) => {
              const newState = { ...prevState };
              // remove member location once they go offline
              delete newState.locations[`${member.id}`];
              // delete member from the list of online users
              delete newState.users_online[`${member.id}`];
              return newState;
            })
            this.notify()
          })
          
          this.presenceChannel.bind('pusher:member_added', member => {
            this.notify();
          })
        }
        
      
    }

    class Mapa extends Component{
      render() {
        return (
          <div >
            <GoogleMap
              style={mapStyles}
              bootstrapURLKeys={{ key: 'AIzaSyAhZlf9fcGxTFa6YKRghtLhI_pawBBM8aY' }}
              center={{ lat: 5.6219868, lng: -0.1733074 }}
              zoom={14}
            >
              <Marker
              title={'Localização atual'}
              lat={5.6219868}
              lng={-0.1733074}
            >
              </Marker>
            </GoogleMap>
          </div>
        )
      }
    }
    export default Mapa;

