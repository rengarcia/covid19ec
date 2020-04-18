import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";

import { useGlobalState } from "../state-context";
import { SET_SELECTED_DATASET } from "../state-context/reducer";
import { DESKTOP } from "../utils/breakpoints";

import ecuadorFlag from "../assets/ecuador.png";
import globe from "../assets/globe.png";

const regions = ["ecuador", "world"];

const Group = styled.div`
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  display: grid;
  grid-template-columns: repeat(2, 50%);
  overflow: hidden;
`;

const Button = styled.button`
  align-items: center;
  appearance: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 0;
  color: inherit;
  display: flex;
  font-size: 1.125rem;
  justify-content: center;
  height: 2.375rem;
  transition: 250ms;
  width: 100%;

  ${({ "aria-pressed": ariaPressed }) =>
    ariaPressed &&
    css`
      background-color: ${({ theme }) => theme.colors.matterhorn};
      box-shadow: inset ${({ theme }) => theme.shadows.deep()};
      color: ${({ theme }) => theme.colors.white};
      font-weight: bold;
      text-shadow: ${({ theme }) => theme.shadows.deep()};
    `}

  img {
    max-width: 1.25rem;
    margin-right: 0.375rem;
  }

  @media (min-width: ${DESKTOP}px) {
    font-size: 1.25rem;
    height: 2.75rem;
  }
`;

function RegionSelector() {
  const [{ selectedDataset }, dispatch] = useGlobalState();
  const { t } = useTranslation();

  return (
    <Group role="group">
      {regions.map((value) => (
        <Button
          aria-pressed={selectedDataset === value}
          onClick={() =>
            dispatch({ type: SET_SELECTED_DATASET, payload: value })
          }
          key={value}
        >
          <img
            src={value === "ecuador" ? ecuadorFlag : globe}
            role="presentation"
          />{" "}
          {t(value)}
        </Button>
      ))}
    </Group>
  );
}

export default RegionSelector;
