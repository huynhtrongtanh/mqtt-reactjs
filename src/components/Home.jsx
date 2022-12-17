import { useState, useEffect, useRef } from 'react';
import './Home.css';
import Paho from "paho-mqtt";

const host = 'mqtt.coder96.com';
const port = 9000;
const client = new Paho.Client(host, port, `robot-control-${parseInt(Math.random() * 100)}`);

function Home() {

    const [stateDevice, setStateDevice] = useState('Off');
    const [location, setLocation] = useState('');
    const [color, setColor] = useState('');
    const [isReadData, setIsReadData] = useState(false);


    const topicSub = 'robot-control/subscribe';
    const topicPub = 'robot-control/publish'

    function onMessage(message) {
        if (message.destinationName === topicSub) {
            if (message.payloadString) {
                var mesObj = JSON.parse(message.payloadString);
                setStateDevice(mesObj.stateDevice);
                setLocation(mesObj.location);
                setColor(mesObj.color);
            }
        }
        console.log(message.payloadString);
    }

    function connect() {
        if (!client.isConnected()) {
            client.connect({
                onSuccess: () => {
                    console.log("Connected!");
                    client.subscribe(topicSub);
                    client.onMessageArrived = onMessage;
                },
                onFailure: () => {
                    console.log("Failed to connect!");
                }
            });
        }
    }

    function sendPayLoad() {
        if (client.isConnected()) {
            send();
        } else {
            connect();
            send();
        }

        function send() {
            var message = new Paho.Message("Hello");
            message.destinationName = topicPub;
            client.send(message);
        }
    }

    function disconnect(){
        if(client.isConnected()){
            client.disconnect();
        }
    }

    function handleOnClick() {
        connect();
    }

    function handleOffClick() {
        disconnect();
    }

    return (
        <div className="container">
            <header className="home-header">
                <span>ĐIỀU KHIỂN CÁNH TAY ROBOT</span>
            </header>
            <main>
                <div className="main-container">
                    <div className="main-row">
                        <span>Trạng thái thiết bị</span>
                        <input type="text" className="form-control text-center trang-thai" disabled value={stateDevice} />
                    </div>
                    <div className="main-row">
                        <span>Tọa độ</span>
                        <input type="text" className="form-control text-center trang-thai" disabled value={location} />
                    </div>
                    <div className="main-row">
                        <span>Màu sắc</span>
                        <input type="text" className="form-control text-center trang-thai" disabled value={color} />
                    </div>
                    <div className="main-row">
                        <button type="button" className="btn btn-success" onClick={handleOnClick}>On</button>
                        <button type="button" className="btn btn-danger" onClick={handleOffClick}>Off</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;
