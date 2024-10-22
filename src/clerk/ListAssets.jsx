// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function ListAssets() {
//   const [assets, setAssets] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [editingAsset, setEditingAsset] = useState(null); // Track the currently editing asset
//   const [editData, setEditData] = useState({}); // Hold the data of the asset being edited
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Fetch categories and assets when component mounts
//     const fetchData = async () => {
//       try {
//         const [assetsResponse, categoriesResponse] = await Promise.all([
//           axios.get('http://localhost:3001/assets'),
//           axios.get('http://localhost:3001/categories')
//         ]);

//         setAssets(assetsResponse.data);
//         setCategories(categoriesResponse.data);
//       } catch (error) {
//         setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
//       }
//     };

//     fetchData();
//   }, []);

//   const startEditing = (asset) => {
//     setEditingAsset(asset._id);
//     setEditData({
//       name: asset.name,
//       assetno: asset.assetno,
//       // serialno: asset.serialno,
//       price: asset.price,
//       quantity: asset.quantity,
//       description: asset.description,
//       status: asset.status
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prevData => ({ ...prevData, [name]: value }));
//   };

//   // Save changes for assets
//   const saveChanges = (assetId) => {
//     axios.put(`http://localhost:3001/updateasset/${assetId}`, editData)
//       .then(response => {
//         setAssets(prevAssets => 
//           prevAssets.map(categoryGroup => ({
//             ...categoryGroup,
//             assets: categoryGroup.assets.map(asset => 
//               asset._id === assetId ? response.data : asset
//             )
//           }))
//         );
//         setEditingAsset(null);
//         setEditData({});
//         setMessage('Asset updated successfully');
//       })
//       .catch(error => {
//         setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
//       });
//   };
  


//   const cancelEditing = () => {
//     setEditingAsset(null);
//     setEditData({});
//   };

//   // Create a map for category names based on category IDs
//   const categoryMap = categories.reduce((map, category) => {
//     map[category._id] = category.category;
//     return map;
//   }, {});

//   return (

//     <div className="grid grid-cols-1 mt-10 ml-80 lg:grid-cols-1 gap-6 w-80">
//         <div className="flex justify-between w-80">
//           <div>
//             <h1 className="font-semibold text-2xl bg-gray-50  ">List of Products</h1>
//           </div>
//           {message && <p className="text-gray-300 text-md font-medium hover:text-green-500 ml-20">{message}</p>}
//         </div>
//         <div>
//           {assets.length > 0 ? assets.map((categoryGroup, index) => (
//             <div key={index} className="mb-6">
//               <h2 className="text-xl font-semibold  mb-4">{categoryMap[categoryGroup._id] || "Unknown Category"}</h2> {/* Display category name */}
//               <table className="w-full flex-grow min-w-[540px]">
//                 <thead>
//                   <tr>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Product Name</th>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Product ID</th>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Quantity</th>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Price</th> 
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Description</th>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Status</th>
//                     <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categoryGroup.assets.length > 0 ? categoryGroup.assets.map((asset) => (
//                     <tr key={asset._id}>
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="text"
//                             name="name"
//                             value={editData.name}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.name
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b align-middle border-bg-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="text"
//                             name="assetno"
//                             value={editData.assetno}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.assetno
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="number"
//                             name="quantity"
//                             value={editData.quantity}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.quantity
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="text"
//                             name="price"
//                             value={editData.price}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.price
//                         )}
//                       </td> 
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="text"
//                             name="description"
//                             value={editData.description}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.description
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <input
//                             type="text"
//                             name="status"
//                             value={editData.status}
//                             onChange={handleInputChange}
//                           />
//                         ) : (
//                           asset.status
//                         )}
//                       </td>
//                       <td className="py-2 px-4 border-b align-middle border-b-gray-50">
//                         {editingAsset === asset._id ? (
//                           <>
//                             <button onClick={() => saveChanges(asset._id)} className="hover:bg-gray-500 bg-green-50 text-green-400">Save</button>
//                             <button onClick={cancelEditing} className="hover:bg-gray-500 bg-green-50 text-green-400">Cancel</button>
//                           </>
//                         ) : (
//                           <button onClick={() => startEditing(asset)} className="hover:bg-gray-500 bg-green-50 text-green-400">Edit</button>
//                         )}
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr>
//                       <td colSpan="8" className="py-2 px-4 text-center">No Product available</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )) : (
//             <p>No Product available.</p>
//           )}
//         </div>
//       </div>
    
//   );
// }

// export default ListAssets;
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListAssets = () => {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:3001/assets"),
          axios.get("http://localhost:3001/categories"),
        ]);

        setAssets(assetsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      }
    };

    fetchData();
  }, []);

  const startEditing = (asset) => {
    setEditingAsset(asset._id);
    setEditData({ ...asset });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveChanges = (assetId) => {
    let newStatus;
    if (editData.quantity === 0) {
      newStatus = 'Out Of Stock';
    } else if (editData.quantity < 5) {
      newStatus = 'Low Stock';
    } else {
      newStatus = 'Available';
    }

    axios
      .put(`http://localhost:3001/updateasset/${assetId}`, {
        ...editData,
        status: newStatus,
      })
      .then((response) => {
        setAssets((prevAssets) =>
          prevAssets.map((categoryGroup) => ({
            ...categoryGroup,
            assets: categoryGroup.assets.map((asset) =>
              asset._id === assetId ? response.data : asset
            ),
          }))
        );
        setEditingAsset(null);
        setEditData({});
        setMessage("Asset updated successfully");
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const cancelEditing = () => {
    setEditingAsset(null);
    setEditData({});
  };

  const deleteAsset = (assetId) => {
    axios
      .delete(`http://localhost:3001/deleteasset/${assetId}`)
      .then(() => {
        setAssets((prevAssets) =>
          prevAssets.map((categoryGroup) => ({
            ...categoryGroup,
            assets: categoryGroup.assets.filter((asset) => asset._id !== assetId),
          }))
        );
        setMessage("Asset deleted successfully");
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category.category;
    return map;
  }, {});

  return (
    <div className="grid grid-cols-1 mt-10 ml-80 lg:grid-cols-1 gap-6 w-80">
      <div className="flex justify-between w-80">
        <div>
          <h1 className="font-semibold text-2xl bg-gray-50">List of Products</h1>
        </div>
        <div className="flex-grow self-end text-right">
          <Link to="/registerasset">
            <button className="bg-green-400 w-28 h-11 justify-around hover:text-white items-center hover:bg-gray-300">
              New Products
            </button>
          </Link>
        </div>
        {message && <p className="text-gray-300 text-md font-medium hover:text-green-500 ml-20">{message}</p>}
      </div>
      <div>
        {assets.length > 0 ? (
          assets.map((categoryGroup, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {categoryMap[categoryGroup._id] || "Unknown Category"}
              </h2>
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Product Name</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Product ID</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Quantity</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Purchase Price</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Selling Price</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Description</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Status</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-green-400 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryGroup.assets.length > 0 ? (
                    categoryGroup.assets.map((asset) => (
                      <tr key={asset._id}>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.name
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                name="assetno"
                                value={editData.assetno}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.assetno
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="quantity"
                                value={editData.quantity}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.quantity
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="purchaseprice"
                                value={editData.purchaseprice}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.purchaseprice
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                name="saleprice"
                                value={editData.saleprice}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.saleprice
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                name="description"
                                value={editData.description}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.description
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <div className="flex items-center">
                              <input
                                type="text"
                                name="status"
                                value={editData.status}
                                onChange={handleInputChange}
                                className="border p-1 w-full"
                                style={{ maxWidth: '120px' }}
                              />
                            </div>
                          ) : (
                            asset.status
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingAsset === asset._id ? (
                            <>
                              <button
                                onClick={() => saveChanges(asset._id)}
                                className="text-blue-500 hover:underline mr-4"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-red-500 hover:underline"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(asset)}
                                className="hover:text-blue-700 hover:cursor-pointer mr-4"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteAsset(asset._id)}
                                className="hover:text-red-500 hover:cursor-pointer"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-2 px-4 border-b border-gray-200 text-center">
                        No assets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center">Loading assets...</p>
        )}
      </div>
    </div>
  );
};

export default ListAssets;



