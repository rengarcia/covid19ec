import React, { forwardRef, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { rgba } from "polished";
import { FaCaretDown, FaInfoCircle, FaShareAlt } from "react-icons/fa";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useTranslation } from "react-i18next";

import { DESKTOP } from "../utils/breakpoints";
import { useGlobalState } from "../state-context";
import useClickOutside from "../hooks/use-click-outside";
import { SET_SELECTED_LANGUAGE } from "../state-context/reducer";
import i18n from "../i18n";
import ecuadorFlag from "../assets/ecuador.png";
import usaFlag from "../assets/usa.png";

const languages = [
  {
    label: "ES",
    value: "es",
  },
  {
    label: "EN",
    value: "en",
  },
];

const Header = styled.header`
  align-items: center;
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  display: flex;
  height: 2.75rem;
  justify-content: space-between;
  left: 0;
  padding-left: 1rem;
  padding-right: 1rem;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 314159;
`;

const Heading = styled.h1`
  font-size: 1.125rem;
  margin-bottom: 0;
  margin-top: 0;
  text-transform: uppercase;

  @media (min-width: ${DESKTOP}px) {
    font-size: 1.375rem;
  }
`;

const Actions = styled.div`
  align-items: center;
  display: flex;
`;

const ActionButton = styled.button`
  align-items: center;
  appearance: none;
  background-color: ${({ theme }) => theme.colors.transparent};
  border: 0;
  color: inherit;
  display: flex;
  justify-content: center;
  padding: 0.25rem;

  & + & {
    margin-left: 0.125rem;
  }

  :first-of-type {
    margin-left: 0.25rem;
  }

  :last-of-type {
    margin-right: -0.25rem;
  }

  svg {
    fill: currentColor;
  }

  @media (min-width: ${DESKTOP}px) {
    & + & {
      margin-left: 0.5rem;
    }

    :first-of-type {
      display: none;
    }
  }
`;

const LanguageSelect = styled.div`
  position: relative;

  select {
    appearance: none;
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.surface()};
    border: 0;
    border-radius: 0.5rem;
    color: inherit;
    font-size: 1rem;
    font-weight: bold;
    height: 1.75rem;
    padding-left: 2.25rem;
    padding-right: 1.5rem;

    :hover {
      cursor: pointer;
    }
  }

  svg,
  img {
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  svg {
    right: 0.5rem;
  }

  img {
    left: 0.5rem;
    max-width: 1.25rem;
  }

  @media (min-width: ${DESKTOP}px) {
    select {
      padding-left: 2.5rem;
      padding-right: 1.75rem;
    }

    svg {
      right: 0.75rem;
    }

    img {
      left: 0.75rem;
    }
  }
`;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.surface()};
  padding: 0.5rem 1rem;
  position: absolute;
  opacity: 0;
  transition: 250ms;
  top: 2.75rem;
  right: 0.75rem;
  visibility: hidden;
  z-index: 314160;

  ::after {
    border-style: solid;
    border-width: 0 0.5rem 0.875rem;
    border-color: transparent transparent ${({ theme }) => theme.colors.white};
    content: "";
    height: 0;
    position: absolute;
    top: 0;
    right: 0.375rem;
    transform: translateY(calc(-100% + 2px));
    width: 0;
  }

  p {
    font-size: 0.875rem;
    margin-bottom: 0;
    margin-top: 0;
  }

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
      visibility: visible;
    `};
`;

const InfoTooltip = forwardRef(({ isVisible, updatedAt }, ref) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      isVisible={isVisible}
      ref={ref}
      {...(isVisible && { role: "alert" })}
    >
      <p>
        {t("lastUpdate")}: {updatedAt}
      </p>
    </Tooltip>
  );
});

function LanguageSelector() {
  const [{ selectedLanguage }, dispatch] = useGlobalState();

  return (
    <LanguageSelect>
      <img src={selectedLanguage === "es" ? ecuadorFlag : usaFlag} />
      <select
        onChange={(e) => {
          dispatch({ type: SET_SELECTED_LANGUAGE, payload: e.target.value });
          i18n.changeLanguage(e.target.value);
        }}
        value={selectedLanguage}
      >
        {languages.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <FaCaretDown aria-hidden="true" />
    </LanguageSelect>
  );
}

function AppHeader({ lastUpdate }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [{ selectedLanguage }] = useGlobalState();
  const tooltipRef = useRef(null);
  const { t } = useTranslation();

  useClickOutside(tooltipRef, () => {
    if (showTooltip) {
      setShowTooltip(false);
    }
  });

  async function sharePage() {
    try {
      await navigator.share({
        title: "Covid-19 Ecuador",
        text:
          selectedLanguage === "es"
            ? "Información actualizada de los casos de COVID-19 en Ecuador"
            : "Updated information on COVID-19 cases in Ecuador",
        url: "https://covid19-ecuador.com",
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Header>
      <Heading>Covid-19 Ecuador</Heading>
      <Actions>
        <LanguageSelector />
        <ActionButton onClick={sharePage}>
          <FaShareAlt aria-label={t("share")} size="1.25rem" />
        </ActionButton>
        <ActionButton onClick={() => setShowTooltip(!showTooltip)}>
          <FaInfoCircle aria-label={t("moreInfo")} size="1.25rem" />
        </ActionButton>
      </Actions>
      <InfoTooltip
        isVisible={showTooltip}
        ref={tooltipRef}
        updatedAt={format(parseISO(lastUpdate), "yyyy-MM-dd HH:mm")}
      />
    </Header>
  );
}

export default AppHeader;
