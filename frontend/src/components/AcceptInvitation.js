// src/components/AcceptInvitation.js
import React, { useState } from 'react';
import axios from 'axios';
import './Components.css';

function AcceptInvitation({ apiUrl }) {
  const [invitationUrl, setInvitationUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const acceptInvitation = async () => {
    try {
      setStatusMessage('Accepting invitation...');
      setErrorMessage('');

      const invitationUrlObj = new URL(invitationUrl);
      const oobParam = invitationUrlObj.searchParams.get('oob');

      if (!oobParam) {
        throw new Error('Invalid invitation URL. "oob" parameter not found.');
      }

      const invitationJson = atob(oobParam);
      const invitation = JSON.parse(invitationJson);

      const response = await axios.post(
        `${apiUrl}/out-of-band/receive-invitation`,
        invitation,
        {
          params: { auto_accept: 'true' },
        }
      );

      setStatusMessage('Invitation accepted successfully!');
      // Optionally, you can reset the invitation URL field
      setInvitationUrl('');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setErrorMessage(`Error: ${error.message || error}`);
      setStatusMessage('');
    }
  };

  return (
    <div className="accept-invitation">
      <h2 className="accept-invitation-title">Convite de conexão</h2>
      <textarea
        className="accept-invitation-textarea"
        placeholder="Coloque o URL do convite aqui"
        value={invitationUrl}
        onChange={(e) => setInvitationUrl(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />
      <button className="accept-invitation-button" onClick={acceptInvitation}>
        Aceitar convite
      </button>
      {statusMessage && (
        <p className="accept-invitation-success">{statusMessage}</p>
      )}
      {errorMessage && (
        <p className="accept-invitation-error">{errorMessage}</p>
      )}
    </div>
  );
}

export default AcceptInvitation;
