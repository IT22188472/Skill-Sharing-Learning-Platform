import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import cooking1 from '../../images/cooking3.jpg'

const GroupDetail = () => {
    const { groupId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [members, setMembers] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchGroupDetails();
    }, [groupId]);

    useEffect(() => {
        // Scroll to bottom of messages
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchGroupDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            // Fetch group details
            const groupResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}`, {
                headers: { 'Authorization': authToken }
            });
            
            setGroup(groupResponse.data);
            
            // Fetch group members
            const membersResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}/members`, {
                headers: { 'Authorization': authToken }
            });
            
            setMembers(membersResponse.data);
            
            // Check if current user is a member
            const userIsMember = membersResponse.data.some(member => member.id === user.id);
            setIsMember(userIsMember);
            
            // Fetch messages if user is a member
            if (userIsMember) {
                const messagesResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}/messages`, {
                    headers: { 'Authorization': authToken }
                });
                
                setMessages(messagesResponse.data);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching group details:', error);
            setError('Failed to load group details. Please try again later.');
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.post(`http://localhost:8080/api/groups/${groupId}/join`, {}, {
                headers: { 'Authorization': authToken }
            });
            
            // Refresh group details
            fetchGroupDetails();
        } catch (error) {
            console.error('Error joining group:', error);
            setError('Failed to join group. Please try again.');
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm('Are you sure you want to leave this group?')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.post(`http://localhost:8080/api/groups/${groupId}/leave`, {}, {
                headers: { 'Authorization': authToken }
            });
            
            // Refresh group details
            fetchGroupDetails();
        } catch (error) {
            console.error('Error leaving group:', error);
            setError('Failed to leave group. Please try again.');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim()) return;
        
        setSendingMessage(true);
        
        try {
            const token = localStorage.getItem('token');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            const response = await axios.post(`http://localhost:8080/api/groups/${groupId}/messages`, 
                { content: newMessage },
                { headers: { 'Authorization': authToken } }
            );
            
            // Add new message to the list
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex justify-center items-center p-4">
                <div className="flex flex-col items-center">
                    <div className="animate-pulse flex space-x-2 mb-4">
                        <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                        <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-orange-800">Loading group details...</p>
                </div>
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="min-h-screen bg-orange-50 flex justify-center items-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The group you're looking for doesn't exist or has been removed."}</p>
                    <Link 
                        to="/groups" 
                        className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors duration-200"
                    >
                        Back to Groups
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 py-24">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 px-4" style={{
                          background: `url(${cooking1}) no-repeat center center / cover`,
                          height: "300px",
                        }}>
                <div className="container mx-auto max-w-5xl" >
                    <div className="flex flex-col md:flex-row items-center justify-between" >
                        <div className="md:w-2/3 mb-8 md:mb-0" >
                            <div className="flex items-center mb-4">
                                <Link 
                                    to="/groups" 
                                    className="flex items-center text-white hover:text-orange-100 transition-colors duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    Back to Groups
                                </Link>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{group.name}</h1>
                            <p className="text-lg mb-6 text-orange-100">
                                {group.description}
                            </p>
                            {!isMember ? (
                                <button
                                    onClick={handleJoinGroup}
                                    className="bg-white text-dark hover:bg-orange-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                    Join Group
                                </button>
                            ) : (
                                <button
                                    onClick={handleLeaveGroup}
                                    className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Leave Group
                                </button>
                            )}
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="bg-white bg-opacity-20 p-6 rounded-3xl shadow-lg backdrop-blur-sm">
                                <div className="text-center">
                                    <span className="text-4xl font-bold text-dark">{members.length}</span>
                                    <p className="text-dark">Members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8">
                {/* Error display */}
                {error && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Members List */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3">
                            <h2 className="text-lg font-bold text-white">Members</h2>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {members.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No members yet</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {members.map(member => (
                                        <li key={member.id} className="py-3 flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3">
                                                {member.firstName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="lg:col-span-2">
                        {isMember ? (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3">
                                    <h2 className="text-lg font-bold text-white">Group Chat</h2>
                                </div>
                                
                                {/* Messages */}
                                <div className="flex-grow p-4 overflow-y-auto">
                                    {messages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((message, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`flex ${message.user.id === user.id ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[70%] ${message.user.id === user.id ? 'bg-orange-100 text-gray-800' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2 shadow-sm`}>
                                                        {message.user.id !== user.id && (
                                                            <p className="text-xs font-medium text-orange-600 mb-1">
                                                                {message.user.firstName} {message.user.lastName}
                                                            </p>
                                                        )}
                                                        <p>{message.content}</p>
                                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                                            {formatDate(message.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Message Input */}
                                <div className="border-t border-gray-200 p-4">
                                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                            disabled={sendingMessage}
                                        />
                                        <button
                                            type="submit"
                                            disabled={sendingMessage || !newMessage.trim()}
                                            className={`px-4 py-2 rounded-md text-white ${
                                                sendingMessage || !newMessage.trim()
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                                            } transition-colors duration-200`}
                                        >
                                            {sendingMessage ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <span>Send</span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden h-[600px] flex flex-col items-center justify-center p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-orange-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Join to Chat</h3>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    You need to be a member of this group to participate in the chat and connect with other food enthusiasts.
                                </p>
                                <button
                                    onClick={handleJoinGroup}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-red-700 transition duration-200 shadow-md flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                    Join Group Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;
