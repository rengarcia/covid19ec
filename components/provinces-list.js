import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import { useTranslation } from "react-i18next";

import Search from "./search";
import useDebouncedQuery from "../hooks/use-debounced-query";
import useLocationsSearch from "../hooks/use-locations-search";
import { useGlobalState } from "../state-context";
import { SET_QUERY, SET_SELECTED_PROVINCE } from "../state-context/reducer";
import { DESKTOP, WIDE } from "../utils/breakpoints";

const ProvincesContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  margin-top: 0.5rem;
  max-height: 7.125rem;
  overflow-y: auto;
  padding: 0.75rem;

  @media (min-height: 28rem) {
    max-height: 10rem;
  }

  @media (min-height: 32rem) {
    max-height: 18.5rem;
  }

  @media (min-width: ${DESKTOP}px) {
    padding: 1rem;
  }
`;

const Container = styled.section`
  position: fixed;
  left: 1rem;
  max-width: 260px;
  top: 3.75rem;
  width: 100%;

  @media (min-width: ${DESKTOP}px) {
    left: 23rem;
  }

  @media (min-width: ${WIDE}px) {
    max-width: 20rem;
  }
`;

const ProvinceButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 0;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  display: flex;
  justify-content: space-between;
  min-height: 2rem;
  padding: 0.5rem 1rem;
  position: relative;
  transition: 250ms;
  width: 100%;
  z-index: 1;

  :hover {
    box-shadow: ${({ theme }) => theme.shadows.deep()};
    cursor: pointer;
  }

  & + & {
    margin-top: 0.5rem;
  }

  strong {
    font-weight: normal;
    margin-right: 0.75rem;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    margin-right: 0.25rem;
  }
`;

const NoResults = styled.p`
  margin-bottom: 0;
  margin-top: 0;
`;

function Province({ cities, name }) {
  const [_, dispatch] = useGlobalState();
  const cartodbId = cities[0].cartodbId;

  const handleClick = () => {
    dispatch({ type: SET_SELECTED_PROVINCE, payload: cartodbId });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ProvinceButton onClick={handleClick}>
      <strong>{name}</strong>
    </ProvinceButton>
  );
}

function Provinces({ filteredProvinces }) {
  const { t } = useTranslation();
  const provinces = Object.entries(filteredProvinces);

  return provinces.length > 0 ? (
    provinces.map(([province, cities]) => (
      <Province cities={cities} key={province} name={province} />
    ))
  ) : (
    <NoResults role="alert">{t("noResults")}</NoResults>
  );
}

function ProvincesList({ provinces, provincesKeys }) {
  const [{ query }, dispatch] = useGlobalState();
  const debouncedQuery = useDebouncedQuery(query);
  const filteredProvinces = useLocationsSearch(provinces, debouncedQuery);

  return (
    <Container>
      <Search
        provincesKeys={provincesKeys}
        onChange={(payload) => dispatch({ type: SET_QUERY, payload })}
        value={query}
      />
      {query.trim() && (
        <ProvincesContainer>
          <Provinces filteredProvinces={filteredProvinces} />
        </ProvincesContainer>
      )}
    </Container>
  );
}

export default ProvincesList;
