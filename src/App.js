    // src/App.js
    import React, { Component } from 'react';
    import GoogleMap from 'google-map-react';
    import axios from 'axios';
    import Pusher from 'pusher-js';
    import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import '@pusher/pusher-websocket-react-native'

    
    const mapStyles = {
      width: '50%',
      height: '50%'
    }
    
    const markerStyle = {
      height: '40px',
      width: '40px',
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

    class Mapa extends React.Component {
        render() {
            return (
                <div>
                    <GoogleMap
                        style={mapStyles}
                        bootstrapURLKeys={{key: 'AIzaSyAhZlf9fcGxTFa6YKRghtLhI_pawBBM8aY'}}
                        center={{lat: -22.91863167496778, lng: -47.1219448635392}}
                        zoom={14}
                    >
                        <Marker
                            title={'Localização atual'}
                            lat={-22.91863167496778}
                            lng={-47.1219448635392}
                        >
                        </Marker>
                    </GoogleMap>
                </div>
            )
        }
    }


    class App extends Component {

        constructor(props) {
            super(props)
            this.state = {
                center: {lat: -22.91863167496778, lng: -47.1219448635392},
                locations: {},
                users_online: [],
                current_user: ''
            }
        }


        getLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.watchPosition(position => {
                    let location = {lat: position.coords.latitude, lng: position.coords.longitude};
                    this.setState((prevState, props) => {
                        let newState = {...prevState};
                        newState.center = location;
                        newState.locations[`${prevState.current_user}`] = location;
                        return newState;
                    });
                    axios.post("http://localhost:3128/update-location", {
                        username: this.state.current_user,
                        location: location
                    }).then(res => {
                        if (res.status === 200) {
                            console.log("new location updated successfully");
                        }
                    });
                })
            } else {
                alert("Sorry, geolocation is not available on your device. You need that to use this app");
            }
        }


        notify = () => toast(`Users online : ${Object.keys(this.state.users_online).length}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: 'info'
        });


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
                    const newState = {...prevState}
                    newState.locations[`${body.username}`] = body.location;
                    return newState;
                });
            });

            this.presenceChannel.bind('pusher:member_removed', member => {
                this.setState((prevState, props) => {
                    const newState = {...prevState};
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

        export {Mapa};
        export default App;

