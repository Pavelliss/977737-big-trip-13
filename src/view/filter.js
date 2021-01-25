import AbstractView from "./adstract";
import {makeСapitalizedLetter} from "../utils/util";

const filterElementTemplate = (
    filterType,
    currentFilterType,
    filtredPoints,
    isDisabled) => {
  const isEmpty = filtredPoints[filterType].length === 0;

  return `<div class="trip-filters__filter">
    <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
    value="${filterType}"
    ${filterType === currentFilterType ? `checked` : ``}
    ${isEmpty || isDisabled ? `disabled` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filterType}">${makeСapitalizedLetter(filterType)}</label>
  </div>`;
};

const filterTemplate = (currentFilterType, filtredPoints, isDisabled) => {
  return `<form class="trip-filters" action="#" method="get">
    ${filterElementTemplate(`everything`, currentFilterType, filtredPoints, isDisabled)}
    ${filterElementTemplate(`future`, currentFilterType, filtredPoints, isDisabled)}
    ${filterElementTemplate(`past`, currentFilterType, filtredPoints, isDisabled)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

class Filter extends AbstractView {
  constructor(currentFilterType, filtredPoints, isDisabled) {
    super();
    this._currentFilterType = currentFilterType;
    this._filtredPoints = filtredPoints;
    this._isDisabled = isDisabled;

    this._onFormFilterTypeChange = this._onFormFilterTypeChange.bind(this);
  }

  getTemplate() {
    return filterTemplate(
        this._currentFilterType,
        this._filtredPoints,
        this._isDisabled);
  }

  setFormChangeHandler(callback) {
    this._callback.formFilterChange = callback;
    this.getElement().addEventListener(`change`, this._onFormFilterTypeChange);
  }

  _onFormFilterTypeChange(evt) {
    this._callback.formFilterChange(evt.target.value);
  }
}

export default Filter;
