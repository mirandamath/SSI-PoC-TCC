// src/components/PendingCredentialOffers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function PendingCredentialOffers({ apiUrl }) {
  const [pendingOffers, setPendingOffers] = useState([]);

  useEffect(() => {
    fetchPendingOffers();
    const intervalId = setInterval(fetchPendingOffers, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingOffers = () => {
    axios
      .get(`${apiUrl}/issue-credential-2.0/records?state=offer-received`)
      .then((response) => {
        setPendingOffers(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending credential offers:', error);
      });
  };

  const acceptOffer = (credExId) => {
    axios
      .post(`${apiUrl}/issue-credential-2.0/records/${credExId}/send-request`)
      .then(() => {
        alert('Credential request sent successfully!');
        fetchPendingOffers(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error accepting credential offer:', error);
        alert(`Error accepting credential offer: ${error.response?.data?.detail || error.message}`);
      });
  };


  return (
    <div className="pending-credential-offers">
      <h2 className="pending-credential-offers-title">Ofertas de Credencial Pendentes</h2>
      {pendingOffers.length > 0 ? (
        <ul className="pending-credential-offers-list">
          {pendingOffers.map((offer) => (
            <li
              key={offer.cred_ex_record.cred_ex_id}
              className="pending-credential-offers-item"
            >
              <p className="credential-id">
                <strong>ID de Troca de Credencial:</strong>{' '}
                {offer.cred_ex_record.cred_ex_id}
              </p>
              <p className="credential-state">
                <strong>State:</strong> {offer.cred_ex_record.state}
              </p>
              <button
                className="accept-offer-button"
                onClick={() => acceptOffer(offer.cred_ex_record.cred_ex_id)}
              >
                Aceitar Oferta
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-credential-offers">
          Nenhuma oferta de credencial pendente.
        </p>
      )}
    </div>
  );
  
}

export default PendingCredentialOffers;
