import React from "react";
import styled from "styled-components";

import createData from "../fetch/create-data";
import Drawer from "../components/drawer";
import Head from "../components/head";
import Header from "../components/header";
import MapGeoJson from "../components/map-geojson";
import stop from "../utils/stop";
import { DESKTOP } from "../utils/breakpoints";

const Container = styled.main`
  height: 100vh;
  margin-top: 2.75rem;
  padding-bottom: 2.75rem;
  position: relative;

  @media (min-width: ${DESKTOP}px) {
    display: grid;
    grid-template-columns: 22rem auto 22rem;
    overflow-y: hidden;
  }
`;

function updateProvinceFeature(feature, confirmedByProvince) {
  const confirmed = confirmedByProvince[feature.properties.dpa_prov] || 0;

  return {
    ...feature,
    properties: {
      ...feature.properties,
      confirmed,
      stop: stop(confirmed),
    },
  };
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
        features: geoJson.features.map((feature) =>
          updateProvinceFeature(feature, confirmedByProvince)
        ),
      },
    },
    world,
  };

  return (
    <>
      <Head />
      <Header lastUpdate={data.ecuador.lastUpdate} />
      <Container>
        <Drawer data={data} />
        <MapGeoJson
          geoJson={data.ecuador.geoJson}
          confirmedByCity={data.ecuador.confirmedByCity}
          provincesKeys={data.ecuador.provincesKey}
        />
      </Container>
    </>
  );
}

Index.getInitialProps = async () => {
  return createData();
};

export default Index;
