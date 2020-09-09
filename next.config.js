const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = withFonts(
  withImages({
    serverRuntimeConfig: {
      airtableDb: process.env.AIRTABLE_DB,
      airtableApikey: process.env.AIRTABLE_APIKEY,
    },
    publicRuntimeConfig: {
      mapboxToken: process.env.MAPBOX_TOKEN,
      mapStyle: process.env.MAP_STYLE,
    },
  })
);
