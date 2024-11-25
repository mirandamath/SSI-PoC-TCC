// src/components/RespondProofRequest.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function RespondProofRequest({ selectedProofRequest, apiUrl }) {
  const [credentials, setCredentials] = useState([]);
  const [selectedCreds, setSelectedCreds] = useState([]);
  useEffect(() => {
    // Obter a cred_def_id exigida na solicitação de prova
    const requestedAttributes = selectedProofRequest.by_format?.pres_request?.indy?.requested_attributes || {};
    const credDefIds = new Set();

    Object.values(requestedAttributes).forEach((attr) => {
      if (attr.restrictions) {
        attr.restrictions.forEach((restriction) => {
          if (restriction.cred_def_id) {
            credDefIds.add(restriction.cred_def_id);
          }
        });
      }
    });

    // Buscar as credenciais disponíveis
    axios
      .get(`${apiUrl}/present-proof-2.0/records/${selectedProofRequest.pres_ex_id}/credentials`)
      .then((response) => {
        // Filtrar as credenciais que correspondem à cred_def_id exigida
        const matchingCredentials = response.data.filter((cred) => 
            credDefIds.has(cred.cred_info.cred_def_id)
        );
        setCredentials(matchingCredentials);
      })
      .catch((error) => {
        console.error('Erro ao buscar credenciais:', error);
      });
  }, [selectedProofRequest, apiUrl]);

  const handleCredentialSelection = (referent) => {
    if (selectedCreds.includes(referent)) {
      setSelectedCreds(selectedCreds.filter((r) => r !== referent));
    } else {
      setSelectedCreds([...selectedCreds, referent]);
    }
  };

  const sendPresentation = () => {
    // Construir a apresentação com as credenciais selecionadas
    const requestedCredentials = {
      self_attested_attributes: {},
      requested_attributes: {},
      requested_predicates: {},
    };

    const requestedAttrs = selectedProofRequest.by_format?.pres_request?.indy?.requested_attributes || {};

    Object.keys(requestedAttrs).forEach((attrReferent) => {
      const attr = requestedAttrs[attrReferent];
      // Encontrar uma credencial que possua o atributo solicitado
      const matchingCred = credentials.find((cred) =>
        cred.cred_info.attrs.hasOwnProperty(attr.name)
      );

      if (matchingCred && selectedCreds.includes(matchingCred.cred_info.referent)) {
        requestedCredentials.requested_attributes[attrReferent] = {
          cred_id: matchingCred.cred_info.referent,
          revealed: true,
        };
      }
    });

    axios
      .post(
        `${apiUrl}/present-proof-2.0/records/${selectedProofRequest.pres_ex_id}/send-presentation`,
        {
          indy: requestedCredentials,
        }
      )
      .then((response) => {
        alert('Apresentação enviada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao enviar apresentação:', error);
        alert('Erro ao enviar apresentação.');
      });
  };

  return (
    <div className="respond-proof-request">
      <h2 className="respond-proof-request-title">Responder Solicitação de Prova</h2>
      <p className="proof-request-id">
        <strong>ID da Solicitação:</strong> {selectedProofRequest.pres_ex_id}
      </p>
      <p className="proof-request-name">
        <strong>Nome da Solicitação:</strong>{' '}
        {selectedProofRequest.by_format?.pres_request?.indy?.name || 'N/A'}
      </p>
      <h3 className="select-credentials-title">Selecione as Credenciais para Enviar:</h3>
      {credentials.length > 0 ? (
        <ul className="credentials-list">
          {credentials.map((cred) => (
            <li key={cred.cred_info.referent} className="credential-item">
              <label className="credential-label">
                <input
                  type="checkbox"
                  checked={selectedCreds.includes(cred.cred_info.referent)}
                  onChange={() => handleCredentialSelection(cred.cred_info.referent)}
                />
                <strong>Credencial ID:</strong> {cred.cred_info.referent}
                {Object.entries(cred.cred_info.attrs).map(([key, value]) => (
                  <p key={key} className="credential-attribute">
                    <strong>{key}:</strong> {value}
                  </p>
                ))}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-matching-credentials">Nenhuma credencial correspondente encontrada.</p>
      )}
      <button
        className="send-presentation-button"
        onClick={sendPresentation}
        disabled={selectedCreds.length === 0}
      >
        Enviar Apresentação
      </button>
    </div>
  );
  
}

export default RespondProofRequest;