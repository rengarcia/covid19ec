import React from "react";
import styled from "styled-components";
import { rgba } from "polished";

import Charts from "../components/charts";
import { DESKTOP } from "../utils/breakpoints";

const DrawerContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  padding: 1.75rem 1.5rem 2rem;
  overflow-y: auto;

  @media (max-width: ${DESKTOP - 1}px) {
    display: none;
  }
`;

function DrawerStats({ data }) {
  return (
    <DrawerContainer>
      <Charts data={data} />
    </DrawerContainer>
  );
}

export default DrawerStats;
