import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_DEATHS_PROVINCES = `https://api.airtable.com/v0/${airtableDb}/deaths_by_province?api_key=${airtableApikey}`;

async function getEcuadorData() {
  const response = await fetch(ECUADOR_DEATHS_PROVINCES);

  return await response.json();
}

const createDeathsProvincesData = async (data) => {
  const response = await getEcuadorData();
  const stats = response.records;

  return Object.assign({}, data, {
    deathsByProvince: stats
      .map(({ fields: { cartodbId, numberOfDeaths } }) => ({
        cartodbId,
        numberOfDeaths,
      }))
      .reduce((acc, item) => {
        if (!acc[item.cartodbId]) {
          acc[item.cartodbId] = 0;
        }

        acc[item.cartodbId] += item.numberOfDeaths || 0;

        return acc;
      }, {}),
  });
};

export default createDeathsProvincesData;
