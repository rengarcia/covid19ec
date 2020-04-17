import React from "react";
import styled from "styled-components";
import { rgba } from "polished";

import formatNumber from "../utils/formatNumber";
import { DESKTOP } from "../utils/breakpoints";

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

  :first-of-type {
    margin-top: 0.875rem;
  }

  & + & {
    margin-top: 0.625rem;
  }

  @media (min-width: ${DESKTOP}px) {
    align-content: center;
    flex-grow: 1;
    grid-template-columns: 3rem auto;
    grid-column-gap: 0.25rem;
    grid-template-rows: auto 1.75rem;
    height: auto;
    justify-items: center;
    padding: 0.5rem;
    text-align: center;
    width: 100%;

    :first-of-type {
      margin-top: 1rem;
    }

    & + & {
      margin-top: 0.75rem;
    }

    &:not(:last-of-type) {
      margin-right: 0.75rem;
    }

    h2 {
      font-weight: bold;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.5rem;
    }

    span {
      font-size: 1.125rem;
    }

    svg {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      height: 1.75rem;
      width: 1.75rem;
    }
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
