// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function AssetToUser() {
//   const [assets, setAssets] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [assignedAssets, setAssignedAssets] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState("");
//   const [selectedUser, setSelectedUser] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchAssets();
//     fetchUsers();
//     fetchAssignedAssets();
//   }, []);

//   const fetchAssets = () => {
//     axios
//       .get("http://localhost:3001/assets")
//       .then((response) => {
//         // Filter assets with status "Available"
//         const availableAssets = response.data.flatMap(category => 
//           category.assets.filter(asset => asset.status === "Available")
//         );
//         setAssets(availableAssets);
//       })
//       .catch((error) => setMessage(`Error fetching assets: ${error.message}`));
//   };

//   const fetchUsers = () => {
//     axios
//       .get("http://localhost:3001/users")
//       .then((response) => {
//         setUsers(response.data);
//       })
//       .catch((error) => setMessage(`Error fetching users: ${error.message}`));
//   };

//   const fetchAssignedAssets = () => {
//     axios
//       .get("http://localhost:3001/assigned-assets")
//       .then((response) => {
//         setAssignedAssets(response.data);
//       })
//       .catch((error) => setMessage(`Error fetching assigned assets: ${error.message}`));
//   };

//   const handleGiveAsset = () => {
//     if (!selectedAsset || !selectedUser) {
//       setMessage("Please select an asset and a user.");
//       return;
//     }
  
//     // Debugging: Log the payload
//     console.log({
//       assetId: selectedAsset,
//       userId: selectedUser,
//     });
  
//     axios
//       .post("http://localhost:3001/giveasset", {
//         assetId: selectedAsset,
//         userId: selectedUser,
//       })
//       .then((response) => {
//         setMessage("Asset given to user successfully");
//         fetchAssignedAssets(); // Refresh the list after assignment
//         setSelectedAsset("");
//         setSelectedUser("");
//       })
//       .catch((error) => setMessage(`Error assigning asset: ${error.response?.data?.error || error.message}`));
//   };
  

//   return (
//     <div className="max-w-4xl mx-auto p-6 ml-60 rounded-lg shadow-md bg-white">
//       <h2 className="text-3xl mt-4 font-bold text-gray-400 mb-6">Assign Asset to User</h2>
//       {message && <p className="text-green-400 text-lg mb-4">{message}</p>}

//       <div className="mb-6">
//         <div className="flex items-center space-x-4">
//           <label htmlFor="asset-select" className="block text-lg font-medium text-gray-500 mb-2">Select Asset:</label>
//           <select
//             id="asset-select"
//             value={selectedAsset}
//             onChange={(e) => setSelectedAsset(e.target.value)}
//             className="flex-1 w-76 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//           >
//             <option value="" disabled>Select an Asset</option>
//             {assets.map((asset) => (
//               <option key={asset._id} value={asset._id}>
//                 {asset.assetno} - {asset.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="mb-6">
//         <div className="flex items-center space-x-4">
//           <label htmlFor="user-select" className="block text-lg font-medium text-gray-500 mb-2">Select User:</label>
//           <select
//             id="user-select"
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
//           >
//             <option value="" disabled>Select a User</option>
//             {users.map((user) => (
//               <option key={user._id} value={user._id}>
//                 {user.email} - {user.name} 
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <button
//         onClick={handleGiveAsset}
//         className="px-6 py-3 bg-green-400 ml-80 text-white font-semibold rounded-md shadow-md hover:bg-green-500 transition duration-300"
//       >
//         Give Asset
//       </button>

//       <h3 className="text-xl font-semibold text-gray-500 mt-10">Assigned Assets</h3>
//       <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
//         <thead>
//           <tr className="bg-gray-100 text-green-400">
//             <th className="px-4 py-2">Asset Name</th>
//             <th className="px-4 py-2">Asset No</th>
//             <th className="px-4 py-2">Assigned To</th>
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Role</th>
//             <th className="px-4 py-2">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {assignedAssets.length > 0 ? (
//             assignedAssets.map((assignment, index) => (
//               <tr key={index} className="border-b">
//                 <td className="px-4 py-2">{assignment.asset?.name || "N/A"}</td>
//                 <td className="px-4 py-2">{assignment.asset?.assetno || "N/A"}</td>
//                 <td className="px-4 py-2">{assignment.user?.email || "N/A"}</td>
//                 <td className="px-4 py-2">{assignment.user?.name || "N/A"}</td>
//                 <td className="px-4 py-2">{assignment.user?.role || "N/A"}</td>
//                 <td className="px-4 py-2">{new Date(assignment.dateAssigned).toLocaleDateString()}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="text-center py-4">No assets assigned</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AssetToUser;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from 'lodash.debounce';

function AssetToUser() {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [costPrice, setCostPrice] = useState(0);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  useEffect(() => {
    fetchAssets();
    fetchAssignedAssets();
  }, []);

  const fetchAssets = useCallback(debounce(() => {
    axios
      .get("http://localhost:3001/assets", { params: { search: searchTerm } })
      .then((response) => {
        const filteredAssets = response.data.flatMap(category =>
          category.assets.filter(asset => 
            asset.status === "Available" || asset.status === "Low Stock"
          )
        );
        setAssets(filteredAssets);
      })
      .catch((error) => setMessage(`Error fetching assets: ${error.message}`));
  }, 300), [searchTerm]);
  

  const fetchUsers = useCallback(debounce(() => {
    axios
      .get("http://localhost:3001/users", { params: { search: userSearchTerm } })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => setMessage(`Error fetching users: ${error.message}`));
  }, 300), [userSearchTerm]);

  const fetchAssignedAssets = () => {
    axios
      .get("http://localhost:3001/assigned-assets")
      .then((response) => {
        setAssignedAssets(response.data);
      })
      .catch((error) => setMessage(`Error fetching assigned assets: ${error.message}`));
  };

  const handleGiveAsset = () => {
    if (!selectedAsset || !selectedUser || quantity <= 0) {
      setMessage("Please select an asset, a user, and enter a valid quantity.");
      return;
    }
  
    const asset = assets.find(a => a._id === selectedAsset);
    if (!asset) {
      setMessage("Selected asset not found.");
      return;
    }
  
    const totalPrice = asset.saleprice * quantity;
    const costPrice = asset.purchaseprice * quantity; // Calculate cost price
  
    axios
      .post("http://localhost:3001/giveasset", {
        assetId: selectedAsset,
        userId: selectedUser,
        quantity,
        totalPrice,
        costPrice // Pass costPrice to backend
      })
      .then((response) => {
        setMessage("Product sold to user successfully");
        fetchAssignedAssets(); // Refresh the list after assignment
        setSelectedAsset("");
        setSelectedUser("");
        setQuantity(1); // Reset quantity
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || error.message;
        const remainingStock = error.response?.data?.remainingStock;
        if (remainingStock !== undefined) {
          if (remainingStock <= 5) {
            setMessage(`${errorMsg}. Low stock remaining: ${remainingStock}`);
          } else {
            setMessage(`${errorMsg}. Remaining stock: ${remainingStock}`);
          }
        } else {
          setMessage(`Error assigning asset: ${errorMsg}`);
        }
      });
  };
  
  
  
  useEffect(() => {
    fetchAssets();
  }, [searchTerm, fetchAssets]);

  useEffect(() => {
    fetchUsers();
  }, [userSearchTerm, fetchUsers]);

  return (
    <div className="max-w-4xl mx-auto p-6 ml-60 rounded-lg shadow-md bg-white">
      <h2 className="text-3xl mt-4 font-bold text-gray-400 mb-6">Sell Product to User</h2>
      {message && <p className="text-green-400 text-lg mb-4">{message}</p>}
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="search" className="block text-lg font-medium text-gray-500 mb-2 ml-2">Search Product:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Search for products"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="asset-select" className="block text-lg font-medium text-gray-500 mb-2"></label>
            <select
  id="asset-select"
  value={selectedAsset}
  onChange={(e) => setSelectedAsset(e.target.value)}
  className="w-full sm:w-64 md:w-80 lg:w-96 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
>
  <option value="" disabled>Select a Product</option>
  {assets.map((asset) => (
    <option key={asset._id} value={asset._id}>
      {asset.assetno} - {asset.name} - {asset.saleprice} ({asset.status})
    </option>
  ))}
</select>

          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="block text-lg font-medium text-gray-500 mb-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            min="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Enter quantity"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="user-search" className="block text-lg font-medium text-gray-500 mb-2">Search User:</label>
          <input
            type="text"
            id="user-search"
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Search for users"
          />
          <select
            id="user-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="" disabled>Select a User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} - {user.address} - {user.phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleGiveAsset}
        className="px-6 py-3 bg-green-400 ml-80 text-white font-semibold rounded-md shadow-md hover:bg-green-500 transition duration-300"
      >
        Sell Product
      </button>

      <h3 className="text-xl font-semibold text-gray-500 mt-10">Sold Products</h3>
      <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
  <thead>
    <tr className="bg-gray-100 text-green-400">
      <th className="px-4 py-2">Product ID</th>
      <th className="px-4 py-2">Product Name</th>
      <th className="px-4 py-2">Customer</th>
      <th className="px-4 py-2">Phone</th>
      <th className="px-4 py-2">Address</th>
      <th className="px-4 py-2">Sale Price</th>
      <th className="px-4 py-2">Cost Price</th>
      <th className="px-4 py-2">Quantity</th>
      <th className="px-4 py-2">Total Price</th>
      <th className="px-4 py-2">Date</th>
    </tr>
  </thead>
  <tbody>
    {assignedAssets.length > 0 ? (
      assignedAssets.map((assignment, index) => (
        <tr key={index} className="border-b">
          <td className="px-4 py-2">{assignment.asset?.assetno || "N/A"}</td>
          <td className="px-4 py-2">{assignment.asset?.name || "N/A"}</td>
          <td className="px-4 py-2">{assignment.user?.name || "N/A"}</td>
          <td className="px-4 py-2">{assignment.user?.phone || "N/A"}</td>
          <td className="px-4 py-2">{assignment.user?.address || "N/A"}</td>
          <td className="px-4 py-2">{assignment.asset?.saleprice || "N/A"}</td>
          <td className="px-4 py-2">{assignment.costPrice || "N/A"}</td>
          <td className="px-4 py-2">{assignment.quantity || "N/A"}</td>
          <td className="px-4 py-2">{assignment.totalPrice || "N/A"}</td>
          <td className="px-4 py-2">{new Date(assignment.dateAssigned).toLocaleDateString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="10" className="text-center py-4">No products sold</td>
      </tr>
    )}
  </tbody>
</table>
    </div>
  );
}

export default AssetToUser;
