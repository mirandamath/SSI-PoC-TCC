// src/components/PendingCredentialRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function PendingCredentialRequests({ apiUrl }) {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchPendingRequests();
    const intervalId = setInterval(fetchPendingRequests, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingRequests = () => {
    axios
      .get(`${apiUrl}/issue-credential-2.0/records?state=request-received`)
      .then((response) => {
        setPendingRequests(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending credential requests:', error);
      });
  };

  const issueCredential = (credExId) => {
    axios
      .post(`${apiUrl}/issue-credential-2.0/records/${credExId}/issue`, {})
      .then(() => {
        alert('Credential issued successfully!');
        fetchPendingRequests(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error issuing credential:', error);
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          'An unknown error occurred';
        alert(`Error issuing credential: ${errorMessage}`);
      });
  };

  return (
    <div className="pending-credential-requests">
      <h2 className="pending-credential-requests-title">Pedidos de Credencial Pendentes</h2>
      {pendingRequests.length > 0 ? (
        <ul className="pending-credential-requests-list">
          {pendingRequests.map((request) => (
            <li
              key={request.cred_ex_record.cred_ex_id}
              className="pending-credential-requests-item"
            >
              <p className="credential-id">
                <strong>ID da troca de Credencial:</strong> {request.cred_ex_record.cred_ex_id}
              </p>
              <p className="credential-state">
                <strong>State:</strong> {request.cred_ex_record.state}
              </p>
              <button
                className="issue-credential-button"
                onClick={() => issueCredential(request.cred_ex_record.cred_ex_id)}
              >
                Emitir Credencial
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-credential-requests">
          Nenhum pedido de credencial pendente.
        </p>
      )}
    </div>
  );
  
}

export default PendingCredentialRequests;
