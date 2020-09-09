import React from "react";
import styled, { css } from "styled-components";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { rgba } from "polished";

import { useGlobalState } from "../state-context";
import { SET_SELECTED_PROVINCE } from "../state-context/reducer";
import { DESKTOP } from "../utils/breakpoints";

const Container = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem 0.75rem;

  @media (min-width: ${DESKTOP}px) {
    padding: 0.75rem 1rem 1rem;
  }
`;

const Label = styled.label`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const SearchContainer = styled.div`
  position: relative;

  input {
    background-color: ${({ theme }) => theme.colors.white};
    border: 0;
    border-radius: 3rem;
    box-shadow: ${({ theme }) => theme.shadows.surface()};
    height: 2.375rem;
    padding-left: 1.25rem;
    padding-right: 2.5rem;
    width: 100%;
  }

  & > svg {
    pointer-events: none;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const ClearProvince = styled.span`
  align-content: center;
  align-items: center;
  background-color: ${({ theme }) => rgba(theme.colors.silver, 0.5)};
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  border-radius: 2rem;
  color: inherit;
  display: grid;
  grid-template-columns: auto 1.125rem;
  grid-column-gap: 0.75rem;
  left: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: calc(100% - 4.75rem);
  padding: 0.25rem 0.75rem;
  position: absolute;
  top: 0.375rem;
  transition: 250ms;
  z-index: 314160;

  :hover {
    cursor: pointer;
  }

  button {
    align-items: center;
    appearance: none;
    background-color: ${({ theme }) => theme.colors.transparent};
    color: inherit;
    border: 0;
    display: flex;
    padding: 0;

    &:hover {
      cursor: pointer;
    }
  }

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    height: 1.125rem;
    width: 1.125rem;
  }

  ${({ isHidden }) =>
    isHidden &&
    css`
      display: none;
    `}
`;

function Search({ provincesKeys, onChange, value }) {
  const [{ selectedProvince }, dispatch] = useGlobalState();
  const { t } = useTranslation();

  return (
    <Container>
      <Label htmlFor="search">{t("searchProvinces")}</Label>
      <SearchContainer>
        <input
          autoComplete="off"
          id="search"
          disabled={selectedProvince}
          maxLength={32}
          placeholder={selectedProvince ? "" : t("search")}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          value={value}
        />
        <FaSearch aria-hidden="true" />
        <ClearProvince isHidden={!selectedProvince}>
          <span>{provincesKeys[selectedProvince]}</span>
          <button
            onClick={(e) =>
              dispatch({
                type: SET_SELECTED_PROVINCE,
                payload: null,
              })
            }
          >
            <FaTimes aria-hidden="true" aria-label={t("deselectProvince")} />
          </button>
        </ClearProvince>
      </SearchContainer>
    </Container>
  );
}

export default Search;
