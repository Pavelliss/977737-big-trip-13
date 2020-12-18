import AbstractView from "./adstract";

const tripControlsTemplate = () => {
  return `<div class="trip-main__trip-controls  trip-controls">
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>
  </div>`;
};

class TripControls extends AbstractView {
  getTemplate() {
    return tripControlsTemplate();
  }
}

export default TripControls;
