import {makeСapitalizedLetter} from "../utils/util";

const controlElementTemplate = (title, isChecked = false) => {
  return `<div class="trip-filters__filter">
    <input id="filter-${title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${title}">${makeСapitalizedLetter(title)}</label>
  </div>`;
};

export {controlElementTemplate};
