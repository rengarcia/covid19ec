import React, { useState } from "react";
import styled from "styled-components";

import Search from "./search";
import useDebouncedQuery from "../hooks/use-debounced-query";
import useLocationsSearch from "../hooks/use-locations-search";
import formatNumber from "../utils/formatNumber";
import { useGlobalState } from "../state-context";
import { SET_SELECTED_PROVINCE } from "../state-context/reducer";

const ProvinceButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: ${({ theme }) => theme.colors.white};
  border: 0;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  display: flex;
  justify-content: space-between;
  height: 2.375rem;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  width: 100%;
  z-index: 1;

  :hover {
    cursor: pointer;
  }

  :first-of-type {
    margin-top: 0.875rem;
  }

  & + & {
    margin-top: 0.625rem;
  }

  strong:first-child {
    font-weight: normal;
    text-align: left;
  }

  strong:last-child {
    align-items: center;
    display: flex;
  }
`;

const NoResults = styled.p`
  margin-bottom: 0;
  margin-top: 0.875rem;
`;

function Province({ cities, name }) {
  const [_, dispatch] = useGlobalState();
  const cartodbId = cities[0].cartodbId;
  const confirmedByProvince = cities
    .map(({ confirmed }) => confirmed)
    .reduce((acc, current) => acc + current, 0);

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
      <strong>{formatNumber(confirmedByProvince)}</strong>
    </ProvinceButton>
  );
}

function Provinces({ filteredProvinces }) {
  const provinces = Object.entries(filteredProvinces);

  return provinces.length > 0 ? (
    provinces.map(([province, cities]) => (
      <Province cities={cities} key={province} name={province} />
    ))
  ) : (
    <NoResults role="alert">No se encontraron resultados</NoResults>
  );
}

function ProvincesList({ provinces }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedQuery(query);
  const filteredProvinces = useLocationsSearch(provinces, debouncedQuery);

  return (
    <>
      <Search onChange={setQuery} value={query} />
      <Provinces filteredProvinces={filteredProvinces} />
    </>
  );
}

export default ProvincesList;
