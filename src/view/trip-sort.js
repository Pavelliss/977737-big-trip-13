import AbstractView from "./adstract";
import {makeСapitalizedLetter} from "../utils/util";

const sortElementTemplate = (type, sortType, isDesabled = false) => {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${sortType === type ? `checked` : false} ${isDesabled ? `disabled` : ``}>
    <label class="trip-sort__btn" for="sort-${type}">${makeСapitalizedLetter(type)}</label>
  </div>`;
};

const tripSortTemplate = (sortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortElementTemplate(`day`, sortType)}
    ${sortElementTemplate(`event`, sortType, true)}
    ${sortElementTemplate(`time`, sortType)}
    ${sortElementTemplate(`price`, sortType)}
    ${sortElementTemplate(`offer`, sortType, true)}
  </form>`;
};

class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return tripSortTemplate(
        this._currentSortType.toLowerCase()
    );
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
