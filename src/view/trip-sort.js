import AbstractView from "./adstract";
import {makeСapitalizedLetter} from "../utils/util";

const sortElementTemplate = (type, isChecked = false) => {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isChecked ? `checked` : false}>
    <label class="trip-sort__btn" for="sort-${type}">${makeСapitalizedLetter(type)}</label>
  </div>`;
};

const tripSortTemplate = () => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortElementTemplate(`day`, true)}
    ${sortElementTemplate(`event`)}
    ${sortElementTemplate(`time`)}
    ${sortElementTemplate(`price`)}
    ${sortElementTemplate(`offer`)}
  </form>`;
};

class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return tripSortTemplate();
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    this._callback.sortTypeChange(evt.target.value);
  }
}

export default Sort;
