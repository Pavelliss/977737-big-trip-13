import AbstractView from "./adstract";
import {makeСapitalizedLetter} from "../utils/util";

const filterElementTemplate = (filterType, currentFilterType) => {
  return `<div class="trip-filters__filter">
    <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${filterType === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filterType}">${makeСapitalizedLetter(filterType)}</label>
  </div>`;
};

const filterTemplate = (currentFilterType) => {
  return `<form class="trip-filters" action="#" method="get">
    ${filterElementTemplate(`everything`, currentFilterType)}
    ${filterElementTemplate(`future`, currentFilterType)}
    ${filterElementTemplate(`past`, currentFilterType)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

class Filter extends AbstractView {
  constructor(currentFilterType) {
    super();
    this._currentFilterType = currentFilterType;
    this._onFormFilterTypeChange = this._onFormFilterTypeChange.bind(this);
  }

  getTemplate() {
    return filterTemplate(this._currentFilterType);
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
