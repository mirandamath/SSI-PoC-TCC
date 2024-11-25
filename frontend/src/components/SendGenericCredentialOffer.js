
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SendGenericCredentialOffer({ apiUrl }) {
  const [connections, setConnections] = useState([]);
  const [credDefs, setCredDefs] = useState([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [selectedCredDefId, setSelectedCredDefId] = useState('');

  useEffect(() => {
    const fetchConnections = () => {
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
    };

    const fetchCredDefs = () => {
      axios
        .get(`${apiUrl}/credential-definitions/created`)
        .then((response) => {
          const credDefIds = response.data.credential_definition_ids;
          setCredDefs(credDefIds);
        })
        .catch((error) => {
          console.error('Error fetching credential definitions:', error);
        });
    };

    fetchConnections();
    fetchCredDefs();

    const intervalId = setInterval(() => {
      fetchConnections();
      fetchCredDefs();
    }, 5000); // Polling interval de 5 segundos

    return () => clearInterval(intervalId); // Limpar o intervalo quando o componente for desmontado
  }, [apiUrl]);

  const sendGenericOffer = async () => {
    try {
      await axios.post(`${apiUrl}/issue-credential-2.0/send-offer`, {
        connection_id: selectedConnectionId,
        filter: {
          indy: {
            cred_def_id: selectedCredDefId,
          },
        },
        auto_remove: true,
      });

      alert('Oferta genérica de credencial enviada com sucesso!');
    } catch (error) {
      console.error('Error sending generic credential offer:', error);
      alert(`Erro ao enviar oferta genérica de credencial: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
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
      <button
        className="send-generic-offer-button"
        onClick={sendGenericOffer}
        disabled={!selectedConnectionId || !selectedCredDefId}
      >
        Enviar Oferta Genérica de Credencial
      </button>
    </div>
  );
}

export default SendGenericCredentialOffer;