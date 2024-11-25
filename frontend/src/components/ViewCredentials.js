// src/components/ViewCredentials.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function ViewCredentials({ apiUrl }) {
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/credentials`)
      .then((response) => {
        setCredentials(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching credentials:', error);
      });
  }, [apiUrl]);

  return (
    <div className="view-credentials">
      <h2 className="view-credentials-title">Your Credentials</h2>
      {credentials.length > 0 ? (
        <ul className="credentials-list">
          {credentials.map((cred) => (
            <li key={cred.referent} className="credential-item">
              <p className="credential-id">
                <strong>Credential ID:</strong> {cred.referent}
              </p>
              <p className="credential-attributes">
                <strong>Attributes:</strong>{' '}
                {JSON.stringify(cred.attrs, null, 2)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-credentials">No credentials found.</p>
      )}
    </div>
  );
  
}

export default ViewCredentials;
