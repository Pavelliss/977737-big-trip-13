import dayjs from "dayjs";
import {nanoid} from "nanoid";

import {tripEventOffersTemplate} from "./trip-event-offers";
import {tripEventDestination} from "./trip-event-destination";
import {makeСapitalizedLetter} from "../utils/util";
import {routeTypes} from "../const";


const createDestinationOptionTemplate = (options) => {
  if (options === null) {
    return ``;
  }

  return options.map((option) => {
    return `<option value="${option}"></option>`;
  });
};

const createTripEventTypeTemplate = (id, routeType) => {
  return routeTypes.map((type) => {
    return `<div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${routeType === type ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${makeСapitalizedLetter(type)}</label>
  </div>`;
  }).join(``);
};

const createNewEvent = () => {
  return {
    id: nanoid(),
    routeType: `flight`,
    city: ``,
    time: {
      start: dayjs(),
      end: dayjs()
    },
    price: ``,
    destinationOptions: null,
    offers: null,
    isFavorite: false,
    destination: null,
  };
};

const formEditTemplate = (tripPoint = createNewEvent()) => {
  const {
    id,
    routeType,
    destination,
    destinationOptions,
    time,
    offers
  } = tripPoint;
  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${routeType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTripEventTypeTemplate(id, routeType)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
          ${makeСapitalizedLetter(routeType)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="" list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${createDestinationOptionTemplate(destinationOptions)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(time.start).format(`DD/MM/YYYY HH:mm `)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(time.start).format(`DD/MM/YYYY HH:mm `)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offers !== null ? tripEventOffersTemplate(id, offers) : ``}
      ${destination !== null ? tripEventDestination(destination) : ``}
    </section>
  </form>`;
};

export {formEditTemplate};
