// src/components/YourCredentials.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function YourCredentials({ apiUrl }) {
  const [credentials, setCredentials] = useState([]);
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    fetchCredentials();
    fetchProofs();
    const intervalId = setInterval(() => {
      fetchCredentials();
      fetchProofs();
    }, 5000); // Atualiza a cada 5 segundos
    return () => clearInterval(intervalId);
  }, [apiUrl]);

  const fetchCredentials = () => {
    axios
      .get(`${apiUrl}/credentials`)
      .then((response) => {
        setCredentials(response.data.results);
      })
      .catch((error) => {
        console.error('Erro ao buscar credenciais:', error);
      });
  };

  const fetchProofs = () => {
    axios
      .get(`${apiUrl}/present-proof-2.0/records`, {
        params: {
          state: 'done', // Estado 'done' indica que a prova foi verificada e armazenada
        },
      })
      .then((response) => {
        setProofs(response.data.results);
      })
      .catch((error) => {
        console.error('Erro ao buscar provas:', error);
      });
  };

  return (
    <div className="your-credentials">
      <h2 className="your-credentials-title">Suas Credenciais</h2>
      {credentials.length > 0 ? (
        <ul className="credentials-list">
          {credentials.map((cred) => (
            <li key={cred.referent} className="credential-item">
              <p className="credential-id">
                <strong>ID da Credencial:</strong> {cred.referent}
              </p>
              <p className="schema-id">
                <strong>ID do Schema:</strong> {cred.schema_id}
              </p>
              <p className="cred-def-id">
                <strong>ID da Definição de Credencial:</strong> {cred.cred_def_id}
              </p>
              <p className="attributes-title">
                <strong>Atributos:</strong>
              </p>
              <ul className="attributes-list">
                {Object.entries(cred.attrs).map(([key, value]) => (
                  <li key={key} className="attribute-item">
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-credentials">Você não possui credenciais.</p>
      )}
    </div>
  );
  
}

export default YourCredentials;
