import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useParams, useLocation,Link } from 'react-router-dom';
import { FaBars, FaUserPlus,FaUserAlt, FaEdit, FaCommentAlt, FaExchangeAlt } from "react-icons/fa";

function ClerkSidebar({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const { userId } = useParams();

    const menuItem = [
     
        {
            path: "/assets",
            name: "List Of Product",
            icon: <FaCommentAlt />
        },
        {
            path: "/registerasset",
            name: "Register Product",
            icon: <FaUserPlus />
        },
        {
            path: "/category",
            name: "Category",
            icon: <FaUserPlus />
        },
        {
            path: "/assettouser",
            name: "Sell Product",
            icon: <FaEdit />
        },
        {
            path: "/order",
            name: "Order",
            icon: <FaExchangeAlt />
        },
        {
            path: "/reports",
            name: "Report",
            icon: <FaExchangeAlt />
        },
        {
            path: "/",
            name: "Sign Out",
        },
    ];

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    const fetchCategories = () => {
        axios
            .get('http://localhost:3001/categories')
            .then((response) => setCategories(response.data))
            .catch((error) => setMessage(`Error: ${error.message}`));
    };

    const getImageUrl = (category) => {
        const images = {
            "laptop": "https://th.bing.com/th/id/R.a243c72be94e93f1399f3399b06c7677?rik=hrhQ9%2b%2fJ1SSPHA&riu=http%3a%2f%2fwww.riskmanagementmonitor.com%2fwp-content%2fuploads%2f2014%2f12%2fLaptop1.jpg&ehk=OfidPRNnM1a1JERcjUs9J725LwV1tT7YdUTEmeAi5Gw%3d&risl=1&pid=ImgRaw&r=0.jpg",
            "chair": "https://th.bing.com/th/id/OIP._EN7AKBSGGK3N7tOcvXAiAHaJH?w=900&h=1107&rs=1&pid=ImgDetMain.png",
            "desk": "https://th.bing.com/th/id/OIP.Du_6NQqFzzkvX-uToouP1AAAAA?rs=1&pid=ImgDetMain.jpg",
            "printer": "https://th.bing.com/th/id/OIP.s-7ip09iRTwJWLwkRTXF2gAAAA?rs=1&pid=ImgDetMain.jpg",
            "Lockers": "https://th.bing.com/th?id=OIP.jE6hj_JdUP8NRgXKJDaG4gHaFS&w=295&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2.jpg",
            // Add more categories and their corresponding image URLs here
        };
        return images[category] || "https://via.placeholder.com/150?text=Default";
    };

    return (
        <>
            {isAuthenticated && location.pathname !== '/' && (
                <div style={{
                    display: location.pathname === "/reset-password" ? "none" : "flex"
                }}
                className="flex ">
                <div className={`fixed top-0 left-0 bottom-0 bg-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}>
                    <div className="flex items-center bg-gray-80 p-4 ">
                        <h1 className={`${isOpen ? 'block' : 'hidden'} text-xl font-bold ml-2 mb-2 mt-2 text-green-500`}>Property Clerk</h1>
                        <div className="ml-auto text-2xl cursor-pointer mb-4 mt-2 pr-4 hover:bg-green-300 rounded-full p-1 transition-colors duration-200" onClick={toggle}>
                            <FaBars />
                        </div>
                    </div>
                    {menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link flex items-center py-2 px-4 hover:bg-green-400 transition-colors">
                            <div className="icon text-xl text-gray-300 mb-4 mr-2">{item.icon}</div>
                            <div className={`link_text mb-4 ml-2 text-gray-400 text-xl mr-2 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</div>
                        </NavLink>
                    ))}
                </div>

                {assignedAssets.length > 0 && (
                    <main>
                        {children}
                        <div className="flex">
                            <div className="p-6 mb-0 mt-2 ml-80 w-full rounded shadow" style={{ maxHeight: '1000px' }}>
                                <div className="flex gap-4 p-6 w-full ml-0 rounded bg-green-80 ">
                                {categories.map((cat, index) => (
                                    <Boxwrapper key={index} imageUrl={getImageUrl(cat.category)}>
                                        <div className="text-lg font-bold mt-2 text-green-400 font-serif">{cat.category}</div>
                                        <div className="text-lg font-bold ml-6 text-green-400 font-serif">{cat.quantity}</div>
                                    </Boxwrapper>
                                ))}
                                </div>
                                {/* <h2 className="text-3xl mt-4 font-bold text-gray-800 mb-6">Your Assigned Assets</h2>
                                {message && <p className="text-red-600 text-lg mb-4">{message}</p>}
                                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-gray-700">Product Name</th>
                                            <th className="py-3 px-4 text-left text-gray-700">Product No</th>
                                            <th className="py-3 px-4 text-left text-gray-700">Date Assigned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedAssets.map((assignment, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{assignment.asset?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-gray-700">{assignment.asset?.assetno || 'N/A'}</td>
                                                <td className="py-3 px-4 text-gray-700">{new Date(assignment.dateAssigned).toLocaleDateString() || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table> */}
                            </div>
                        </div>
                    </main>
                )}
            </div>
            )}
        </>
    );
}

export default ClerkSidebar;


function Boxwrapper({ children, imageUrl }) {
    return (
        <div className="bg-gray-100 rounded p-4 border border-green-300 flex items-center text-sm flex-col">
            <div>
                <img src={imageUrl} alt="Category" className="w-20 h-16 mb-2" />
                {children}
            </div>
        </div>
    );
}
