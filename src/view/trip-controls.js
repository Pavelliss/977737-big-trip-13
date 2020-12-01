import AbstractView from "./adstract";
import {makeСapitalizedLetter} from "../utils/util";

const controlElementTemplate = (title, isChecked) => {
  return `<div class="trip-filters__filter">
    <input id="filter-${title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${title}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${title}">${makeСapitalizedLetter(title)}</label>
  </div>`;
};

const tripControlsTemplate = () => {
  return `<div class="trip-main__trip-controls  trip-controls">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>

    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${controlElementTemplate(`everything`, true)}
      ${controlElementTemplate(`future`)}
      ${controlElementTemplate(`past`)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};

class TripControls extends AbstractView {
  getTemplate() {
    return tripControlsTemplate();
  }
}

export default TripControls;
