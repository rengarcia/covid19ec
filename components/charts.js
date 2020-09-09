import React, { useEffect, useRef } from "react";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import Highcharts from "highcharts";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { useGlobalState } from "../state-context";
import { theme } from "../pages/_app";

const chartStyle = {
  chart: {
    backgroundColor: "transparent",
    spacing: [0, 0, 0, 0],
    height: 428,
  },
};

const Container = styled.div`
  > div:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

function Charts({
  data: {
    ecuador: {
      confirmed: totalConfirmed,
      timeline,
      casesBySex,
      patientsState,
      ageGroup,
      patientSymptoms,
    },
  },
}) {
  const divAgeGroup = useRef(null);
  const divSexCases = useRef(null);
  const divTimelineCases = useRef(null);
  const divPatientsState = useRef(null);
  const divDailyCases = useRef(null);
  const { t } = useTranslation();
  const [{ selectedLanguage }] = useGlobalState();

  useEffect(() => {
    const sortedTimeline = timeline.sort(
      (a, b) => parseISO(a.date) - parseISO(b.date)
    );
    const sortedPatientSymptoms = patientSymptoms.sort(
      (a, b) => parseISO(a.date) - parseISO(b.date)
    );

    if (divAgeGroup.current) {
      Highcharts.chart(divAgeGroup.current, {
        chart: {
          type: "column",
          ...chartStyle.chart,
        },
        title: {
          text: t("casesByAge"),
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          title: {
            text: t("confirmed"),
          },
          labels: {
            formatter() {
              return `${this.value}%`;
            },
          },
          type: "logarithmic",
          minorTickInterval: 0.1,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          headerFormat: "{series.name}<br />",
          pointFormat:
            '<span style="color:{point.color}">{point.name}</span>: <b>{point.confirmed}</b>',
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: "{point.y:.2f}%",
            },
          },
        },
        series: [
          {
            name: t("confirmed"),
            colorByPoint: true,
            data: ageGroup
              .sort((a, b) => (a.confirmed < b.confirmed ? 1 : -1))
              .map(({ group, confirmed }) => ({
                name:
                  group === "0 - 11"
                    ? `${group} ${t("months")}`
                    : `${group} ${t("years")}`,
                y: (confirmed * 100) / totalConfirmed,
                confirmed,
              })),
          },
        ],
        credits: {
          enabled: false,
        },
      });
    }

    if (divSexCases.current) {
      Highcharts.chart(divSexCases.current, {
        ...chartStyle,
        title: {
          text: t("casesBySex"),
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b>",
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -35,
              style: {
                color: theme.colors.matterhorn,
              },
              backgroundColor: theme.colors.white,
            },
            center: ["50%", "50%"],
            size: "90%",
            colors: ["#7cb5ec", "#f15c80"],
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format:
                '<span style="color:{point.color};">{point.name}</span><br>{point.percentage:.2f}%',
            },
          },
        },
        series: [
          {
            type: "pie",
            name: t("cases"),
            innerSize: "50%",
            data: casesBySex.map(({ sex, confirmed }) => ({
              name: t(sex),
              y: confirmed,
              percentage: (confirmed * 100) / totalConfirmed,
            })),
          },
        ],
        credits: {
          enabled: false,
        },
      });
    }

    if (divTimelineCases.current) {
      Highcharts.chart(divTimelineCases.current, {
        ...chartStyle,
        title: {
          text: t("timeline"),
        },
        yAxis: {
          type: "logarithmic",
          min: 1,
          title: {
            text: t("cases"),
          },
        },
        xAxis: {
          tickInterval: 1,
          categories: sortedTimeline.map(({ date }) =>
            format(parseISO(date), "MM-dd")
          ),
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
            },
          },
        },
        legend: {
          itemStyle: {
            fontWeight: "normal",
          },
        },
        tooltip: {
          headerFormat: "<b>{series.name}:</b> {point.y}<br />",
          pointFormat: "{point.date}",
        },
        series: [
          {
            data: sortedTimeline.map((time) => ({
              y: time.confirmed,
              date: time.date,
            })),
            name: t("confirmed"),
          },
          {
            data: sortedTimeline.map((time) => ({
              y: time.deaths,
              date: time.date,
            })),
            name: t("deaths"),
          },
          {
            data: sortedTimeline.map((time) => ({
              y: time.recovered,
              date: time.date,
            })),
            name: t("recovered"),
          },
          {
            data: sortedTimeline.map((time) => ({
              y: time.possibleDeaths,
              date: time.date,
            })),
            name: t("possibleDeaths"),
          },
        ],
        credits: {
          enabled: false,
        },
      });
    }

    if (divPatientsState.current) {
      Highcharts.chart(divPatientsState.current, {
        ...chartStyle,
        title: {
          text: t("patientsState"),
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y}</b>",
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: 20,
            },
            center: ["50%", "50%"],
            size: "80%",
            colors: ["#90ed7d", "#f7a35c", "#8085e9"],
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format:
                '<span style="color:{point.color};">{point.name}</span><br>{point.percentage:.2f}%',
            },
          },
        },
        series: [
          {
            type: "pie",
            name: t("cases"),
            innerSize: "50%",
            data: Object.entries(patientsState).map(([key, value]) => ({
              name: t(key),
              y: value,
              percentage: (value * 100) / totalConfirmed,
            })),
          },
        ],
        credits: {
          enabled: false,
        },
      });
    }

    if (divDailyCases.current) {
      Highcharts.chart(divDailyCases.current, {
        chart: {
          type: "area",
          ...chartStyle.chart,
        },
        title: {
          text: t("dailyCases"),
        },
        xAxis: {
          tickInterval: 1,
          categories: sortedPatientSymptoms.map(({ date }) =>
            format(parseISO(date), "MM-dd")
          ),
        },
        yAxis: {
          title: {
            text: t("cases"),
          },
          labels: {
            formatter() {
              return this.value >= 1000 ? `${this.value / 1000}k` : this.value;
            },
          },
        },
        tooltip: {
          headerFormat: `<b>${t("cases")}:</b> {point.y}<br />`,
          pointFormat: "{point.date}",
        },
        plotOptions: {
          area: {
            marker: {
              enabled: false,
            },
            color: "#91e8e1",
          },
        },
        series: [
          {
            name: t("dailyCases"),
            data: sortedPatientSymptoms.map((record) => record.count),
          },
        ],
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
      });
    }
  }, [selectedLanguage]);

  return (
    <Container>
      <div ref={divTimelineCases} />
      <div ref={divSexCases} />
      <div ref={divAgeGroup} />
      <div ref={divPatientsState} />
      <div ref={divDailyCases} />
    </Container>
  );
}

export default Charts;
