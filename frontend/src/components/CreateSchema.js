// src/components/CreateSchema.js
import React, { useState } from 'react';
import axios from 'axios';
import './Components.css';
function CreateSchema({ apiUrl, onBack }) {
  const [schemaName, setSchemaName] = useState('');
  const [schemaVersion, setSchemaVersion] = useState('');
  const [attributes, setAttributes] = useState('');
  const [schemaId, setSchemaId] = useState('');
  const [credDefId, setCredDefId] = useState('');

  const createSchemaAndCredDef = async () => {
    try {
      // Converter atributos de string para array
      const attributesArray = attributes.split(',').map(attr => attr.trim());

      // Criar Schema
      const schemaResponse = await axios.post(`${apiUrl}/schemas`, {
        schema_name: schemaName,
        schema_version: schemaVersion,
        attributes: attributesArray,
      });
      setSchemaId(schemaResponse.data.schema_id);

      // Criar Definição de Credencial
      const credDefResponse = await axios.post(`${apiUrl}/credential-definitions`, {
        schema_id: schemaResponse.data.schema_id,
        support_revocation: false,
        tag: 'default',
      });
      setCredDefId(credDefResponse.data.credential_definition_id);

      alert('Schema e Definição de Credencial criados com sucesso!');
    } catch (error) {
      console.error('Erro ao criar schema ou definição de credencial:', error);
    }
  };

  return (
    <div className="create-schema">
      <h2 className="create-schema-title">Criação de Schema e Definição de Credencial</h2>
      {/* Botão "Voltar" */}
      <button onClick={onBack}>Voltar</button>
      <div className="schema-input-group">
        <label className="schema-label">Nome do Schema:</label>
        <input
          className="schema-input"
          type="text"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
        />
      </div>
      <div className="schema-input-group">
        <label className="schema-label">Versão do Schema:</label>
        <input
          className="schema-input"
          placeholder='Ex: 1.0'
          type="text"
          value={schemaVersion}
          onChange={(e) => setSchemaVersion(e.target.value)}
        />
      </div>
      <div className="schema-input-group">
        <label className="schema-label">Atributos (separados por vírgula):</label>
        <input
          className="schema-input"
          placeholder='Ex: nome, idade'
          type="text"
          value={attributes}
          onChange={(e) => setAttributes(e.target.value)}
        />
      </div>
      <button className="create-schema-button" onClick={createSchemaAndCredDef}>
        Criar
      </button>
      {schemaId && <p className="schema-id">ID do Schema: {schemaId}</p>}
      {credDefId && <p className="credential-def-id">ID da definição de credencial: {credDefId}</p>}
    </div>
  );
  
}

export default CreateSchema;