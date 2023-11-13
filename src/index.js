import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const pusher = Pusher.getInstance();

await pusher.init({
    apiKey: "168aba3dfd9f19ba806d",
    cluster: "sa1"
});

await pusher.connect();

const channel: PusherChannel = pusher.subscribe({
    channelName: "react-location",
});

channel.bind('your_event_name', (event: PusherEvent, member: PusherMember) => {
    console.log(`Event received: ${event}, Member Info: ${JSON.stringify(member)}`);
});
