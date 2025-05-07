import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [editingGroup, setEditingGroup] = useState(null);
    const [error, setError] = useState('');
<<<<<<< HEAD
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
=======
    const navigate = useNavigate();
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a

    useEffect(() => {
        checkAuthentication();
        fetchGroups();
    }, []);

    // Add a function to check authentication status
    const checkAuthentication = () => {
<<<<<<< HEAD
        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            setLoading(false);
=======
        const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
        console.log('Authentication check - localStorage keys:', Object.keys(localStorage));
        console.log('JWT token exists:', !!token);
        
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            // Uncomment this line to automatically redirect to login
            // setTimeout(() => navigate('/login'), 2000);
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        }
    };

    const fetchGroups = async () => {
        try {
<<<<<<< HEAD
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            const response = await axios.get('http://localhost:8080/api/groups', {
=======
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }

            console.log('Using token:', token.substring(0, 20) + '...');
            
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            const response = await axios.get('http://localhost:8081/api/groups', {
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                headers: { 
                    'Authorization': authToken
                }
            });
            setGroups(response.data);
<<<<<<< HEAD
            setLoading(false);
=======
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        } catch (error) {
            console.error('Error fetching groups:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
<<<<<<< HEAD
            } else {
                setError('Failed to load groups. Please try again later.');
            }
            setLoading(false);
=======
            }
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setError('');
        try {
<<<<<<< HEAD
            const token = localStorage.getItem('token');
=======
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            
<<<<<<< HEAD
            // Make sure token is properly formatted with Bearer prefix
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            const response = await axios.post('http://localhost:8080/api/groups', newGroup, {
=======
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
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                headers: { 
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                }
            });
            
<<<<<<< HEAD
=======
            console.log('Group creation response status:', response.status);
            console.log('Group creation response data:', response.data);
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
            setNewGroup({ name: '', description: '' });
            setShowModal(false);
            fetchGroups();
        } catch (error) {
            console.error('Error creating group:', error);
<<<<<<< HEAD
            
            if (error.response) {
                setError(`Failed to create group: ${error.response.data.message || error.message}`);
            } else if (error.request) {
                setError('No response received from server. Please check your network connection.');
            } else {
=======
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
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                setError(`Request error: ${error.message}`);
            }
        }
    };

    const handleUpdateGroup = async (groupId) => {
        try {
<<<<<<< HEAD
            const token = localStorage.getItem('token');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.put(`http://localhost:8080/api/groups/${groupId}`, editingGroup, {
=======
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.put(`http://localhost:8081/api/groups/${groupId}`, editingGroup, {
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                headers: { Authorization: authToken }
            });
            setEditingGroup(null);
            fetchGroups();
        } catch (error) {
            console.error('Error updating group:', error);
<<<<<<< HEAD
            setError('Failed to update group. Please try again.');
=======
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        }
    };

    const handleDeleteGroup = async (groupId) => {
<<<<<<< HEAD
        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.delete(`http://localhost:8080/api/groups/${groupId}`, {
=======
        try {
            const token = localStorage.getItem('token'); // Changed from 'jwt' to 'token'
            const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            await axios.delete(`http://localhost:8081/api/groups/${groupId}`, {
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                headers: { Authorization: authToken }
            });
            fetchGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
<<<<<<< HEAD
            setError('Failed to delete group. Please try again.');
        }
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
                    <p className="text-orange-800">Loading groups...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 py-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12 px-4 mb-10">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Culinary Communities</h1>
                            <p className="text-lg mb-6 text-orange-100">
                                Join groups of food enthusiasts who share your passion for cooking and discover new recipes together.
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-white text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-full font-medium transition duration-200 shadow-md flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create New Group
                            </button>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                                <div className="text-center">
                                    <span className="text-4xl font-bold">{groups.length}</span>
                                    <p className="text-orange-100">Active Groups</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4">
                {/* Error display */}
                {error && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium">{error}</p>
                            {error.includes('Authentication token not found') && (
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                                >
                                    Go to Login
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Groups List */}
                {groups.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No groups found</h3>
                        <p className="text-gray-500 mb-6">Create your first group to start connecting with other food enthusiasts.</p>
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-red-700 transition duration-200 font-medium"
                        >
                            Create First Group
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {groups.map(group => (
                            <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                                {editingGroup && editingGroup.id === group.id ? (
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Group</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                                <input
                                                    type="text"
                                                    value={editingGroup.name}
                                                    onChange={(e) => setEditingGroup({...editingGroup, name: e.target.value})}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    value={editingGroup.description}
                                                    onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})}
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-3 pt-2">
                                                <button
                                                    onClick={() => setEditingGroup(null)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateGroup(group.id)}
                                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-2 bg-gradient-to-r from-orange-500 to-red-600"></div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
                                                    <p className="text-gray-600">{group.description}</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setEditingGroup(group)}
                                                        className="text-orange-600 hover:text-orange-800 transition-colors duration-200"
                                                        title="Edit Group"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGroup(group.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                        title="Delete Group"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Created by {group.user?.firstName || 'Anonymous'}</span>
                                                </div>
                                                <Link 
                                                    to={`/groups/${group.id}`} 
                                                    className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Create New Group</h3>
                        </div>
                        <form onSubmit={handleCreateGroup} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                    <input
                                        type="text"
                                        value={newGroup.name}
                                        onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="e.g., Italian Cuisine Lovers"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newGroup.description}
                                        onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                        rows="4"
                                        placeholder="Describe what your group is about..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Create Group
                                    </button>
                                </div>
=======
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
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
                            </div>
                        </form>
                    </div>
                </div>
            )}
<<<<<<< HEAD
=======

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
>>>>>>> 94e146943f5b3188544a8fdfcd3c5d1551f83e0a
        </div>
    );
};

export default GroupList;
