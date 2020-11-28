import {createElement} from "../utils/render";

const tripEventsItemTemplate = () => `<li class="trip-events__item"></li>`;

class TripEventsItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return tripEventsItemTemplate();
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

export default TripEventsItem;
