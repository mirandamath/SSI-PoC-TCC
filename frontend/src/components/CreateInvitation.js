// src/components/CreateInvitation.js
import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './Components.css';

function CreateInvitation({ apiUrl }) {
  const [invitationUrl, setInvitationUrl] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');

  const createInvitation = async () => {
    try {
      const response = await axios.post(`${apiUrl}/out-of-band/create-invitation`, {
        handshake_protocols: ['did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0'],
        use_public_did: false,
        include_handshake: true,
      });
      setInvitationUrl(response.data.invitation_url);
      setQrCodeValue(response.data.invitation_url); // Set the QR code value
    } catch (error) {
      console.error('Error creating invitation:', error);
    }
  };

  return (
    <div className="create-invitation">
      <h2 className="create-invitation-title">Criar convite de conexão</h2>
      <button
        className="create-invitation-button"
        onClick={createInvitation}
      >
        Criar convite
      </button>
      {invitationUrl && (
        <div className="invitation-details">
          <p className="invitation-url-label">URL do Convite:</p>
          <textarea
            className="invitation-url-textarea"
            readOnly
            value={invitationUrl}
            rows={4}
            cols={50}
          />
          <button
            className="copy-invitation-button"
            onClick={() => {
              navigator.clipboard.writeText(invitationUrl);
              alert('Invitation URL copied to clipboard!');
            }}
          >
            Copiar URL
          </button>
          <div className="qr-code-section" style={{ marginTop: '20px' }}>
            <p className="qr-code-label">Ou escaneie o QR Code:</p>
            <QRCodeCanvas
              className="qr-code"
              value={qrCodeValue}
              size={256}
            />
          </div>
        </div>
      )}
    </div>
  );
  
  
}

export default CreateInvitation;
