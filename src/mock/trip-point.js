import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {getRandomListElement, getRandomInteger} from "./util";
import {routeTypes} from "../const";

const CITIES = [`Copenhagen`, `Bern`, `Geneva`, `Stavanger`, `Dublin`, `Stockholm`, `Munich`, `Vienna`];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const OFFERS = [
  {
    id: nanoid(),
    name: `Rent a car`,
    price: 200,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Add breakfast`,
    price: 50,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Book tickets`,
    price: 40,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Lunch in city`,
    price: 30,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Add luggage`,
    price: 30,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Switch to comfort class`,
    price: 100,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Add meal`,
    price: 15,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Choose seats`,
    price: 5,
    isChecked: !getRandomInteger(0, 1)
  },
  {
    id: nanoid(),
    name: `Travel by train`,
    price: 50,
    isChecked: !getRandomInteger(0, 1)
  },
];

const generateDestination = () => {
  const destinationMap = new Map();
  let photoCity = null;
  let descriptionCity = null;

  CITIES.forEach((cityDestination, index) => {
    const isPhotos = !getRandomInteger(0, 1);
    const isDescription = !getRandomInteger(0, 1);

    if (isPhotos) {
      photoCity = [
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`
      ];
    }

    if (isDescription) {
      descriptionCity = DESCRIPTIONS[index];
    }

    destinationMap.set(
        cityDestination, {
          city: cityDestination,
          destination: {
            photos: photoCity,
            description: descriptionCity,
          },
        });
  });

  return destinationMap;
};

const generateOfferEventType = () => {
  const eventTypesMap = new Map();

  routeTypes.forEach((routeType, index) => {
    eventTypesMap.set(routeType, OFFERS.slice(index - 1));
  });

  return eventTypesMap;
};

const generateDestinationOptionList = () => {
  const countOptions = 3;

  return new Array(countOptions)
    .fill()
    .map(() => getRandomListElement(CITIES));
};

const generateDate = () => {
  const maxHoursGap = 72;
  const hoursGap = getRandomInteger(1, maxHoursGap);

  const start = dayjs().add(hoursGap, `hour`).toDate();
  const end = dayjs(start).add(hoursGap, `hour`).toDate();

  return {start, end};
};

const generateTripPoint = () => {
  return {
    id: nanoid(),
    routeType: getRandomListElement(routeTypes),
    city: getRandomListElement(CITIES),
    time: generateDate(),
    price: getRandomInteger(5, 100),
    offers: OFFERS,
    isFavorite: !getRandomInteger(0, 1),
    destinationOptions: generateDestinationOptionList(),
    destination: {
      photos: [
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`,
        `http://picsum.photos/248/152?r=${Math.random()}`
      ],
      description: getRandomListElement(DESCRIPTIONS)
    },
  };
};

export {
  CITIES,
  generateTripPoint,
  generateOfferEventType,
  generateDestination
};

