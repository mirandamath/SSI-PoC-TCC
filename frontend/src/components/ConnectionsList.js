// src/components/ConnectionsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function ConnectionsList({ apiUrl }) {
  const [connections, setConnections] = useState([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showResponses, setShowResponses] = useState(false);




  useEffect(() => {
    fetchConnections();
    // Optionally, set up an interval to refresh the list periodically
    const intervalId = setInterval(fetchConnections, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchConnections = () => {
    axios
      .get(`${apiUrl}/connections`)
      .then((response) => {
        setConnections(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching connections:', error);
      });
  };

  const activeConnections = connections.filter(conn => conn.state === 'active');
  const invitationConnections = connections.filter(conn => conn.state === 'invitation');
  const responseConnections = connections.filter(conn => conn.state === 'response');


  return (
    <div className="connections-list">
      <h2 className="connections-list-title">Suas Conexões</h2>
  
      {/* Conexões Ativas */}
      {activeConnections.length > 0 ? (
        <div className="connections-active">
          <h3 className="connections-active-title">Conexões Ativas</h3>
          <ul className="connections-active-list">
            {activeConnections.map((conn) => (
              <li key={conn.connection_id} className="connections-active-item">
                <p className="connection-id">
                  <strong>ID da Conexão:</strong> {conn.connection_id}
                </p>
                <p className="connection-label">
                  <strong>Rótulo:</strong> {conn.their_label}
                </p>
                <p className="connection-state">
                  <strong>Estado:</strong> {conn.state}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-active-connections">Nenhuma conexão ativa encontrada.</p>
      )}
  
      {/* Conexões em 'invitation' */}
      <div className="connections-invitation">
        <h3
          className="connections-invitation-title"
          onClick={() => setShowInvitations(!showInvitations)}
          style={{ cursor: 'pointer' }}
        >
          {showInvitations ? '▼' : '►'} Convites
        </h3>
        {showInvitations && invitationConnections.length > 0 && (
          <ul className="connections-invitation-list">
            {invitationConnections.map((conn) => (
              <li key={conn.connection_id} className="connections-invitation-item">
                <p className="connection-id">
                  <strong>ID da Conexão:</strong> {conn.connection_id}
                </p>
                <p className="connection-label">
                  <strong>Rótulo:</strong> {conn.their_label}
                </p>
                <p className="connection-state">
                  <strong>Estado:</strong> {conn.state}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {/* Conexões em 'response' */}
      <div className="connections-response">
        <h3
          className="connections-response-title"
          onClick={() => setShowResponses(!showResponses)}
          style={{ cursor: 'pointer' }}
        >
          {showResponses ? '▼' : '►'} Respostas
        </h3>
        {showResponses && responseConnections.length > 0 && (
          <ul className="connections-response-list">
            {responseConnections.map((conn) => (
              <li key={conn.connection_id} className="connections-response-item">
                <p className="connection-id">
                  <strong>ID da Conexão:</strong> {conn.connection_id}
                </p>
                <p className="connection-label">
                  <strong>Rótulo:</strong> {conn.their_label}
                </p>
                <p className="connection-state">
                  <strong>Estado:</strong> {conn.state}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
}

export default ConnectionsList;
