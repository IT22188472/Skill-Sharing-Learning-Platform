import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [editingGroup, setEditingGroup] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
        fetchGroups();
    }, []);

    // Add a function to check authentication status
    const checkAuthentication = () => {
        const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
        console.log('Authentication check - localStorage keys:', Object.keys(localStorage));
        console.log('JWT token exists:', !!token);
        
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            // Uncomment this line to automatically redirect to login
            // setTimeout(() => navigate('/login'), 2000);
        }
    };

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            console.log('Using token:', token.substring(0, 20) + '...');
            
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            const response = await axios.get('http://localhost:8081/api/groups', {
                headers: { 
                    'Authorization': authToken
                }
            });
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
            }
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            
            console.log('Creating group with token:', token.substring(0, 20) + '...');
            console.log('Group data being sent:', newGroup);
            
            // Make sure token is properly formatted with Bearer prefix
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            // Log the full request details
            console.log('Sending POST request to:', 'http://localhost:8081/api/groups');
            console.log('With headers:', { 
                'Authorization': authToken.substring(0, 20) + '...',
                'Content-Type': 'application/json'
            });
            
            const response = await axios.post('http://localhost:8081/api/groups', newGroup, {
                headers: { 
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Group creation response status:', response.status);
            console.log('Group creation response data:', response.data);
            setNewGroup({ name: '', description: '' });
            setShowModal(false);
            fetchGroups();
        } catch (error) {
            console.error('Error creating group:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Error status:', error.response.status);
                console.log('Error data:', error.response.data);
                console.log('Error headers:', error.response.headers);
                setError(`Server error: ${error.response.status} - ${error.response.data.message || error.message}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('Error request:', error.request);
                setError('No response received from server. Please check your network connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(`Request error: ${error.message}`);
            }
        }
    };

    const handleUpdateGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.put(`http://localhost:8081/api/groups/${groupId}`, editingGroup, {
                headers: { Authorization: authToken }
            });
            setEditingGroup(null);
            fetchGroups();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.delete(`http://localhost:8081/api/groups/${groupId}`, {
                headers: { Authorization: authToken }
            });
            fetchGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Groups</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Group
                </button>
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                    {error.includes('Authentication token not found') && (
                        <button 
                            onClick={() => navigate('/login')} 
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                        >
                            Go to Login
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                                    className="w-full border p-2 rounded"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Create Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Groups List */}
            <div className="space-y-4">
                {groups.map(group => (
                    <div key={group.id} className="border p-4 rounded">
                        {editingGroup && editingGroup.id === group.id ? (
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={editingGroup.name}
                                    onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    value={editingGroup.description}
                                    onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                                    className="border p-2 rounded"
                                />
                                <button
                                    onClick={() => handleUpdateGroup(group.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingGroup(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold">{group.name}</h3>
                                    <p className="text-gray-600">{group.description}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setEditingGroup(group)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupList;
