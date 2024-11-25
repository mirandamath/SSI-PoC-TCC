// src/components/PendingProofRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function PendingProofRequests({ apiUrl }) {
  const [pendingProofRequests, setPendingProofRequests] = useState([]);

  useEffect(() => {
    fetchPendingProofRequests();
    const intervalId = setInterval(fetchPendingProofRequests, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchPendingProofRequests = () => {
    axios
      .get(`${apiUrl}/present-proof-2.0/records?state=request-received`)
      .then((response) => {
        setPendingProofRequests(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching pending proof requests:', error);
      });
  };

  const acceptProofRequest = async (presExId) => {
    try {
      // Fetch credentials matching the proof request
      const response = await axios.get(
        `${apiUrl}/present-proof-2.0/records/${presExId}/credentials`
      );

      // Build the presentation proposal
      const credentials = response.data;
      const presentation = {
        requested_attributes: {},
        requested_predicates: {},
        self_attested_attributes: {},
      };

      // Map the credentials to the requested attributes
      credentials.forEach((cred) => {
        const referent = cred.cred_info.referent;
        const attrs = cred.cred_info.attrs;

        Object.keys(attrs).forEach((attrName) => {
          presentation.requested_attributes[attrName] = {
            cred_id: referent,
            revealed: true,
          };
        });
      });

      // Send the presentation
      await axios.post(
        `${apiUrl}/present-proof-2.0/records/${presExId}/send-presentation`,
        {
          presentation_request: presentation,
        }
      );

      alert('Proof presentation sent successfully!');
      fetchPendingProofRequests();
    } catch (error) {
      console.error('Error accepting proof request:', error);
    }
  };

  return (
    <div className="pending-proof-requests">
      <h2 className="pending-proof-requests-title">Pending Proof Requests</h2>
      {pendingProofRequests.length > 0 ? (
        <ul className="pending-proof-requests-list">
          {pendingProofRequests.map((request) => (
            <li
              key={request.pres_ex_id}
              className="pending-proof-requests-item"
            >
              <p className="proof-id">
                <strong>Presentation Exchange ID:</strong> {request.pres_ex_id}
              </p>
              <p className="proof-state">
                <strong>State:</strong> {request.state}
              </p>
              <button
                className="accept-proof-request-button"
                onClick={() => acceptProofRequest(request.pres_ex_id)}
              >
                Accept Proof Request
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-proof-requests">
          No pending proof requests.
        </p>
      )}
    </div>
  );
  
}

export default PendingProofRequests;
