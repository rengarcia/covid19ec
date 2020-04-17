import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import {
  FaBiohazard,
  FaSkullCrossbones,
  FaNotesMedical,
  FaVial,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

import RegionSelector from "./region-selector";
import StatsBlock from "./stats-block";
import { useGlobalState } from "../state-context";
import { DESKTOP } from "../utils/breakpoints";

const DrawerContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  padding: 2rem;
  z-index: 314159;

  @media (max-width: ${DESKTOP - 1}px) {
    border-radius: 1.25rem 1.25rem 0 0;
    left: 0;
    position: absolute;
    transform: translateY(-12rem);
    transition: transform 300ms;
    right: 0;
    top: 100%;
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
  }

  @media (min-width: ${DESKTOP}px) {
    height: 100%;
    position: relative;
    overflow-y: auto;
    z-index: 314158;
  }

  @media (max-width: ${DESKTOP}px) {
    padding-top: 2.5rem;
  }
`;

export const Separator = styled.hr`
  border-color: ${({ theme }) => theme.colors.silver};
  border-style: solid;
  border-width: 0 0 1px;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
`;

function Drawer({ data }) {
  const [{ selectedDataset }] = useGlobalState();
  const { confirmed, deaths, labSamples, recovered } = data[selectedDataset];
  const { t } = useTranslation();

  return (
    <DrawerContainer>
      <RegionSelector />
      <section>
        <StatsBlock
          icon={<FaBiohazard aria-hidden="true" />}
          label={t("confirmed")}
          value={confirmed}
        />
        <StatsBlock
          icon={<FaSkullCrossbones aria-hidden="true" />}
          label={t("deaths")}
          percentage={`${((deaths * 100) / confirmed).toFixed(2)}%`}
          value={deaths}
        />
        <StatsBlock
          icon={<FaNotesMedical aria-hidden="true" />}
          label={t("recovered")}
          percentage={`${((recovered * 100) / confirmed).toFixed(2)}%`}
          value={recovered}
        />
        {selectedDataset === "ecuador" && (
          <StatsBlock
            icon={<FaVial aria-hidden="true" />}
            label={t("labSamples")}
            value={labSamples}
          />
        )}
      </section>
    </DrawerContainer>
  );
}

export default Drawer;
