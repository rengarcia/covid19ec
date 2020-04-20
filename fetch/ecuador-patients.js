import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_PATIENTS_URL = `https://api.airtable.com/v0/${airtableDb}/patients_state?api_key=${airtableApikey}`;

async function getEcuadorPatients() {
  const response = await fetch(ECUADOR_PATIENTS_URL);

  return await response.json();
}

const createEcuadorPatients = async (data) => {
  const response = await getEcuadorPatients();
  const patientsState = response.records[0].fields;

  return Object.assign({}, data, {
    patientsState,
  });
};

export default createEcuadorPatients;
