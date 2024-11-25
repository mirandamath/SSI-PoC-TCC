// src/components/IssueCredential.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function IssueCredential({ apiUrl }) {
  const [connections, setConnections] = useState([]);
  const [credDefs, setCredDefs] = useState([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [selectedCredDefId, setSelectedCredDefId] = useState('');
  const [credentialValues, setCredentialValues] = useState({});
  const [schemaAttrs, setSchemaAttrs] = useState([]);

  useEffect(() => {
    // Buscar conexões ativas
    axios
      .get(`${apiUrl}/connections`)
      .then((response) => {
        const activeConnections = response.data.results.filter((conn) =>
          ['active', 'completed'].includes(conn.state)
        );
        setConnections(activeConnections);
      })
      .catch((error) => {
        console.error('Error fetching connections:', error);
      });

    // Buscar definições de credenciais criadas
    axios
      .get(`${apiUrl}/credential-definitions/created`)
      .then((response) => {
        const credDefIds = response.data.credential_definition_ids;
        setCredDefs(credDefIds);
      })
      .catch((error) => {
        console.error('Error fetching credential definitions:', error);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (selectedCredDefId) {
      // Buscar detalhes da definição de credencial selecionada
      axios
        .get(`${apiUrl}/credential-definitions/${selectedCredDefId}`)
        .then((response) => {
          const schemaId = response.data.credential_definition.schemaId;

          // Buscar o esquema associado
          axios
            .get(`${apiUrl}/schemas/${schemaId}`)
            .then((schemaResponse) => {
              const attrs = schemaResponse.data.schema.attrNames;
              setSchemaAttrs(attrs);

              // Inicializar valores dos atributos
              const initialValues = {};
              attrs.forEach((attr) => {
                initialValues[attr] = '';
              });
              setCredentialValues(initialValues);
            })
            .catch((error) => {
              console.error('Error fetching schema:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching credential definition details:', error);
        });
    }
  }, [selectedCredDefId, apiUrl]);

  const handleAttributeChange = (attrName, value) => {
    setCredentialValues({
      ...credentialValues,
      [attrName]: value,
    });
  };

  const issueCredential = async () => {
    try {
      const attributes = Object.keys(credentialValues).map((key) => ({
        name: key,
        value: credentialValues[key],
      }));

      await axios.post(`${apiUrl}/issue-credential-2.0/send-offer`, {
        connection_id: selectedConnectionId,
        filter: {
          indy: {
            cred_def_id: selectedCredDefId,
          },
        },
        credential_preview: {
          '@type': 'https://didcomm.org/issue-credential/2.0/credential-preview',
          attributes: attributes,
        },
        // auto_issue: true,
        auto_remove: true,
      });

      alert('Credencial emitida com sucesso!');
    } catch (error) {
      console.error('Error issuing credential:', error);
      alert(`Erro ao emitir credencial: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="issue-credential">
      <h2 className="issue-credential-title">Emissão de Credencial</h2>
      <div className="input-group">
        <label className="select-label">Selecione uma conexão:</label>
        <select
          className="connection-select"
          value={selectedConnectionId}
          onChange={(e) => setSelectedConnectionId(e.target.value)}
        >
          <option value="">Selecione uma conexão</option>
          {connections.map((conn) => (
            <option key={conn.connection_id} value={conn.connection_id}>
              {conn.their_label} ({conn.connection_id}) - State: {conn.state}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label className="select-label">Selecione uma Definição de Credencial:</label>
        <select
          className="cred-def-select"
          value={selectedCredDefId}
          onChange={(e) => setSelectedCredDefId(e.target.value)}
        >
          <option value="">Selecione uma Definição de Credencial</option>
          {credDefs.map((credDefId) => (
            <option key={credDefId} value={credDefId}>
              {credDefId}
            </option>
          ))}
        </select>
      </div>
      {schemaAttrs.length > 0 && (
        <div className="attributes-section">
          <h3 className="attributes-title">Preencher os atributos:</h3>
          {schemaAttrs.map((attr) => (
            <div key={attr} className="attribute-input-group">
              <label className="attribute-label">
                {attr}:
                <input
                  className="attribute-input"
                  type="text"
                  value={credentialValues[attr]}
                  onChange={(e) => handleAttributeChange(attr, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      )}
      <button
        className="issue-credential-button"
        onClick={issueCredential}
        disabled={!selectedConnectionId || !selectedCredDefId || schemaAttrs.length === 0}
      >
        Emitir Credencial
      </button>
    </div>
  );
  
}

export default IssueCredential;