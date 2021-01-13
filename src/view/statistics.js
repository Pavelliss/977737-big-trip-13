import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import AbstractView from "./adstract";

const moneyCtx = document.querySelector(`.statistics__chart--money`);
const typeCtx = document.querySelector(`.statistics__chart--transport`);
const timeCtx = document.querySelector(`.statistics__chart--time`);

const BAR_HEIGHT = 55;
moneyCtx.height = BAR_HEIGHT * 5;
typeCtx.height = BAR_HEIGHT * 5;
timeCtx.height = BAR_HEIGHT * 5;

const moneyChart = new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`TAXI`, `BUS`, `TRAIN`, `SHIP`, `TRANSPORT`, `DRIVE`],
    datasets: [{
      data: [400, 300, 200, 160, 150, 100],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`
      }
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

const typeChart = new Chart(typeCtx, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`TAXI`, `BUS`, `TRAIN`, `SHIP`, `TRANSPORT`, `DRIVE`],
    datasets: [{
      data: [4, 3, 2, 1, 1, 1],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TYPE`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
});

const statisticTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

class Statistic extends AbstractView {
  getTemplate() {
    return statisticTemplate();
  }

  removeElement() {
    super.removeElement();
  }
}

export default Statistic;
