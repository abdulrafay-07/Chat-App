import React, { useState, useEffect, useRef } from 'react';
import appwriteService from '../appwrite/config';
import { FaRegTrashAlt } from 'react-icons/fa';
import conf from '../conf/conf';
import { Header } from '../components/index';
import { useAuth } from '../utils/AuthContext';
import { Role, Permission } from 'appwrite';

const Room = () => {
    const {user} = useAuth();
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();

        const unsubscribe = () => {
        appwriteService.subscribe().then(client => {
                client.subscribe(`databases.${conf.appwriteDatabaseID}.collections.${conf.appwriteCollectionID}.documents`, response => {
                    if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                        setMessages(prevMessages => [...prevMessages, response.payload]);
                    }
    
                    if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                        setMessages(prevMessages => prevMessages.filter(message => message.$id !== response.payload.$id));
                    }
                });
            });       
        }

        return () => {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = () => {
        appwriteService.getMessages()
            .then(response => setMessages(response.documents));
    }

    const handleSubmit = async (e, data) => {
        e.preventDefault();

        let payload = {
            userId: user.$id,
            username: user.name,
            body: messageBody
        }

        let permissions = [
            Permission.write(Role.user(user.$id))
        ]

        const response = await appwriteService.createMessage({payload, permissions});

        // setMessages(prevMessages => [...prevMessages, response]);

        setMessageBody('');
    }

    const deleteMessage = async (msgId) => {
        await appwriteService.deleteMessage(msgId);
        // setMessages(() => messages.filter(message => message.$id !== msgId));
    }

    return (
        <main className='container'>
            <Header />
            <div className='room-container'>
                <div className='messages-container'>    
                    <div>
                        {
                            messages.map((message) => (
                                <div key={message.$id} className='message-wrapper'>
                                    <div className='message-header'>
                                        <p>
                                            {
                                                message?.username ? (
                                                    <span>{message.username}</span>
                                                ) : <span>Anonymous User</span>
                                            }
                                            <small className='message-timestamp'>
                                                {new Date(message.$createdAt).toLocaleString()}
                                            </small>
                                        </p>
                                        {
                                            message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                                                <FaRegTrashAlt 
                                                    onClick={() => deleteMessage(message.$id)} 
                                                    className='delete-btn'
                                                />
                                            )
                                        }
                                    </div>
                                    <div 
                                        className={`${
                                            message.$permissions.includes(`delete(\"user:${user.$id}\")`) ? 
                                            'message-body message-owner-body' : 'message-body message-viewer-body'
                                        }`}
                                    >
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