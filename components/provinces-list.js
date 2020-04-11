import React, { useState } from "react";
import styled, { css } from "styled-components";
import { FaCaretDown } from "react-icons/fa";

import Search from "./search";
import useDebouncedQuery from "../hooks/use-debounced-query";
import useProvincesSearch from "../hooks/use-provinces-search";
import { useGlobalState } from "../state-context";
import { SET_SELECTED_CITY } from "../state-context/reducer";
import { DESKTOP } from "../utils/breakpoints";

const ProvinceButton = styled.button`
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
  }

  strong:last-child {
    align-items: center;
    display: flex;

    svg {
      ${({ "aria-expanded": ariaExpanded }) =>
        ariaExpanded &&
        css`
          transform: scaleY(-1);
        `}
      margin-left: 0.5rem;
      transition: transform 300ms;
    }
  }
`;

const CitiesList = styled.ul`
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  border-radius: 0 0 0.5rem 0.5rem;
  list-style: none;
  margin: 0 0.5rem 0.625rem;
  padding: 0.25rem 0.875rem;

  button {
    appearance: none;
    background-color: ${({ theme }) => theme.colors.white};
    border: 0;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    width: 100%;
  }

  li + li {
    border-top: 1px solid ${({ theme }) => theme.colors.silver};
  }

  strong {
    font-weight: normal;
  }

  @media (max-width: ${DESKTOP}px) {
    button {
      pointer-events: none;
    }
  }
`;

const NoResults = styled.p`
  margin-bottom: 0;
  margin-top: 0.875rem;
`;

function Province({ cities, name }) {
  const [{ selectedCity }, dispatch] = useGlobalState();
  const [isOpen, setIsOpen] = useState(false);
  const citiesListId = `${name}-cities`;
  const confirmedByProvince = cities
    .map(({ confirmed }) => confirmed)
    .reduce((acc, current) => acc + current, 0);

  return (
    <>
      <ProvinceButton
        aria-expanded={isOpen}
        aria-controls={citiesListId}
        onClick={() => setIsOpen(!isOpen)}
      >
        <strong>{name}</strong>
        <strong>
          {new Intl.NumberFormat("es-EC").format(confirmedByProvince)}
          <FaCaretDown aria-hidden="true" />
        </strong>
      </ProvinceButton>
      {isOpen && (
        <CitiesList id={citiesListId}>
          {cities.map((city) => (
            <li key={city.id}>
              <button
                onClick={() =>
                  dispatch({
                    type: SET_SELECTED_CITY,
                    payload: selectedCity === city ? null : city,
                  })
                }
              >
                <strong>{city.city}</strong>
                <strong>{city.confirmed}</strong>
              </button>
            </li>
          ))}
        </CitiesList>
      )}
    </>
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
  const filteredProvinces = useProvincesSearch(provinces, debouncedQuery);

  return (
    <>
      <Search onChange={setQuery} value={query} />
      <Provinces filteredProvinces={filteredProvinces} />
    </>
  );
}

export default ProvincesList;
