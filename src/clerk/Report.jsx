import React, { useState, useEffect } from "react";
import axios from "axios";

function Report() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios
      .get("http://localhost:3001/reports")
      .then((response) => {
        console.log("Fetched reports:", response.data); // Debug log
        setReports(response.data);
  
        // If no reports are found, reset totals
        if (response.data.length === 0) {
          setTotalSales(0);
          setProfitOrLoss(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        
        // Reset totals on error
        setTotalSales(0);
        setProfitOrLoss(0);
      });
  };
  const filterByDate = () => {
    if (!startDate || !endDate) {
      const allData = reports.flatMap(report => report.reportData);
      console.log("All report data:", allData); // Debug log
      setFilteredAssignments(allData);
      return;
    }

    const filtered = reports.flatMap(report => report.reportData).filter(entry => {
      const date = new Date(entry.dateAssigned || entry.dateOrdered);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });

    console.log("Filtered data:", filtered); // Debug log
    setFilteredAssignments(filtered);
  };

  const calculateTotals = () => {
    const total = filteredAssignments.reduce((sum, entry) => sum + (entry.totalPrice || 0), 0);
    const costPrice = filteredAssignments.reduce((sum, entry) => sum + (entry.asset?.purchaseprice || 0) * (entry.quantity || 0), 0);
    const profitOrLoss = total - costPrice;

    console.log("Total Sales:", total); // Debug log
    console.log("Profit/Loss:", profitOrLoss); // Debug log
  
    setTotalSales(total);
    setProfitOrLoss(profitOrLoss);
  };

  useEffect(() => {
    calculateTotals();
  }, [filteredAssignments]);

  const generateReport = () => {
    console.log('Sending request with:', { startDate, endDate });
    axios
      .post("http://localhost:3001/reports", { startDate, endDate })
      .then((response) => {
        alert('Report generated successfully!');
        
        // Update totalSales and profitOrLoss from the new report
        const newReport = response.data;
        setTotalSales(newReport.totalSales);
        setProfitOrLoss(newReport.profitOrLoss);
  
        // Fetch the latest reports
        fetchReports();
      })
      .catch((error) => {
        console.error("Error generating report:", error);
        alert('Failed to generate report: ' + (error.response?.data?.error || 'Unknown error'));
  
        // Reset totals on error
        setTotalSales(0);
        setProfitOrLoss(0);
      });
  };
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-3xl font-bold text-gray-400 mb-6">Sales Report</h2>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="start-date" className="block text-lg font-medium text-gray-500 mb-2">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <label htmlFor="end-date" className="block text-lg font-medium text-gray-500 mb-2">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={filterByDate}
            className="px-6 py-2 bg-green-400 text-white font-semibold rounded-md shadow-md hover:bg-green-500 transition duration-300"
          >
            Filter
          </button>
          <button
            onClick={generateReport}
            className="px-6 py-2 bg-blue-400 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300 ml-4"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-500">Total Sales: ${totalSales.toFixed(2)}</h3>
        <h3 className="text-xl font-semibold text-gray-500">Profit/Loss: ${profitOrLoss.toFixed(2)}</h3>
      </div>

      <h3 className="text-xl font-semibold text-gray-500 mt-10">Reports</h3>
      <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-green-400">
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Total Sales</th>
            <th className="px-4 py-2">Profit/Loss</th>
            <th className="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{new Date(report.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(report.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">${report.totalSales.toFixed(2)}</td>
                <td className="px-4 py-2">${report.profitOrLoss.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(report.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">No reports available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Report;
