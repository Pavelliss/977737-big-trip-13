import Chart from "chart.js";
import dayjs from "dayjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SmartView from "./smart";
import {HOURS_IN_DAY} from "../const";


const renderCharts = (element, data) => {
  const moneyCtx = element.querySelector(`.statistics__chart--money`);
  const typeCtx = element.querySelector(`.statistics__chart--transport`);
  const timeCtx = element.querySelector(`.statistics__chart--time`);

  const BAR_HEIGHT = 80;
  moneyCtx.height = BAR_HEIGHT * 5;
  typeCtx.height = BAR_HEIGHT * 5;
  timeCtx.height = BAR_HEIGHT * 5;

  const routeTypes = Array.from(data.keys()).map((type) => type.toUpperCase());
  const moneyTypes = Array.from(data.values()).map((point) => point.price);
  const typesCount = Array.from(data.values()).map((point) => point.count);
  const timeSpend = Array.from(data.values()).map((point) => point.timeSpend);

  renderMoneyChart(moneyCtx, routeTypes, moneyTypes);
  renderTypeChart(typeCtx, routeTypes, typesCount);
  renderTimeSpendChart(timeCtx, routeTypes, timeSpend);
};

const renderMoneyChart = (moneyCtx, routeTypes, moneyTypes) => {
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routeTypes,
      datasets: [{
        data: moneyTypes,
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
};

const renderTypeChart = (typeCtx, routeTypes, typesCount) => {
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routeTypes,
      datasets: [{
        data: typesCount,
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
};

const formatedTime = (time) => {
  let remainder = time % 24;
  if (time < HOURS_IN_DAY) {
    return `${time}H`;
  } else if (remainder === 0) {
    return `${Math.floor(time / HOURS_IN_DAY)}D`;
  }

  return `${Math.floor(time / HOURS_IN_DAY)}D ${remainder}H`;
};

const renderTimeSpendChart = (timeCtx, routeTypes, timeSpend) => {
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: routeTypes,
      datasets: [{
        data: timeSpend,
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
          formatter: (val) => formatedTime(val)
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
};

const calcStatisticData = (data) => {
  const map = new Map();
  let statistic = {};

  data.forEach((point) => {
    if (map.has(point.routeType)) {
      statistic = {
        price: map.get(point.routeType).price + point.price,
        count: map.get(point.routeType).count + 1,
        timeSpend: map.get(point.routeType).timeSpend + (dayjs(point.time.end).diff(point.time.start, `hours`)),
      };

      map.set(point.routeType, statistic);
    } else {
      statistic = {
        price: point.price,
        count: 1,
        timeSpend: dayjs(point.time.end).diff(point.time.start, `hours`),
      };
      map.set(point.routeType, statistic);
    }
  });

  return map;
};

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

class Statistic extends SmartView {
  constructor(points) {
    super();

    this._data = calcStatisticData(points);

    renderCharts(this.getElement(), this._data);
  }

  getTemplate() {
    return statisticTemplate();
  }

  removeElement() {
    super.removeElement();
  }
}

export default Statistic;
