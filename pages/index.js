import React from "react";
import styled from "styled-components";

import createData from "../fetch/create-data";
import Drawer from "../components/drawer";
import Head from "../components/head";
import Header from "../components/header";
import MapGeoJson from "../components/map-geojson";

const Container = styled.main`
  height: 100vh;
  position: relative;
`;

// TODO: move this fn to utils
function mapStop(confirmed = 0) {
  if (confirmed <= 10) {
    return 0;
  }
  if (confirmed > 10 && confirmed <= 50) {
    return 1;
  }
  if (confirmed > 50 && confirmed <= 200) {
    return 2;
  }
  if (confirmed > 200 && confirmed <= 700) {
    return 3;
  }
  if (confirmed > 700) {
    return 4;
  }
}

function Index({ ecuador, world }) {
  const { provinces, confirmedByProvince, geoJson } = ecuador;

  const data = {
    ecuador: {
      ...ecuador,
      provinces: Object.keys(provinces)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: provinces[key],
          }),
          {}
        ),
      geoJson: {
        type: "FeatureCollection",
        features: geoJson.features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            stop: mapStop(confirmedByProvince[feature.properties.cartodb_id]),
          },
        })),
      },
    },
    world,
  };

  return (
    <>
      <Head />
      <Container>
        <Header lastUpdate={data.ecuador.lastUpdate} />
        <MapGeoJson geoJson={data.ecuador.geoJson} />
        <Drawer data={data} />
      </Container>
    </>
  );
}

Index.getInitialProps = async () => {
  return createData();
};

export default Index;
