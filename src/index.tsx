import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
  } from '@pusher/pusher-websocket-react-native';
  
  const pusher = Pusher.getInstance();
  
    await pusher.init({
      apiKey: "elKtmcsmwYZ7drSyDboIy1j9W4r2nhWgOm0xV234yq0", //apikey site do pusher: 168aba3dfd9f19ba806d
      cluster: "sa1"
    });
      
    await pusher.connect();
    await pusher.subscribe({
      channelName: "my-channel", 
      onEvent: (event: PusherEvent) => {
        console.log(`Event received: ${event}`);
      }
    });