import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_SYMPTOMS_URL = `https://api.airtable.com/v0/${airtableDb}/begin_symptoms?api_key=${airtableApikey}`;

async function getEcuadorSymptoms() {
  const response = await fetch(ECUADOR_SYMPTOMS_URL);

  return await response.json();
}

const createEcuadorSymptoms = async (data) => {
  const response = await getEcuadorSymptoms();
  const patientSymptoms = response.records.map((record) => record.fields);

  return Object.assign({}, data, {
    patientSymptoms,
  });
};

export default createEcuadorSymptoms;
