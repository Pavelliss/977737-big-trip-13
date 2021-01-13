import AbstractView from "./adstract";
import {MenuItem} from "../const";

const tripControlsTemplate = () => {
  return `<div class="trip-main__trip-controls  trip-controls">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-control="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-control=${MenuItem.STATISTICS}>Stats</a>
    </nav>
  </div>`;
};

class TripControls extends AbstractView {
  constructor() {
    super();

    this._onControlClick = this._onControlClick.bind(this);
  }

  getTemplate() {
    return tripControlsTemplate();
  }

  setControlClickHandler(callback) {
    this._callback.controlClick = callback;
    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((control) => {
        control.addEventListener(`click`, this._onControlClick);
      });
  }

  _onControlClick(evt) {
    evt.preventDefault();
    const currentControl = evt.target;

    this._changeClassActive(currentControl);
    this._callback.controlClick(currentControl.dataset.control);
  }

  _changeClassActive(currentControl) {
    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
        .forEach((control) => {
          control.classList.remove(`trip-tabs__btn--active`);
        });

    currentControl.classList.add(`trip-tabs__btn--active`);
  }
}

export default TripControls;
