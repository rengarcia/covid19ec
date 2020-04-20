import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { rgba } from "polished";
import Chart from "chart.js";

const DrawerContainer = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.whitesmoke, 0.8)};
  backdrop-filter: blur(0.5rem);
  box-shadow: ${({ theme }) => theme.shadows.surface(true)};
  padding: 1.75rem;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.gray};
  font-size: 1rem;
  margin-bottom: 2rem;
  margin-top: 0;
  text-align: center;
  text-transform: uppercase;
`;

function DrawerStats({ data }) {
  const canvasRef = useRef(null);
  const canvasRef2 = useRef(null);

  useEffect(
    () => {
      const canvasElement = canvasRef.current;
      const ctx = canvasElement.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          datasets: [
            {
              label: "Estables en casa",
              data: [6335],
              barThickness: 40,
              maxBarThickness: 60,
              backgroundColor: "hsla(98, 72%, 48%, 1.0)",
            },
            {
              label: "Hospitalizados",
              barThickness: 40,
              maxBarThickness: 60,
              data: [220],
              backgroundColor: "hsla(271, 72%, 48%, 1.0)",
            },
            {
              label: "Cuidados Intensivos",
              barThickness: 40,
              maxBarThickness: 60,
              data: [135],
              backgroundColor: "hsla(163, 72%, 48%, 1.0)",
            },
          ],
          labels: ["Estables en casa", "Hospitalizados", "Cuidados Intensivos"],
        },
        options: {
          scales: {
            yAxes: [
              {
                type: "logarithmic",
                position: "left",
                gridLines: {
                  offset: true,
                },
                ticks: {
                  callback: function (value, index, values) {
                    return value;
                  },
                },
              },
            ],
          },
        },
      });
    },

    useEffect(() => {
      const canvasElement = canvasRef2.current;
      const ctx = canvasElement.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [2107, 4979, 1108, 105],
            },
          ],
          labels: ["De 50 a 64", "De 20 a 49", "+65", "De 15 a 19"],
        },
        options: {
          animation: {
            animateRotate: true,
          },
        },
      });
    })
  );

  return (
    <DrawerContainer>
      <Title>Stats</Title>
      <canvas width="400" height="565" ref={canvasRef} />
      <canvas width="400" height="380" ref={canvasRef2} />
    </DrawerContainer>
  );
}

export default DrawerStats;
