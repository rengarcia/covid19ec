import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_TIMELINE_URL = `https://api.airtable.com/v0/${airtableDb}/cases_data?api_key=${airtableApikey}`;

async function getEcuadorTimeline() {
  const response = await fetch(ECUADOR_TIMELINE_URL);

  return await response.json();
}

const createEcuadorTimeline = async (data) => {
  const response = await getEcuadorTimeline();
  const timeline = response.records.map((record) => record.fields);

  return Object.assign({}, data, {
    timeline,
  });
};

export default createEcuadorTimeline;
