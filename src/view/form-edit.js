import dayjs from "dayjs";
import he from "he";
import {nanoid} from "nanoid";

import SmartView from "./smart";

import {routeTypes} from "../const";
import {makeСapitalizedLetter, getSetOffersTitle} from "../utils/util";

const BLANK_NEW_EVENT = {
  routeType: `flight`,
  city: ``,
  time: {
    start: dayjs(),
    end: dayjs()
  },
  price: 100,
  offers: [],
  isFavorite: false,
  destination: {
    description: ``,
    photos: []
  },
};

const getCities = (destinationsData) => {
  return destinationsData.map((destination) => {
    return destination.name;
  });
};

const createDestinationOptionTemplate = (destinations) => {
  const cities = getCities(destinations);

  return cities.map((city) => {
    return `<option value="${city}"></option>`;
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
  if (photos.length === 0) {
    return ``;
  }

  return photos.map((photo) => {
    return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
  }).join(``);
};

const tripEventDestination = (destination) => {
  return destination.photos.length === 0 && destination.description === `` ? `` : `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationPhotoTemplate(destination.photos)}
      </div>
    </div>
  </section>`;
};

const createOfferTemplate = (pointOffers, offersData, routeType) => {
  const element = offersData.find((offer) => offer.type === routeType);

  return element.offers.slice().map((offer) => {
    const id = nanoid();
    const isChecked = pointOffers.some((pointOffer) => pointOffer.title === offer.title);

    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${offer.title}" ${isChecked ? `checked` : ``} data-title="${offer.title}">
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  }).join(``);
};

const tripEventOffersTemplate = (offers, offersData, routeType) => {
  const isOffers = createOfferTemplate(offers, offersData, routeType);

  return isOffers === `` ? `` : `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${createOfferTemplate(offers, offersData, routeType)}
    </div>
  </section>`;
};

const formEditTemplate = (tripPoint, serverData, isEdit) => {
  const {
    id,
    routeType,
    city,
    destination,
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
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-${id}" required>
        <datalist id="destination-list-${id}">
          ${createDestinationOptionTemplate(serverData.destinationsData)}
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
        <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${isEdit ? `Delete` : `Cancel`}</button>
      ${isEdit ? `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>` : ``}

    </header>
    <section class="event__details">
      ${tripEventOffersTemplate(offers, serverData.offersData, routeType)}
      ${tripEventDestination(destination)}
    </section>
  </form>`;
};

class FormEdit extends SmartView {
  constructor(
      serverData,
      formattedData,
      data = BLANK_NEW_EVENT
  ) {
    super();

    this._data = data;
    this._cities = null;
    this._serverData = serverData;
    this._formattedData = formattedData;

    this._offersNameSet = getSetOffersTitle(this._data.offers);

    this._onFormSubmitHandler = this._onFormSubmitHandler.bind(this);
    this._onFormButtonClick = this._onFormButtonClick.bind(this);
    this._onFormDeleteClick = this._onFormDeleteClick.bind(this);
    this._onInputRadioClick = this._onInputRadioClick.bind(this);
    this._onInputDestinationFocus = this._onInputDestinationFocus.bind(this);
    this._onInputDestinationBlur = this._onInputDestinationBlur.bind(this);
    this._onOfferCheckboxClick = this._onOfferCheckboxClick.bind(this);
    this._onInputCityChange = this._onInputCityChange.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    const isEditPoint = this._data !== BLANK_NEW_EVENT ? true : false;

    return formEditTemplate(this._data, this._serverData, isEditPoint);
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

  setFormDeleteHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._onFormDeleteClick);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormButtonClickHandler(this._callback.formButtonClick);
    this.setFormDeleteHandler(this._callback.formReset);
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

    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._onInputCityChange);
  }

  _onFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _onFormButtonClick() {
    this._callback.formButtonClick();
  }

  _onFormDeleteClick() {
    this._callback.formReset(this._data);
  }

  _onInputRadioClick(evt) {
    const element = this._serverData.offersData.find((routeType) => routeType.type === evt.target.value);

    this.updateData({
      routeType: evt.target.value,
      offers: element.offers,
    });
  }

  _onInputDestinationFocus(evt) {
    evt.target.value = ``;
  }

  _onInputCityChange(evt) {
    if (this._cities === null) {
      this._cities = getCities(this._serverData.destinationsData);
    }

    const value = makeСapitalizedLetter(evt.target.value);
    const isValid = this._cities.some((city) => city === value);

    if (isValid) {
      const element = this._serverData.destinationsData.find((city) => city.name === value);

      this.updateData({
        city: element.name,
        destination: {
          photos: element.pictures,
          description: element.description
        }
      });
    }
  }

  _onInputDestinationBlur(evt) {
    const value = makeСapitalizedLetter(evt.target.value);
    const isValid = this._cities.some((city) => city === value);

    if (!isValid) {
      evt.target.value = ``;
      evt.target.focus();
    }
  }

  _onOfferCheckboxClick(evt) {
    const updateOffers = [];
    const offerTitle = evt.target.dataset.title;

    if (this._offersNameSet.has(offerTitle)) {
      this._offersNameSet.delete(offerTitle);
    } else {
      this._offersNameSet.add(offerTitle);
    }

    this._offersNameSet.forEach((offer) => {
      updateOffers.push(this._formattedData.mapOffers.get(offer));
    });

    this.updateData({
      offers: updateOffers
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
