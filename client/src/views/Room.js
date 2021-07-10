import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import streamSaver from "streamsaver";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import QRCode from "react-qr-code";
import Modal from 'react-bootstrap/Modal'
//import MDBFileupload from 'mdb-react-fileupload';
// import { StyledDropZone } from 'react-drop-zone';
// import 'react-drop-zone/dist/styles.css';
import { apiUrlRoom } from '../contexts/constants'

// import ProgressBar from 'react-bootstrap/ProgressBar'
import {CopyToClipboard} from "react-copy-to-clipboard"



const worker = new Worker("../worker.js");

const Room = (props) => {
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
        //console.log(e.target.files[0])
    }


    // sendfile
    const sendProgress = document.querySelector('progress#sendProgress');
    //const receiveProgress = document.querySelector('progress#receiveProgress');
    let offset = 0;

    function sendFile() {
        const peer = peerRef.current;
        console.log('Sending', file);
        // We convert the file from Blob to ArrayBuffer
        file.arrayBuffer()
        .then(buffer => {
        
        sendProgress.max = file.size
        // console.log(file.size)
        
        const chunkSize = 16 * 1024;
        // Keep chunking, and sending the chunks to the other peer
        while(buffer.byteLength) {
            const chunk = buffer.slice(0, chunkSize);
            buffer = buffer.slice(chunkSize, buffer.byteLength);
                    // Off goes the chunk!
            offset += buffer.byteLength;
            sendProgress.value = offset;
            //console.log(buffer.byteLength)
            peer.send(chunk);

            
            }
        // End message to signal that all chunks have been sent
        // pc = new RTCPeerConnection({ "iceServers": [{ "url": "stun:127.0.0.1:6120" }] })
        // dc = pc.createDataChannel("channel")
        // dc.send('123')
        peer.write(JSON.stringify({ done: true, fileName: file.name }));
        //console.log(file.name);
        });
    }
    // //drop
    // function App() {
    //     const [files, setFiles] = useState([])
    
    //     const { getRootProps, getInputProps } = useDropzone({
    //         accept: "image/*",
    //         onDrop: (acceptedFiles) => {
    //         setFiles(
    //             acceptedFiles.map((file) =>
    //             Object.assign(file, {
    //                 preview: URL.createObjectURL(file),
    //             })
    //             )
    //         )
    //         },
    //     })
        
    //     const images = files.map((file) => (
    //         <div key={file.name}>
    //         <div>
    //             <img src={file.preview} style={{ width: "200px" }} alt="preview" />
    //         </div>
    //         </div>
    //     ))
        
    //     return (
    //         <div className="App">
    //         <div {...getRootProps()}>
    //             <input {...getInputProps()} />
    //             <p>Drop files here</p>
    //         </div>
    //         <div>{images}</div>
    //         </div>
    //     )
    // }
    //
    // const FileDrop = ({ onDrop }) => {
    //     const [drag, setDrag] = React.useState(false);
    //     const [filename, setFileName] = React.useState('');
    //     let dropRef = React.createRef();
    //     let dragCounter = 0;
    
    // const handleDrag = e => {
    //     e.preventDefault();
    //     e.stopPropagation();
    // };
    
    // const handleDragIn = e => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     dragCounter++;
    //     if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDrag(true);
    // };
    
    // const handleDragOut = e => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     dragCounter--;
    //     if (dragCounter === 0) setDrag(false);
    // };
    
    // const handleDrop = e => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setDrag(false);
    //     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    //     onDrop(e.dataTransfer.files[0]);
    //     //console.log(e.dataTransfer.files[0])
    //     setFileName(e.dataTransfer.files[0].name);
    //     //console.log(setFileName)
    //     e.dataTransfer.clearData();
    //     dragCounter = 0;
    //     }
    // };
    
    // React.useEffect(() => {
    //     let div = dropRef.current;
    //     div.addEventListener('dragenter', handleDragIn);
    //     div.addEventListener('dragleave', handleDragOut);
    //     div.addEventListener('dragover', handleDrag);
    //     div.addEventListener('drop', handleDrop);
        
    //     return () => {
    //         div.removeEventListener('dragenter', handleDragIn);
    //         div.removeEventListener('dragleave', handleDragOut);
    //         div.removeEventListener('dragover', handleDrag);
    //         div.removeEventListener('drop', handleDrop);
    //     };
    // });
    
    // return (
    //     <div
    //     ref={dropRef}
    //     className={
    //         drag ? 'filedrop drag' : filename ? 'filedrop ready' : 'filedrop'
    //     }
    //     >
    //     {filename && !drag ? <div>{filename}</div> : <div>Drop a file here!</div>}
    //     </div>
    // );
    // };
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
                        <Form.File.Label>Plase Click To Choose File You Want Share</Form.File.Label>
                        <Form.File.Input onChange={selectFile} type="file" />
                        </Form.File>
                    
                        <Button className='btnSend' onClick={ sendFile } >SEND</Button>
                    </div> 
                    <div class="progress">
                    <div class="label">Send progress: </div>
                        <progress className='sendProgress' id="sendProgress" max="10px" value="0"></progress>
                    </div>
                </Form>
            </div>
        )
    } else {
        body = (  
        <div >
            <h3 className='copy'>Once you have a peer connection, you will be able to share files</h3>
            <div className='qrcode'>
                <QRCode  value={`${apiUrlRoom}/room/`+roomID}/>
            </div>
            <br/>
            <div className="copy">
                <input 
                    type="text" 
                    id="text" 
                    className="copy"
                    value={`${apiUrlRoom}/room/`+roomID}
                    onChange={e => setInputValue(e.target.value)}    
                />
                    <CopyToClipboard text={`${apiUrlRoom}/room/`+roomID}>
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
        <div className='rooms'>         
            {body}
            {downloadPrompt}

            <script src="https://cdn.jsdelivr.net/npm/simple-peer@9.5.0/simplepeer.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/downloadjs/1.4.8/download.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.min.js"></script>
            <script type="text/javascript" src="qrcode.min.js"></script>
        </div>
        
    );
};

export default Room;
