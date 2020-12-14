import dayjs from "dayjs";
import {nanoid} from "nanoid";

import SmartView from "./smart";

import {routeTypes} from "../const";
import {makeСapitalizedLetter, updateItem} from "../utils/util";
import {
  CITIES,
  generateOfferEventType,
  generateDestination
} from "../mock/trip-point";


const BLANK_NEW_EVENT = {
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
const MAX_OFFERS_COUNT = 4;

const eventTypesMap = generateOfferEventType();
const destinationsMap = generateDestination();

const createDestinationOptionTemplate = (options) => {
  if (options === null) {
    return ``;
  }

  return options.map((option) => {
    return `<option value="${option}"></option>`;
  }).join(``);
};

const createTripEventTypeTemplate = (id, routeType) => {
  return routeTypes.map((type) => {
    return `<div class="event__type-item">
    <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${routeType === type ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${makeСapitalizedLetter(type)}</label>
  </div>`;
  }).join(``);
};

const createDestinationPhotoTemplate = (photos) => {
  if (photos === null) {
    return ``;
  }

  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo}" alt="Event photo">`;
  }).join(``);
};

const tripEventDestination = (destination) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationPhotoTemplate(destination.photos)}
      </div>
    </div>
  </section>`;
};

const createOfferTemplate = (offers) => {
  const sortOffers = offers.sort((a, b) => b.isChecked - a.isChecked);
  const offersCount = MAX_OFFERS_COUNT;


  return sortOffers.slice(0, offersCount).map((offer) => {
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offer.name}" ${offer.isChecked ? `checked` : ``}>
    <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  }).join(``);
};

const tripEventOffersTemplate = (offers) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createOfferTemplate(offers)}
    </div>
  </section>`;
};

const formEditTemplate = (tripPoint, isEdit = true) => {
  const {
    id,
    routeType,
    city,
    destination,
    destinationOptions,
    time,
    price,
    offers
  } = tripPoint;
  return `<form class="event event--edit" action="#" method="post" autocomplete="off" >
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
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}" required>
        <datalist id="destination-list-${id}">
          ${createDestinationOptionTemplate(destinationOptions)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dayjs(time.start).format(`DD/MM/YY HH:mm `)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dayjs(time.start).format(`DD/MM/YY HH:mm `)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}" readonly>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isEdit ? `Delete` : `Cancel`}</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offers !== null ? tripEventOffersTemplate(offers) : ``}
      ${destination !== null ? tripEventDestination(destination) : ``}
    </section>
  </form>`;
};

class FormEdit extends SmartView {
  constructor(data = BLANK_NEW_EVENT) {
    super();

    this._data = data;

    this._onFormSubmitHandler = this._onFormSubmitHandler.bind(this);
    this._onFormButtonClick = this._onFormButtonClick.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onInputRadioClick = this._onInputRadioClick.bind(this);
    this._onInputDestinationFocus = this._onInputDestinationFocus.bind(this);
    this._onInputDestinationBlur = this._onInputDestinationBlur.bind(this);
    this._onOfferCheckboxClick = this._onOfferCheckboxClick.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return formEditTemplate(this._data);
  }

  reset(tripPoint) {
    this.updateData(
        FormEdit.parseTripPointToData(tripPoint)
    );
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._onFormSubmitHandler);
  }

  setFormButtonClickHandler(callback) {
    this._callback.formButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._onFormButtonClick);
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._onFormReset);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormButtonClickHandler(this._callback.formButtonClick);
    this.setFormResetHandler(this._callback.formReset);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll(`input[type=radio]`)
      .forEach((radio) => radio.addEventListener(`click`, this._onInputRadioClick));

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`focus`, this._onInputDestinationFocus);

    this.getElement()
    .querySelector(`.event__input--destination`)
    .addEventListener(`blur`, this._onInputDestinationBlur);

    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((offer) => {
        offer.addEventListener(`click`, this._onOfferCheckboxClick);
      });
  }

  _onFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _onFormButtonClick() {
    this._callback.formButtonClick();
  }

  _onFormReset() {
    this._callback.formReset();
  }

  _onInputRadioClick(evt) {
    this.updateData({
      routeType: evt.target.value,
      offers: eventTypesMap.get(evt.target.value),
    });
  }

  _onInputDestinationFocus(evt) {
    evt.target.value = ``;
  }

  _onInputDestinationBlur(evt) {
    const value = makeСapitalizedLetter(evt.target.value);
    const isValid = CITIES.some((city) => city === value);

    if (!isValid) {
      evt.target.value = ``;
      evt.target.focus();
      return;
    }

    this.updateData(destinationsMap.get(value));
  }

  _onOfferCheckboxClick(evt) {
    const offers = this._data.offers.slice();
    const inputId = evt.target.id;
    let inputOffer = offers.find((offer) => offer.id === inputId);

    inputOffer = Object.assign(
        {},
        inputOffer,
        {
          isChecked: !inputOffer.isChecked
        }
    );

    this.updateData({
      offers: updateItem(offers, inputOffer)
    }, true);
  }

  static parseDataToTripPoint(data) {
    data = Object.assign({}, data);
    return data;
  }

  static parseTripPointToData(tripPoint) {
    return Object.assign({}, tripPoint);
  }
}

export default FormEdit;
