import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import WaitingRoom from './components/WaitingRoom'
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  
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
        setMessages((messages) => [...messages, { username, msg }]);
      });
      
      conn.on("ReceiveSpecificMessage", (username, msg) => {
        console.log("msg: ", msg, " username ", username);
        setMessages(messages => [...messages, {username, msg}]);
      });

      await conn.start();
      // this parameter should match with the name of the hub method 
      await conn.invoke("JoinSpecificChatRoom", {username, chatroom});

      setConnection(conn);
    } catch (error) {
      console.log(error);
    }
  }

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div>
      <main>
        <Container>
          <Row class='px-5 py-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>Welcome to the F1 ChatApp</h1>
            </Col>
          </Row>
          {!connection
            ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
            : <ChatRoom messages={messages} sendMessage={sendMessage}> </ChatRoom>
          }
        </Container>
      </main>
    </div>
  );
}

export default App;
