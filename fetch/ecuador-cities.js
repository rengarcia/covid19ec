import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

const {
  serverRuntimeConfig: { airtableDb, airtableApikey },
} = getConfig();

const ECUADOR_CITIES_URL = `https://api.airtable.com/v0/${airtableDb}/cities?api_key=${airtableApikey}`;

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
    yield records.map((record) => record.fields);
  } while (newOffset);
}

const createEcuadorCities = async (data) => {
  const ecuadorCities = [];

  for await (const cities of generateEcuadorCities()) {
    ecuadorCities.push(...cities);
  }

  const provinces = ecuadorCities
    .sort((a, b) => (a.confirmed < b.confirmed ? 1 : -1))
    .reduce((acc, item) => {
      if (!acc[item.province]) {
        acc[item.province] = [];
      }

      acc[item.province].push(item);

      return acc;
    }, {});

  const confirmed = ecuadorCities
    .map(({ confirmed }) => confirmed)
    .reduce((acc, current) => acc + current);

  const confirmedByProvince = ecuadorCities.reduce((acc, item) => {
    if (!acc[item.cartodbId]) {
      acc[item.cartodbId] = 0;
    }
    acc[item.cartodbId] += item.confirmed || 0;
    return acc;
  }, {});

  const confirmedByCity = ecuadorCities.reduce((acc, item) => {
    acc[item.cantonId] = item.confirmed || 0;
    return acc;
  }, {});

  const provincesKey = uniqWith(
    ecuadorCities.map(({ cartodbId, province }) => [cartodbId, province]),
    isEqual
  ).reduce((acc, [key, label]) => {
    acc[key] = label;

    return acc;
  }, {});

  return Object.assign({}, data, {
    provinces,
    cities: ecuadorCities,
    confirmed,
    confirmedByProvince,
    confirmedByCity,
    provincesKey,
  });
};

export default createEcuadorCities;
