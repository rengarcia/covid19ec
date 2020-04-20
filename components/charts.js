import React, { useEffect, useRef } from "react";
import Chartist from "chartist";
import { useTranslation } from "react-i18next";

import { useGlobalState } from "../state-context";

function Charts({
  data: {
    ecuador: { timeline, casesBySex, patientsState, ageGroup },
  },
}) {
  const divAgeGroup = useRef(null);
  const divSexCases = useRef(null);
  const { t } = useTranslation();
  const [{ selectedLanguage }] = useGlobalState();

  useEffect(() => {
    const barData = {
      labels: ageGroup.map((group) =>
        group.group === "0 - 11"
          ? `${group.group} ${t("months")}`
          : `${group.group} ${t("years")}`
      ),
      series: [ageGroup.map((group) => group.confirmed)],
    };

    if (divAgeGroup.current) {
      new Chartist.Bar(divAgeGroup.current, barData);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const pieData = {
      labels: casesBySex.map((sex) => t(sex.sex)),
      series: casesBySex.map((sex) => sex.confirmed),
    };

    if (divSexCases.current) {
      new Chartist.Pie(divSexCases.current, pieData, {
        labelInterpolationFnc(value, index) {
          return (
            console.log(casesBySex[index]) ||
            Math.round(
              (casesBySex[index].confirmed /
                casesBySex.reduce(
                  (acc, current) => acc + current.confirmed,
                  0
                )) *
                100
            ) + "%"
          );
        },
        donut: true,
      });
    }
  }, [selectedLanguage]);

  return (
    <div style={{ width: "22rem" }}>
      <div ref={divAgeGroup} className="ct-chart ct-perfect-fourth" />
      <div ref={divSexCases} className="ct-chart ct-perfect-fourth" />
    </div>
  );
}

export default Charts;
