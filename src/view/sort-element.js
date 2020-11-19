import {makeСapitalizedLetter} from "../utils/util";

const sortElementTemplate = (type, isChecked = false) => {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isChecked ? `checked` : false}>
    <label class="trip-sort__btn" for="sort-${type}">${makeСapitalizedLetter(type)}</label>
  </div>`;
};

export {sortElementTemplate};
