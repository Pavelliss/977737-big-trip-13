import dayjs from "dayjs";
import {render, RenderPosition} from "./utils/render";
import {isEscapeEvent} from "./utils/dom-events";

// view
import TripInfoView from "./view/trip-info";
import TripControlsView from "./view/trip-controls";
import NewButtonView from "./view/new-event-button";
import SortView from "./view/trip-sort";
import TripEventListView from "./view/trip-events-list";
import TripEventsItemView from "./view/trip-events-item";
import FormEditView from "./view/form-edit";
import TripEventView from "./view/trip-event";
import ListEmptyView from "./view/list-empty";

import {generateTripPoint} from "./mock/trip-point";

const EVENT_COUNT = 9;

const sortTripPoins = (a, b) => (dayjs(a.time.start).isAfter(dayjs(b.time.start)) ? 1 : -1);

const tripPoints = new Array(EVENT_COUNT).fill().map(generateTripPoint).sort(sortTripPoins);

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const tripEvents = pageBody.querySelector(`.trip-events`);

render(tripMain, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);

render(tripMain, new TripControlsView().getElement());
render(tripMain, new NewButtonView().getElement());

const renderTripPoint = (container, tripPoint) => {
  const tripPointComponent = new TripEventView(tripPoint);
  const formEditComponent = new FormEditView(tripPoint);

  const replaceTripPointToFormEdit = () => {
    container.replaceChild(formEditComponent.getElement(), tripPointComponent.getElement());
  };

  const replaceFormEditToTripPoint = () => {
    container.replaceChild(tripPointComponent.getElement(), formEditComponent.getElement());
  };

  const hideFormEdit = () => {
    replaceFormEditToTripPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      hideFormEdit();
    }
  };

  tripPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceTripPointToFormEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  formEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, hideFormEdit);

  formEditComponent.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, hideFormEdit);

  formEditComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    hideFormEdit();
  });

  render(container, tripPointComponent.getElement());
};

const renderTripPointList = () => {
  render(tripEvents, new SortView().getElement());
  render(tripEvents, new TripEventListView().getElement());

  const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

  let tripEventsItem = ``;

  render(tripEventsList, new TripEventsItemView().getElement());
  tripEventsItem = tripEvents.querySelector(`.trip-events__item`);

  for (let i = 0; i < EVENT_COUNT; i++) {
    render(tripEventsList, new TripEventsItemView().getElement());

    tripEventsItem = tripEvents.querySelector(`.trip-events__item:last-child`);

    renderTripPoint(tripEventsItem, tripPoints[i]);
  }
};

if (tripPoints.length === 0) {
  render(tripEvents, new ListEmptyView().getElement());
} else {
  renderTripPointList();
}
