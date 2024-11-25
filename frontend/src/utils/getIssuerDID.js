// src/utils/getIssuerDID.js
import axios from 'axios';

export async function getIssuerDID(apiUrl) {
  try {
    const response = await axios.get(`${apiUrl}/wallet/did/public`);
    return response.data.result.did; // Retorna apenas a string do DID
  } catch (error) {
    console.error('Erro ao obter o issuer DID:', error);
    throw error;
  }
}
