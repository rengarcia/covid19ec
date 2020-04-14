import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import {
  FaBiohazard,
  FaSkullCrossbones,
  FaNotesMedical,
} from "react-icons/fa";

import RegionSelector from "./region-selector";
import ProvincesList from "./provinces-list";
import StatsBlock from "./stats-block";
import { useGlobalState } from "../state-context";

const DrawerContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  left: 0;
  padding: 2rem;
  position: absolute;
  top: 100%;
  transform: translateY(-13.75rem);
  transition: transform 300ms;
  right: 0;
  z-index: 314159;

  ::after {
    background-color: ${({ theme }) => theme.colors.silver};
    border-radius: 3px;
    content: "";
    height: 6px;
    left: 50%;
    position: absolute;
    top: 0.5rem;
    transform: translateX(-50%);
    width: 100px;
  }
`;

const Separator = styled.hr`
  border-color: ${({ theme }) => theme.colors.silver};
  border-style: solid;
  border-width: 0 0 1px;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
`;

function Drawer({ data }) {
  const [{ selectedDataset }] = useGlobalState();
  const { confirmed, deaths, recovered } = data[selectedDataset];

  return (
    <DrawerContainer>
      {/* <RegionSelector /> */}
      <section>
        <StatsBlock
          icon={<FaBiohazard aria-hidden="true" />}
          label="Casos confirmados"
          value={confirmed}
        />
        <StatsBlock
          icon={<FaSkullCrossbones aria-hidden="true" />}
          label="Fallecidos"
          percentage={`${((deaths * 100) / confirmed).toFixed(2)}%`}
          value={deaths}
        />
        <StatsBlock
          icon={<FaNotesMedical aria-hidden="true" />}
          label="Recuperados"
          percentage={`${((recovered * 100) / confirmed).toFixed(2)}%`}
          value={recovered}
        />
      </section>
      <Separator aria-orientation="horizontal" role="separator" />
      <section>
        <ProvincesList provinces={data.ecuador.provinces} />
      </section>
    </DrawerContainer>
  );
}

export default Drawer;
