import React, { useEffect } from "react";
import styled from "styled-components";

import { getInitialData } from "../fetch/initial-data";
import Drawer from "../components/drawer";
import Head from "../components/head";
import Header from "../components/header";
import Map from "../components/map";

const Container = styled.main`
  height: 100vh;
  position: relative;
`;

function Index({ ecuador, world }) {
  const data = {
    ecuador: {
      ...ecuador,
      provinces: Object.keys(ecuador.provinces)
        .sort()
        .reduce(
          (acc, key) => ({
            ...acc,
            [key]: ecuador.provinces[key],
          }),
          {}
        ),
    },
    world,
  };

  return (
    <>
      <Head />
      <Container>
        <Header data={data} />
        <Map cities={data.ecuador.cities} />
        <Drawer data={data} />
      </Container>
    </>
  );
}

Index.getInitialProps = async () => {
  return getInitialData();
};

export default Index;
