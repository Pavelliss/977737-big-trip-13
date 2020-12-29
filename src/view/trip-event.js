import dayjs from "dayjs";
import AbstractView from "./adstract";
import {TimeMS} from "../const";

const MAX_LENGTH_OFFER = 15;

const addZero = (value) => String(value).padStart(2, `0`);

const calcElapsedTime = (start, end) => {
  const different = end - start;
  const day = addZero(Math.ceil(different / TimeMS.day));
  const hours = addZero(Math.floor((different % TimeMS.day) / TimeMS.hour));
  const minutes = addZero(Math.round(((different % TimeMS.day) % TimeMS.hour) / TimeMS.minute));

  if (different >= TimeMS.day) {
    return `${day}D ${hours}H ${minutes}M`;
  }

  if (different >= TimeMS.hour) {
    return `${hours}H ${minutes}M`;
  }

  return `${hours}M`;
};

const trimsText = (text) => {
  if (text.length <= MAX_LENGTH_OFFER) {
    return text;
  }

  text = text.slice(0, MAX_LENGTH_OFFER);

  return text.trim();
};

const createAddtionalOptions = (offers) => {
  return offers
  .map((offer) =>
    `<li class="event__offer">
      <span class="event__offer-title">${trimsText(offer.title)}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`
  ).join(``);
};

const tripEventTemplate = (tripPoint) => {
  const {
    routeType,
    city,
    time,
    price,
    offers,
    isFavorite} = tripPoint;

  return `<div class="event">
    <time class="event__date" datetime="${dayjs(time.start).format(`YYYY-MM-DD`)}">${dayjs(time.start).format(`MMM DD`)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${routeType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${routeType} ${city}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(time.start).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(time.start).format(`HH:mm`)}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(time.end).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(time.end).format(`HH:mm`)}</time>
      </p>
      <p class="event__duration">${calcElapsedTime(time.start, time.end)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.length === 0 ? `` : createAddtionalOptions(offers)}
    </ul>
    <button class="event__favorite-btn
    ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
};

class TripEvent extends AbstractView {
  constructor(tripPoint) {
    super();
    this._tripPoint = tripPoint;

    this._buttonClickHandler = this._buttonClickHandler.bind(this);
    this._buttonFavoriteClickHandler = this._buttonFavoriteClickHandler.bind(this);
  }

  getTemplate() {
    return tripEventTemplate(this._tripPoint);
  }

  _buttonClickHandler() {
    this._callback.buttonClick();
  }

  _buttonFavoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._buttonClickHandler);
  }

  setButtonFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._buttonFavoriteClickHandler);
  }
}

export default TripEvent;
