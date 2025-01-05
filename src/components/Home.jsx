import React, { useState } from 'react';
import Papa from 'papaparse';
import '../Home.css';
import { AiFillDatabase } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import QueryComponent from './Query_section'; // Assuming you have this component

const Home = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.data.length === 0) {
            alert('The CSV file is empty or invalid.');
          } else {
            setCsvData(result.data);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Error parsing the file. Please upload a valid CSV.');
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!csvData || csvData.length === 0) {
      alert('Please upload a valid CSV file before submitting.');
      return;
    }

    setIsSubmitted(true);
    setLoading(true);

    const formData = new FormData();
    const file = document.getElementById('file-upload').files[0];
    formData.append('file', file);

    try {
      const response = await fetch('https://superai-backend.onrender.com/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful!');
      } else {
        alert('not uploaded.');
      }
    } catch (error) {
      console.error('Error submitting file:', error);
      alert('An error occurred while submitting the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ok">
      {!isSubmitted ? (
        
        <div className="home-container">
          <header className="header">
          <AiFillDatabase size={48} />
            
      <h1 className="main-heading">DuckDB text to sql queries</h1>
            <h2 className="sub-heading">
              Run sql queries on your data after uploading your CSV file
            </h2>
          </header>
          <div className="upload-container">
            <label htmlFor="file-upload" className="custom-file-upload">
              Select file(.csv type)
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>
          {fileName && <p className="file-name">Uploaded File: {fileName}</p>}
          {loading ? (
            <p>Loading... Please wait.</p>
          ) : (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      ) : (
        <QueryComponent csvData={csvData} />
      )}
    </div>
  );
};

export default Home;
