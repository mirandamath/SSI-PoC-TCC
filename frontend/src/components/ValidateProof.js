// src/components/ValidateProof.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Components.css';
function ValidateProof({ apiUrl }) {
  const [proofs, setProofs] = useState([]);
  const [selectedProofId, setSelectedProofId] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Buscar todas as solicitações de prova com estado 'presentation-received'
    const fetchProofs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/present-proof-2.0/records`);
        const receivedProofs = response.data.results.filter(
          (proof) => proof.state === 'presentation-received'
        );
        setProofs(receivedProofs);
      } catch (err) {
        console.error('Erro ao buscar solicitações de prova:', err);
        setError('Falha ao buscar solicitações de prova.');
      }
    };

    fetchProofs();
  }, [apiUrl]);

  const validateProof = async () => {
    if (!selectedProofId) {
      alert('Por favor, selecione uma solicitação de prova.');
      return;
    }

    setLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const response = await axios.post(
        `${apiUrl}/present-proof-2.0/records/${selectedProofId}/verify-presentation`
      );
      setValidationResult(response.data);
      alert('Prova validada com sucesso!');
    } catch (err) {
      console.error('Erro ao validar prova:', err);
      setError(err.response?.data?.detail || 'Falha na validação da prova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="validate-proof">
      <h2 className="validate-proof-title">Validar Prova</h2>
      {error && (
        <div className="validate-proof-error" style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
      <div className="select-proof">
        <label className="proof-select-label">
          Selecionar Solicitação de Prova:
          <select
            className="proof-select"
            value={selectedProofId}
            onChange={(e) => setSelectedProofId(e.target.value)}
          >
            <option value="">Selecione uma solicitação</option>
            {proofs.map((proof) => (
              <option key={proof.pres_ex_id} value={proof.pres_ex_id}>
                {proof.pres_ex_id} - {proof.name || 'Sem Nome'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="validate-proof-button"
        onClick={validateProof}
        disabled={!selectedProofId || loading}
      >
        {loading ? 'Validando...' : 'Validar Prova'}
      </button>
      {validationResult && (
        <div className="validation-result">
          <h3 className="validation-result-title">Resultado da Validação:</h3>
          <pre className="validation-result-details">
            {JSON.stringify(validationResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
  
}

export default ValidateProof;