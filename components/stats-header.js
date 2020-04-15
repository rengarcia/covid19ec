import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import {
  FaBiohazard,
  FaSkullCrossbones,
  FaNotesMedical,
} from "react-icons/fa";

import StatsBlock from "./stats-block";
import { useGlobalState } from "../state-context";
import { DESKTOP } from "../utils/breakpoints";

const Container = styled.section`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  border-top: 1px solid ${({ theme }) => theme.colors.silver};
  height: 5.25rem;
  left: 0;
  padding: 0.75rem 1rem;
  position: fixed;
  right: 0;
  top: 2.75rem;
  z-index: 314159;
`;

const StatsContainer = styled.section`
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
`;

function StatsHeader({ data }) {
  const [{ selectedDataset }] = useGlobalState();
  const { confirmed, deaths, recovered } = data[selectedDataset];

  return (
    <Container>
      <StatsContainer>
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
      </StatsContainer>
    </Container>
  );
}

export default StatsHeader;
