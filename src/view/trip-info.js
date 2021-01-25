import dayjs from "dayjs";
import AbstractView from "./adstract";

const calcSumMoney = (points) => {
  const reduce = points.reduce((accum, point) => {
    const sumOffers = point.offers.reduce((accumOffer, offer) => {
      return accumOffer + offer.price;
    }, 0);
    return accum + point.price + sumOffers;
  }, 0);

  return reduce;
};

const getCities = (cities) => {
  return cities.reduce((acum, city) => {
    return `${acum} - ${city}`;
  });
};

const getTravelRoute = (points) => {
  const cities = points.map((point) => point.city);
  const firstCity = cities[0];
  const lastCity = cities[cities.length - 1];

  if (cities.length > 3) {
    return `${firstCity} ... - ... ${lastCity}`;
  } else if (cities.length <= 3 && cities.length > 0) {
    return getCities(cities);
  }
  return ``;
};

const getStartEndDate = (points) => {
  const startDate = points[points.length - 1].time.end;
  const endDate = points[0].time.start;

  return {
    start: dayjs(startDate).format(`MMM D`),
    end: dayjs(endDate).format(`MMM D`),
  };
};

const getTripInfo = (points) => {
  return {
    sumMoney: calcSumMoney(points),
    TravelRoute: getTravelRoute(points),
    time: getStartEndDate(points)
  };
};

const createTripInfoTemplate = (filtredPoints) => {
  const tripInfo = getTripInfo(filtredPoints);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfo.TravelRoute}</h1>

      <p class="trip-info__dates">${tripInfo.time.start}&nbsp;&mdash;&nbsp;${tripInfo.time.end}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfo.sumMoney}</span>
    </p>
  </section>`;
};

class TripInfo extends AbstractView {
  constructor(filtredPoints) {
    super();

    this._filtredPoints = filtredPoints;
  }

  getTemplate() {
    return createTripInfoTemplate(this._filtredPoints);
  }
}

export default TripInfo;
