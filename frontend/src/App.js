// src/App.js
import React, { useState } from 'react';
import DashboardCondominio from './DashboardCondominio';
import DashboardResidente from './DashboardResidente';
import CreateSchema from './components/CreateSchema'; // Importar CreateSchema
import './App.css';

function App() {
  const [agentRole, setAgentRole] = useState('');
  const [condoOption, setCondoOption] = useState(''); // Novo estado para opções do condomínio

  const selectAgent = (role) => {
    setAgentRole(role);
  };

  // Funções de retorno
  const handleBackToCondominioOptions = () => {
    setCondoOption('');
  };

  const handleBackToAgentSelection = () => {
    setAgentRole('');
    setCondoOption('');
  };

  if (!agentRole) {
    return (
      <div className="app-select-agent">
        <h1>Selecione o Agente</h1>
        <button onClick={() => selectAgent('condominio')}>Agente Condomínio</button>
        <button onClick={() => selectAgent('resident')}>Agente Residente</button>
      </div>
    );
  }

  if (agentRole === 'condominio' && !condoOption) {
    return (
      <div>
        <h1>Opções Condominio Agent</h1>
        <button onClick={() => setCondoOption('dashboard')}>Dashboard</button>
        <button onClick={() => setCondoOption('createSchema')}>Criar Schema</button>
        {/* Botão "Voltar" para retornar à seleção de agentes */}
        <button onClick={handleBackToAgentSelection}>Voltar</button>
      </div>
    );
  }

  if (agentRole === 'condominio' && condoOption === 'dashboard') {
    return (
      <DashboardCondominio
        apiUrl="http://localhost:8021"
        onBack={handleBackToCondominioOptions}
      />
    );
  }

  if (agentRole === 'condominio' && condoOption === 'createSchema') {
    return (
      <CreateSchema
        apiUrl="http://localhost:8021"
        onBack={handleBackToCondominioOptions}
      />
    );
  }

  if (agentRole === 'resident') {
    return (
      <DashboardResidente
        apiUrl="http://localhost:8031"
        onBack={handleBackToAgentSelection} // Adicionar 'onBack' aqui
      />
    );
  }

  return null;
}

export default App;
