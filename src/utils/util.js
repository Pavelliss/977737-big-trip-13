import dayjs from "dayjs";

const makeСapitalizedLetter = (word) => {
  if (word === ``) {
    return ``;
  }
  return word[0].toUpperCase() + word.substring(1);
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

const sortPointDay = (a, b) => (dayjs(a.time.start).isAfter(dayjs(b.time.start)) ? -1 : 1);

const sortPointPrice = (pointA, pointB) => pointA.price - pointB.price;

const sortPointTime = (pointA, pointB) => {
  const diffA = dayjs(pointA.time.end).diff(pointA.time.start);
  const diffB = dayjs(pointB.time.end).diff(pointB.time.start);

  return diffA - diffB;
};

const getMapOffers = (offerTypes) => {
  const map = new Map();
  offerTypes.forEach((type) => {
    type.offers.forEach((offer) => {
      map.set(offer.title, offer);
    });
  });

  return map;
};

export {
  makeСapitalizedLetter,
  updateItem,
  sortPointDay,
  sortPointPrice,
  sortPointTime,
  getMapOffers,
};
