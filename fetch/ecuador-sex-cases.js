import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_SEX_CASES_URL = `https://api.airtable.com/v0/${airtableDb}/sex_cases?api_key=${airtableApikey}`;

async function getEcuadorSexCases() {
  const response = await fetch(ECUADOR_SEX_CASES_URL);

  return await response.json();
}

const createEcuadorSexCases = async (data) => {
  const response = await getEcuadorSexCases();
  const casesBySex = response.records.map((record) => record.fields);

  return Object.assign({}, data, {
    casesBySex,
  });
};

export default createEcuadorSexCases;
