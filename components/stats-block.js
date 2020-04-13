import React from "react";
import styled from "styled-components";
import { rgba } from "polished";

import formatNumber from "../utils/formatNumber";

const Block = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  display: grid;
  font-size: 1rem;
  grid-template-columns: 1.5rem auto min-content;
  height: 2.375rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;

  :first-of-type {
    margin-top: 0.875rem;
  }

  & + & {
    margin-top: 0.625rem;
  }

  h2 {
    align-items: center;
    font-size: inherit;
    font-weight: normal;
    display: inline-flex;
    margin-bottom: 0;
    margin-top: 0;
  }

  div {
    align-items: center;
    display: inline-flex;
  }

  span {
    background-color: ${({ theme }) => rgba(theme.colors.silver, 0.5)};
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: normal;
    margin-left: 0.5rem;
    padding: 0.125rem 0.375rem;
  }
`;

function StatsBlock({ icon, label, percentage, value }) {
  return (
    <Block>
      {icon}
      <h2>{label}</h2>
      <div>
        {value && <strong>{formatNumber(value)}</strong>}
        {percentage && <span>{percentage}</span>}
      </div>
    </Block>
  );
}

export default StatsBlock;
