// src/components/RequestProof.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function RequestProof({ apiUrl }) {
  const [connections, setConnections] = useState([]);
  const [credDefs, setCredDefs] = useState([]);
  const [schemas, setSchemas] = useState({});
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [selectedCredDefId, setSelectedCredDefId] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  

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
        console.error('Erro ao buscar conexões:', error);
      });

    // Buscar definições de credenciais criadas
    axios
      .get(`${apiUrl}/credential-definitions/created`)
      .then((response) => {
        const credDefIds = response.data.credential_definition_ids;
        setCredDefs(credDefIds);

        // Para cada credDefId, buscar o esquema associado
        credDefIds.forEach((credDefId) => {
          axios
            .get(`${apiUrl}/credential-definitions/${credDefId}`)
            .then((credDefResponse) => {
              const schemaId = credDefResponse.data.credential_definition.schemaId;

              // Buscar o esquema associado
              axios
                .get(`${apiUrl}/schemas/${schemaId}`)
                .then((schemaResponse) => {
                  setSchemas((prevSchemas) => ({
                    ...prevSchemas,
                    [credDefId]: schemaResponse.data.schema,
                  }));
                })
                .catch((error) => {
                  console.error('Erro ao buscar schema:', error);
                });
            })
            .catch((error) => {
              console.error('Erro ao buscar definição de credencial:', error);
            });
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar definições de credenciais:', error);
      });
  }, [apiUrl]);

  useEffect(() => {
    if (selectedCredDefId && schemas[selectedCredDefId]) {
      const attrs = schemas[selectedCredDefId].attrNames;
      setAttributes(attrs);

      // Inicializar seleção de atributos
      const initialSelectedAttrs = {};
      attrs.forEach((attr) => {
        initialSelectedAttrs[attr] = false;
      });
      setSelectedAttributes(initialSelectedAttrs);
    }
  }, [selectedCredDefId, schemas]);

  const handleAttributeSelection = (attrName) => {
    setSelectedAttributes((prevSelected) => ({
      ...prevSelected,
      [attrName]: !prevSelected[attrName],
    }));
  };

  const sendProofRequest = async () => {
    if (!selectedConnectionId) {
      alert('Por favor, selecione uma conexão.');
      return;
    }

    if (!selectedCredDefId) {
      alert('Por favor, selecione uma definição de credencial.');
      return;
    }

    const selectedAttrs = Object.keys(selectedAttributes).filter(
      (attr) => selectedAttributes[attr]
    );

    if (selectedAttrs.length === 0) {
      alert('Por favor, selecione ao menos um atributo.');
      return;
    }

    // Construir requested_attributes
    const requestedAttributes = {};
    selectedAttrs.forEach((attr, index) => {
      requestedAttributes[`attr${index + 1}_referent`] = {
        name: attr,
        restrictions: [
          {
            cred_def_id: selectedCredDefId,
          },
        ],
      };
    });

    try {
      const proofRequest = {
        connection_id: selectedConnectionId,
        presentation_request: {
          indy: {
            name: 'Solicitação de Prova',
            version: '1.0',
            requested_attributes: requestedAttributes,
            requested_predicates: {},
          },
        },
        comment: 'Solicitação de prova dinâmica.',
      };

      console.log('Enviando solicitação de prova:', proofRequest);
      const response = await axios.post(
        `${apiUrl}/present-proof-2.0/send-request`,
        proofRequest
      );

      alert('Solicitação de prova enviada com sucesso!');
      console.log('Resposta da Solicitação de Prova:', response.data);
    } catch (error) {
      console.error('Erro ao enviar solicitação de prova:', error);
      alert(
        `Erro ao enviar solicitação de prova: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  return (
    <div className="request-proof">
      <h2 className="request-proof-title">Solicitar Prova</h2>
      <div className="select-connection">
        <label className="connection-label">
          Selecionar Conexão:
          <select
            className="connection-select"
            value={selectedConnectionId}
            onChange={(e) => setSelectedConnectionId(e.target.value)}
          >
            <option value="">Selecione uma conexão</option>
            {connections.map((conn) => (
              <option key={conn.connection_id} value={conn.connection_id}>
                {conn.their_label} ({conn.connection_id}) - Estado: {conn.state}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="select-cred-def">
        <label className="cred-def-label">
          Selecionar Definição de Credencial:
          <select
            className="cred-def-select"
            value={selectedCredDefId}
            onChange={(e) => setSelectedCredDefId(e.target.value)}
          >
            <option value="">Selecione uma definição de credencial</option>
            {credDefs.map((credDefId) => (
              <option key={credDefId} value={credDefId}>
                {credDefId}
              </option>
            ))}
          </select>
        </label>
      </div>
      {attributes.length > 0 && (
        <div className="select-attributes">
          <h3 className="attributes-title">Selecione os Atributos para a Prova:</h3>
          {attributes.map((attr) => (
            <div key={attr} className="attribute-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={selectedAttributes[attr]}
                  onChange={() => handleAttributeSelection(attr)}
                />
                {attr}
              </label>
            </div>
          ))}
        </div>
      )}
      <button className="send-proof-request-button" onClick={sendProofRequest}>
        Enviar Solicitação de Prova
      </button>
    </div>
  );
  
}

export default RequestProof;