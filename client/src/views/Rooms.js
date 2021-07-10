import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import streamSaver from "streamsaver";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import QRCode from "react-qr-code";
import Modal from 'react-bootstrap/Modal'
import { apiUrlRoom } from '../contexts/constants'
import {CopyToClipboard} from "react-copy-to-clipboard"
import NavbarRoom from '../components/layout/NavbarRoom'
import Footer from "../components/layout/Footer";


const worker = new Worker("../worker.js");

const Rooms = (props) => {
    const [connectionEstablished, setConnection] = useState(false);
    const [file, setFile] = useState();
    const [gotFile, setGotFile] = useState(false);

    const socketRef = useRef();
    const peerRef = useRef();
    const fileNameRef = useRef("");

    const roomID = props.match.params.roomID;

    useEffect(() => {
        socketRef.current = io.connect("/");
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", users => {
            peerRef.current = createPeer(users[0], socketRef.current.id);
        });

        socketRef.current.on("user joined", payload => {
            peerRef.current = addPeer(payload.signal, payload.callerID);
        });

        socketRef.current.on("receiving returned signal", payload => {
            peerRef.current.signal(payload.signal);
            setConnection(true);
        });

        socketRef.current.on("room full", () => {
            alert("room is full");
        })
    }, []);

    function createPeer(userToSignal, callerID) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
        });

        peer.on("data", handleReceivingData);
        return peer;
    }

    function addPeer(incomingSignal, callerID) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID });
        });

        peer.on("data", handleReceivingData);

        peer.signal(incomingSignal);
        setConnection(true);
        return peer;
    }

    function handleReceivingData(data) {
        if (data.toString().includes("done")) {
            setGotFile(true);
            const parsed = JSON.parse(data);
            fileNameRef.current = parsed.fileName;
        } else {
            worker.postMessage(data);
        }
    }

    function download() {
        setGotFile(false);
        worker.postMessage("download");
        worker.addEventListener("message", event => {
            const stream = event.data.stream();
            const fileStream = streamSaver.createWriteStream(fileNameRef.current);
            stream.pipeTo(fileStream);
        })
    }

    function selectFile(e) {
        setFile(e.target.files[0]);
    }


    // sendfile
    const sendProgress = document.querySelector('progress#sendProgress');
    let offset = 0;

    function sendFile() {
        const peer = peerRef.current;
        console.log('Sending', file);
        file.arrayBuffer()
        .then(buffer => {  
        sendProgress.max = file.size
        const chunkSize = 16 * 1024;
        while(buffer.byteLength) {
            const chunk = buffer.slice(0, chunkSize);
            buffer = buffer.slice(chunkSize, buffer.byteLength);
            offset += buffer.byteLength;
            sendProgress.value = offset;
            
            peer.send(chunk);
            }
        peer.write(JSON.stringify({ done: true, fileName: file.name }));
        });
    }

    //copy 
    const [inputValue, setInputValue] = useState("");
    // QRCode
    function Example() {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

    return (
        <>
        <div className='sendModal'>
            <Button variant="primary" onClick={handleShow}>
                You have 1 file click here !!!!
            </Button>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Download File</Modal.Title>
            </Modal.Header>
            <Modal.Body  >Click Accept To Download</Modal.Body>
            <Modal.Footer>
            
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={download}>
                Accept
            </Button>

            </Modal.Footer>
        </Modal>
        </>
    );
    }

    let body;
    if (connectionEstablished) {
        body = (
            <div className='send'>
                <Form >
                    <div className="sendForm">
                        <Form.File id="formcheck-api-regular">
                        <Form.File.Label>Plase Choose File You Want Share</Form.File.Label>
                        <Form.File.Input onChange={selectFile} type="file" />
                        </Form.File>
                    
                        <Button onClick={ sendFile } >SEND</Button>
                    </div> 
                    <div class="progress">
                    <div class="label">Send progress: </div>
                        <progress id="sendProgress" max="10px" value="0"></progress>
                    </div>
                </Form>
            </div>
        )
    } else {
        body = (  
        <div>
            <h3 className='copy'>Once you have a peer connection, you will be able to share files</h3>
            <div className='qrcode'>
                <QRCode  value={`${apiUrlRoom}/rooms/`+roomID}/>
            </div>
            <br/>
            <div className="copy">
                <input 
                    type="text" 
                    id="text" 
                    className="copy"
                    value={`${apiUrlRoom}/rooms/`+roomID}
                    onChange={e => setInputValue(e.target.value)}    
                />
                    <CopyToClipboard text={`${apiUrlRoom}/rooms/`+roomID}>
                        <Button className="icon"><i className="copy-text" class="material-icons" id="copy">content_copy</i></Button>
                    </CopyToClipboard>
            </div>
        </div>
        )
    }

    let downloadPrompt;
    if (gotFile) {
        downloadPrompt = (
            <div>
                <Example />
            </div>
        );
    }

    return (
        <>
        <NavbarRoom />
        <div className='rooms'>         
            {body}
            {downloadPrompt}

            <script src="https://cdn.jsdelivr.net/npm/simple-peer@9.5.0/simplepeer.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js"></script>
            <script type="text/javascript" src="qrcode.min.js"></script>
        </div>  
        <Footer/>
        </>
    );
};

export default Rooms;
