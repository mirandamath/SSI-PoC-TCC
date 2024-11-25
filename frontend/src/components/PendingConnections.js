// src/components/PendingConnections.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function PendingConnections({ apiUrl }) {
  const [pendingConnections, setPendingConnections] = useState([]);

  useEffect(() => {
    fetchPendingConnections();
    const intervalId = setInterval(fetchPendingConnections, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingConnections = () => {
    axios
      .get(`${apiUrl}/connections?state=request`)
      .then((response) => {
        setPendingConnections(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending connections:', error);
      });
  };

  const acceptConnection = (connectionId) => {
    axios
      .post(`${apiUrl}/didexchange/${connectionId}/accept-request`)
      .then(() => {
        alert('Connection accepted successfully!');
        fetchPendingConnections(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error accepting connection:', error);
      });
  };

  return (
    <div>
      <h2>Conexões Pendentes</h2>
      {pendingConnections.length > 0 ? (
        <ul>
          {pendingConnections.map((conn) => (
            <li key={conn.connection_id}>
              <p>
                <strong>ID da Conexão:</strong> {conn.connection_id}
              </p>
              <p>
                <strong>Label da conexão:</strong> {conn.their_label}
              </p>
              <p>
                <strong>State:</strong> {conn.state}
              </p>
              <button onClick={() => acceptConnection(conn.connection_id)}>
                Aceitar conexão
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem conexões pendentes.</p>
      )}
    </div>
  );
}

export default PendingConnections;
