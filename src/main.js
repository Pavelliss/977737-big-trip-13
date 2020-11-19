import {render} from "./utils/render";

const EVENT_COUNT = 9;

import {createTripInfoTemplate} from "./view/trip-info";
import {tripControlsTemplate} from "./view/trip-controls";
import {newEventButtonTemplate} from "./view/new-event-button";
import {tripSortTemplate} from "./view/trip-sort";
import {tripEventsListTemplate} from "./view/trip-events-list";
import {tripEventsItemTemplate} from "./view/trip-events-item";
import {formEditTemplate} from "./view/form-edit";
import {tripEventTemplate} from "./view/trip-event";

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const tripEvents = pageBody.querySelector(`.trip-events`);

render(tripMain, createTripInfoTemplate(), `afterbegin`);
render(tripMain, tripControlsTemplate());
render(tripMain, newEventButtonTemplate());

render(tripEvents, tripSortTemplate());
render(tripEvents, tripEventsListTemplate());

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

let tripEventsItem = ``;

render(tripEventsList, tripEventsItemTemplate());
tripEventsItem = tripEvents.querySelector(`.trip-events__item`);
render(tripEventsItem, formEditTemplate());

for (let i = 0; i < EVENT_COUNT; i++) {
  render(tripEventsList, tripEventsItemTemplate());
  tripEventsItem = tripEvents.querySelector(`.trip-events__item:last-child`);
  render(tripEventsItem, tripEventTemplate());
}
