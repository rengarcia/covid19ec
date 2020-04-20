import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_AGE_GROUP_URL = `https://api.airtable.com/v0/${airtableDb}/age_group?api_key=${airtableApikey}`;

async function getEcuadorAgeGroup() {
  const response = await fetch(ECUADOR_AGE_GROUP_URL);

  return await response.json();
}

const createEcuadorAgeGroup = async (data) => {
  const response = await getEcuadorAgeGroup();
  const ageGroup = response.records.map((record) => record.fields);

  return Object.assign({}, data, {
    ageGroup,
  });
};

export default createEcuadorAgeGroup;
