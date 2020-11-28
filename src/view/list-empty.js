import {createElement} from "../utils/render";

const listEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

class ListEmpty {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return listEmptyTemplate();
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

export default ListEmpty;
