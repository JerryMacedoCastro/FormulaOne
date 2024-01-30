import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import WaitingRoom from './components/waitingroom'
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function App() {
  const [conn, setConnection] = useState();
  
  const joinChatRoom = async (username, chatroom) => {
    try {
      //initiate a connection
      const conn = new HubConnectionBuilder()
                      .withUrl("http://localhost:5247/chat")
                      .configureLogging(LogLevel.Information)
                      .build();
      
      //set up handler
      conn.on("JoinSpecificChatRoom", (username, msg) => {
        console.log("msg: ", msg);
      });

      await conn.start();
      // this parameter should match with the name of the hub method 
      await conn.invoke("JoinSpecificChatRoom", {username, chatroom});

      setConnection(conn);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <main>
        <Container>
          <Row class='px-5 py-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>Welcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
        </Container>
      </main>
    </div>
  );
}

export default App;
