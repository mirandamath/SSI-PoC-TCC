import React, { useState } from "react";
import AcceptInvitation from "./components/AcceptInvitation";
import PendingConnections from "./components/PendingConnections";
import ConnectionsList from "./components/ConnectionsList";
import PendingStoreCredentials from "./components/PendingStoreCredentials";
import PendingCredentialOffers from "./components/PendingCredentialOffers";
import YourCredentials from "./components/YourCredentials";
import ViewProofRequests from "./components/ViewProofRequests";
import RespondProofRequest from "./components/RespondProofRequest";

function DashboardResidente({ apiUrl, onBack }) {
  const [activeTab, setActiveTab] = useState('connections');
  const [selectedProofRequest, setSelectedProofRequest] = useState(null);

  const handleSelectProofRequest = (proofRequest) => {
    setSelectedProofRequest(proofRequest);
  };

  const handleResponseSent = () => {
    setSelectedProofRequest(null);
  };

  return (
    <div className="dashboard-residente">
      <header className="dashboard-header">
        <h1>Dashboard - Residente</h1>
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
            className={activeTab === 'offers' ? 'active' : ''}
            onClick={() => setActiveTab('offers')}
          >
            Ofertas de Credencial
          </li>
          <li
            className={activeTab === 'proofs' ? 'active' : ''}
            onClick={() => setActiveTab('proofs')}
          >
            Solicitações de Prova
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'connections' && (
          <section className="tab-content">
            <ConnectionsList apiUrl={apiUrl} />
            <AcceptInvitation apiUrl={apiUrl} />
            <PendingConnections apiUrl={apiUrl} />
          </section>
        )}
        {activeTab === 'offers' && (
          <section className="tab-content">
            <PendingCredentialOffers apiUrl={apiUrl} />
            <PendingStoreCredentials apiUrl={apiUrl} />
            <YourCredentials apiUrl={apiUrl} />
          </section>
        )}
        {activeTab === 'proofs' && (
          <section className="tab-content">
            <ViewProofRequests
              apiUrl={apiUrl}
              onSelectProofRequest={handleSelectProofRequest}
            />
            {selectedProofRequest && (
              <RespondProofRequest
                apiUrl={apiUrl}
                selectedProofRequest={selectedProofRequest}
                onResponseSent={handleResponseSent}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default DashboardResidente;
