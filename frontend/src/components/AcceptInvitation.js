// src/components/AcceptInvitation.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

import './Components.css';

function AcceptInvitation({ apiUrl }) {
  const [invitationUrl, setInvitationUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const html5QrcodeScannerRef = useRef(null);

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
        { params: { auto_accept: 'true' } }
      );

      setStatusMessage('Invitation accepted successfully!');
      setInvitationUrl('');
    } catch (error) {
      setErrorMessage(`Error: ${error.message || error}`);
      setStatusMessage('');
    }
  };

  useEffect(() => {
    if (showScanner) {
      const config = {
        fps: 60,
        qrbox: 250,

        rememberLastUsedCamera: true,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_FILE,
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        ],
      };

      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        config,
        false
      );

      html5QrcodeScannerRef.current.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(error => {
          console.error('Failed to clear html5QrcodeScanner', error);
        });
        html5QrcodeScannerRef.current = null;
      }
    };
  }, [showScanner]);

  const onScanSuccess = (decodedText, decodedResult) => {
    setInvitationUrl(decodedText);
    setShowScanner(false);
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().then(() => {
        html5QrcodeScannerRef.current = null;
      });
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR Code scan error: ${error}`);
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
      <div className="accept-invitation-buttons">
        <button className="accept-invitation-button" onClick={acceptInvitation}>
          Aceitar convite
        </button>
        <button
          className="accept-invitation-scan-button"
          onClick={() => setShowScanner(!showScanner)}
        >
          {showScanner ? 'Fechar scaner de QR Code' : 'Scanear QR Code'}
        </button>
      </div>
      {showScanner && <div id="qr-reader" className="qr-reader" />}
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
