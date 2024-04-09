import React, { useState, useEffect, useRef } from 'react';
import appwriteService from '../appwrite/config';

const Room = () => {
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = () => {
        appwriteService.getMessages()
            .then(response => setMessages(response.documents));
    }

    const handleSubmit = async (e, data) => {
        e.preventDefault();

        let payload = {
            body: messageBody
        }

        await appwriteService.createMessage({...data, payload});

        fetchMessages();

        setMessageBody('');
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className='container'>
            <div className='room-container'>
                <div className='messages-container'>    
                    <div>
                        {
                            messages.map((message) => (
                                <div key={message.$id} className='message-wrapper'>
                                    <div className='message-header'>
                                        <small className='message-timestamp'>{message.$createdAt}</small>
                                    </div>
                                    <div className='message-body'>
                                        <span>{message.body}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} id='message-form'>
                    <div>
                        <textarea
                            required maxLength={150} placeholder='Say something...'
                            onChange={(e) => {setMessageBody(e.target.value)}}
                            value={messageBody}
                        >

                        </textarea>
                    </div>

                    <div className='send-btn-wrapper'>
                        <input className='btn btn-secondary' type='submit' value="Send" />
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Room;