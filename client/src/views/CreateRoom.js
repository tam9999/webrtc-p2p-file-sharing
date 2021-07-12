import React, { useEffect, useRef, useState } from "react";
import { v1 as uuid } from "uuid";
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import { apiUrlRoom } from '../contexts/constants'
const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        //props.history.push(`${apiUrlRoom}/room/${id}`);
        props.history.push(`/room/${id}`);
        //console.log(props)
    }
    const [inputValue, setInputValue] = useState("");

    return (
        
        <div className='createRoom'>
            
            <h3 className='createRoom' > Create Room </h3>
            <Button className="createRoom" variant='primary' onClick={create}>Create room</Button>
            
            
            <Form>
                <Form.Group controlId="formBasicEmail">
                <h3 className='createRoom'>Or Join Room </h3>
                    <Form.Control 
                    type="text" 
                    placeholder="Enter Room ID" 
                    id="text" 
                    className="copy"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}   
                    />
                    <div className="copy">
                    {/* <input 
                        type="text" 
                        id="text" 
                        className="copy"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}    
                    /> */}
                    <Button className="joinRoom"><a className="btnjoinRoom" href={inputValue} target="_self">Join</a></Button>
                    </div>
                </Form.Group>
            
            </Form>
        
        </div>
    );
};

export default CreateRoom;
