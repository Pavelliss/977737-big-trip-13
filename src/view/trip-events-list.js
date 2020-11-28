import {createElement} from "../utils/render";

const tripEventListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

class TripEventList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripEventListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripEventList;
