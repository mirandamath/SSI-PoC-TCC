// src/components/PendingStoreCredentials.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function PendingStoreCredentials({ apiUrl }) {
  const [pendingStores, setPendingStores] = useState([]);

  useEffect(() => {
    fetchPendingStores();
    const intervalId = setInterval(fetchPendingStores, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingStores = () => {
    axios
      .get(`${apiUrl}/issue-credential-2.0/records?state=credential-received`)
      .then((response) => {
        setPendingStores(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending credential stores:', error);
      });
  };

  const storeCredential = (credExId) => {
    axios
      .post(`${apiUrl}/issue-credential-2.0/records/${credExId}/store`, {}) // Send an empty JSON body
      .then(() => {
        alert('Credential stored successfully!');
        fetchPendingStores(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error storing credential:', error);
        alert(`Error storing credential: ${error.response?.data?.detail || error.message}`);
      });
  };

  return (
    <div className="pending-store-credentials">
      <h2 className="pending-store-credentials-title">Armazenamentos de Credencial Pendentes</h2>
      {pendingStores.length > 0 ? (
        <ul className="pending-store-credentials-list">
          {pendingStores.map((store) => (
            <li key={store.cred_ex_record.cred_ex_id} className="pending-store-credentials-item">
              <p className="credential-id">
                <strong>ID da Troca de Credencial:</strong> {store.cred_ex_record.cred_ex_id}
              </p>
              <p className="credential-state">
                <strong>State:</strong> {store.cred_ex_record.state}
              </p>
              <button
                className="store-credential-button"
                onClick={() => storeCredential(store.cred_ex_record.cred_ex_id)}
              >
                Armazenar Credencial
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-store-credentials">Nenhum armazenamento de credencial pendente.</p>
      )}
    </div>
  );
  
}

export default PendingStoreCredentials;
