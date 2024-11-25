// src/DashboardCondominio.js
import React, { useState } from "react";
import CreateInvitation from "./components/CreateInvitation";
import IssueCredential from "./components/IssueCredential";
import RequestProof from "./components/RequestProof";
import PendingConnections from "./components/PendingConnections";
import PendingCredentialRequests from "./components/PendingCredentialRequests";
import ConnectionsList from "./components/ConnectionsList";
import ValidateProof from "./components/ValidateProof";

function DashboardCondominio({ apiUrl, onBack }) {
  const [activeTab, setActiveTab] = useState('connections');

  return (
    <div className="dashboard-condominio">
      <header className="dashboard-header">
        <h1>Agente - Condomínio</h1>
        <button className="back-button" onClick={onBack}>Voltar</button>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li
            className={activeTab === 'connections' ? 'active' : ''}
            onClick={() => setActiveTab('connections')}
          >
            Conexões
          </li>
          <li
            className={activeTab === 'credentials' ? 'active' : ''}
            onClick={() => setActiveTab('credentials')}
          >
            Credenciais
          </li>
          <li
            className={activeTab === 'proofs' ? 'active' : ''}
            onClick={() => setActiveTab('proofs')}
          >
            Provas
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'connections' && (
          <section className="tab-content">
            <CreateInvitation apiUrl={apiUrl} />
            <ConnectionsList apiUrl={apiUrl} />
            <PendingConnections apiUrl={apiUrl} />
          </section>
        )}
        {activeTab === 'credentials' && (
          <section className="tab-content">
            <IssueCredential apiUrl={apiUrl} />
            <PendingCredentialRequests apiUrl={apiUrl} />
          </section>
        )}
        {activeTab === 'proofs' && (
          <section className="tab-content">
            <RequestProof apiUrl={apiUrl} />
            <ValidateProof apiUrl={apiUrl} />
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardCondominio;
