
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';

function PendingCredentialProposals({ apiUrl }) {
  const [pendingProposals, setPendingProposals] = useState([]);

  useEffect(() => {
    fetchPendingProposals();
    const intervalId = setInterval(fetchPendingProposals, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingProposals = () => {
    axios
      .get(`${apiUrl}/issue-credential-2.0/records?state=proposal-received`)
      .then((response) => {
        setPendingProposals(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending credential proposals:', error);
      });
  };

  const sendCredentialOffer = (credExId, proposalAttributes) => {
    axios
      .post(`${apiUrl}/issue-credential-2.0/records/${credExId}/send-offer`, {
        credential_preview: {
          '@type': 'https://didcomm.org/issue-credential/2.0/credential-preview',
          attributes: proposalAttributes,
        },
      })
      .then(() => {
        alert('Credential offer sent successfully!');
        fetchPendingProposals(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error sending credential offer:', error);
        alert(`Error sending credential offer: ${error.response?.data?.detail || error.message}`);
      });
  };

  return (
    <div className="pending-credential-proposals">
      <h2 className="pending-credential-proposals-title">Propostas de Credencial Pendentes</h2>
      {pendingProposals.length > 0 ? (
        <ul className="pending-credential-proposals-list">
          {pendingProposals.map((proposal) => (
            <li
              key={proposal.cred_ex_record.cred_ex_id}
              className="pending-credential-proposals-item"
            >
              <p className="credential-id">
                <strong>ID da Proposta de Credencial:</strong> {proposal.cred_ex_record.cred_ex_id}
              </p>
              <p className="credential-state">
                <strong>State:</strong> {proposal.cred_ex_record.state}
              </p>
              <button
                className="send-offer-button"
                onClick={() => sendCredentialOffer(proposal.cred_ex_record.cred_ex_id, proposal.cred_ex_record.credential_proposal_dict.credential_proposal.attributes)}
              >
                Enviar Oferta de Credencial
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-credential-proposals">Nenhuma proposta de credencial pendente.</p>
      )}
    </div>
  );
}

export default PendingCredentialProposals;