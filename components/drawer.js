import React from "react";
import styled from "styled-components";
import { rgba } from "polished";
import {
  FaBiohazard,
  FaSkullCrossbones,
  FaNotesMedical,
  FaVial,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

import Charts from "./charts";
import RegionSelector from "./region-selector";
import StatsBlock from "./stats-block";
import { useGlobalState } from "../state-context";
import { DESKTOP } from "../utils/breakpoints";

const MobileContainer = styled.div`
  @media (min-width: ${DESKTOP}px) {
    display: none;
  }
`;

const DrawerContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  padding: 2.5rem 1.75rem 2rem;
  z-index: 314159;

  @media (max-width: ${DESKTOP - 1}px) {
    border-radius: 1.25rem 1.25rem 0 0;
    left: 0;
    position: absolute;
    transform: translateY(-12rem);
    transition: transform 300ms;
    right: 0;
    top: 100%;
    z-index: 314159;

    ::after {
      background-color: ${({ theme }) => theme.colors.silver};
      border-radius: 3px;
      content: "";
      height: 6px;
      left: 50%;
      position: absolute;
      top: 0.5rem;
      transform: translateX(-50%);
      width: 100px;
    }
  }

  @media (min-width: ${DESKTOP}px) {
    height: 100%;
    padding: 1.75rem;
    position: relative;
    overflow-y: auto;
    z-index: 314158;
  }
`;

export const Separator = styled.hr`
  border-color: ${({ theme }) => theme.colors.silver};
  border-style: solid;
  border-width: 0 0 1px;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
`;

const TableContainer = styled.section`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
  overflow: hidden;

  > div {
    overflow-x: hidden;
  }

  header > div {
    font-weight: bold;
    text-transform: uppercase;
  }

  [role="button"] {
    color: ${({ theme }) => theme.colors.matterhorn};
    font-weight: bold;
  }

  [role="row"] {
    > div:not(:first-of-type) {
      flex-grow: 0;
      min-width: 4rem;
      padding-left: 0;
    }

    > div:first-of-type {
      max-width: calc(100% - 12rem);
    }
  }
`;

function Table({ data }) {
  const { t } = useTranslation();
  const columns = [
    {
      name: t("province"),
      selector: "name",
      sortable: true,
    },
    {
      name: <FaBiohazard title="Confirmados" />,
      selector: "confirmed",
      sortable: true,
      right: true,
    },
    {
      name: <FaSkullCrossbones title="Muertes" />,
      selector: "deaths",
      sortable: true,
      right: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        fontSize: "1rem",
        color: "inherit",
        minHeight: "3rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
      },
    },
    headCells: {
      style: {
        fontSize: "0.875rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
      },
    },
    cells: {
      style: {
        fontSize: "0.875rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
      },
    },
    rows: {
      style: {
        minHeight: "2.25rem",
      },
    },
    headRow: {
      style: {
        minHeight: "2.5rem",
      },
    },
  };

  const tableData = Object.entries(data.ecuador.provinces).map(
    ([key, value]) => {
      const cartodbId = value[0].cartodbId;

      return {
        name: key,
        id: cartodbId,
        confirmed: data.ecuador.confirmedByProvince[cartodbId],
        deaths: data.ecuador.deathsByProvince[cartodbId],
      };
    }
  );

  return (
    <TableContainer>
      <DataTable
        columns={columns}
        customStyles={customStyles}
        data={tableData}
        title={t("casesByProvince")}
      />
    </TableContainer>
  );
}

function Drawer({ data }) {
  const [{ selectedDataset }] = useGlobalState();
  const { confirmed, deaths, labSamples, recovered } = data[selectedDataset];
  const { t } = useTranslation();

  return (
    <DrawerContainer>
      <RegionSelector />
      <section>
        <StatsBlock
          icon={<FaBiohazard aria-hidden="true" />}
          label={t("confirmed")}
          value={confirmed}
        />
        <StatsBlock
          icon={<FaSkullCrossbones aria-hidden="true" />}
          label={t("deaths")}
          percentage={`${((deaths * 100) / confirmed).toFixed(2)}%`}
          value={deaths}
        />
        <StatsBlock
          icon={<FaNotesMedical aria-hidden="true" />}
          label={t("recovered")}
          percentage={`${((recovered * 100) / confirmed).toFixed(2)}%`}
          value={recovered}
        />
        {selectedDataset === "ecuador" && (
          <StatsBlock
            icon={<FaVial aria-hidden="true" />}
            label={t("labSamples")}
            value={labSamples}
          />
        )}
      </section>
      <Separator />
      <Table data={data} />
      <MobileContainer>
        <Separator />
        <Charts data={data} />
      </MobileContainer>
    </DrawerContainer>
  );
}

export default Drawer;
