import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_DATA_URL = `https://api.airtable.com/v0/${airtableDb}/other_data?api_key=${airtableApikey}`;

async function getEcuadorData() {
  const response = await fetch(ECUADOR_DATA_URL);

  return await response.json();
}

const createEcuadorData = async (data) => {
  const response = await getEcuadorData();
  const stats = response.records[0].fields;

  return Object.assign({}, data, {
    deaths: stats.deaths,
    labSamples: stats.lab_samples,
    recovered: stats.recovered,
    epidemiologyDischarge: stats.epidemiology_discharge,
    lastUpdate: stats.last_update,
    possibleDeaths: stats.possible_deaths,
  });
};

export default createEcuadorData;
