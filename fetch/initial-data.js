import fetch from "isomorphic-unfetch";
import getConfig from "next/config";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_CITIES_URL = `https://api.airtable.com/v0/${airtableDb}/cities?api_key=${airtableApikey}`;
const ECUADOR_DATA_URL = `https://api.airtable.com/v0/${airtableDb}/other_data?api_key=${airtableApikey}`;
const WORLD_URL = "https://covid19.mathdro.id/api";

export async function getInitialData() {
  const ecuadorCities = [];
  let ecuadorData = null;
  let worldData = null;

  async function getWorldData() {
    const response = await fetch(WORLD_URL);

    return await response.json();
  }

  async function getEcuadorData() {
    const response = await fetch(ECUADOR_DATA_URL);

    return await response.json();
  }

  async function getEcuadorCities(offset) {
    const response = await fetch(
      `${ECUADOR_CITIES_URL}${offset ? `&offset=${offset}` : ""}`
    );

    return await response.json();
  }

  async function* generateEcuadorCities() {
    let newOffset = "";
    do {
      const { records, offset } = await getEcuadorCities(newOffset);
      newOffset = offset;
      yield records.map(record => record.fields);
    } while (newOffset);
  }

  try {

    for await (const cities of generateEcuadorCities()) {
      ecuadorCities.push(...cities);
    }

    await getEcuadorData().then(
      (response) => (ecuadorData = response.records[0].fields)
    );

    await getWorldData().then((response) => (worldData = response));
  } catch (error) {
    console.error(error);
  }

  return {
    ecuador: {
      provinces: ecuadorCities
        .sort((a, b) => (a.confirmed < b.confirmed ? 1 : -1))
        .reduce((acc, item) => {
          if (!acc[item.province]) {
            acc[item.province] = [];
          }

          acc[item.province].push(item);

          return acc;
        }, {}),
      cities: ecuadorCities,
      confirmed: ecuadorCities
        .map(({ confirmed }) => confirmed)
        .reduce((acc, current) => acc + current),
      deaths: ecuadorData.deaths,
      labSamples: ecuadorData.lab_samples,
      recovered: ecuadorData.recovered,
      lastUpdate: ecuadorData.last_update,
    },
    world: {
      confirmed: worldData.confirmed.value,
      recovered: worldData.recovered.value,
      deaths: worldData.deaths.value,
    },
  };
}
