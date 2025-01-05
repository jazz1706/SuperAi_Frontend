import React, { useState } from 'react';
import './QueryComponent.css';
const QueryComponent = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [Sqlq, setSqlq] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const rowsPerPage = 10;

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const queryInterfaceStyle = {
        marginTop: result ? '50vh' : '10vh', 
    };

    const executeQuery = async () => {
        if (query.trim() === '') {
            alert("Please enter a query.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://superai-backend.onrender.com/sql-query-builder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
            });

            if (response.ok) {
                const data = await response.json();
                setSqlq(data.sqlQuery);

            
                if (Array.isArray(data.data)) {
                    setResult(data.data);
                    setTotalPages(Math.ceil(data.data.length / rowsPerPage));
                } else {
                    
                    setResult([data.data]); 
                    setTotalPages(1);
                }
            } else {
                alert("Failed to process the query.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const renderTable = () => {
        if (!result || result.length === 0) {
            return <p>No data available</p>;
        }

        if (result.length === 1 && typeof result[0] !== 'object') {
            return <p>Result: {result[0]}</p>;
        }

        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const currentRows = result.slice(startIndex, endIndex);
        const headers = Object.keys(result[0]);

        return (
            <div >
                <table className="result-table">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex}>{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn btn-secondary my-3"
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="mx-3 my-4"> Page {page} of {totalPages} </span>
                        <button
                            className="btn btn-secondary my-3 mx-3"
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="query-interface" style={queryInterfaceStyle}>
            <h2 className="title">Enter Query</h2>

            <div className="query-input-section">
                <textarea
                    className="query-input"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="enter text to be converted to sql query here.."
                />
                <button className="execute-btn" onClick={executeQuery}>
                    {loading ? 'Processing...' : 'Show results'}
                </button>
            </div>
            <div className="console-card">
                <p>Generated SQL Query  : </p>
                <p>{Sqlq}</p>
            </div>
            <div className="query-results">
                {result ? (
                    <div>
                        <h3 className="query-results-heading btn btn-success text-white">Query Results</h3>
                        {renderTable()}
                    </div>
                ) : (
                    <p>No results to display</p>
                )}
            </div>
        </div>
    );
};

export default QueryComponent;
