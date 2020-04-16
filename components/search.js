import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const Label = styled.label`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.375rem;
`;

const SearchContainer = styled.div`
  position: relative;

  input {
    background-color: ${({ theme }) => theme.colors.white};
    border: 0;
    border-radius: 0.5rem;
    box-shadow: ${({ theme }) => theme.shadows.surface()};
    height: 2.375rem;
    padding-left: 1rem;
    padding-right: 2rem;
    width: 100%;
  }

  svg {
    pointer-events: none;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

function Search({ onChange, value }) {
  return (
    <>
      <Label htmlFor="search">Buscar provincias</Label>
      <SearchContainer>
        <input
          autoComplete="off"
          id="search"
          maxLength={32}
          placeholder="Buscar…"
          onChange={(e) => onChange(e.target.value)}
          type="text"
          value={value}
        />
        <FaSearch aria-hidden="true" />
      </SearchContainer>
    </>
  );
}

export default Search;
