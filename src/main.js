import dayjs from "dayjs";
import {render} from "./utils/render";

import {createTripInfoTemplate} from "./view/trip-info";
import {tripControlsTemplate} from "./view/trip-controls";
import {newEventButtonTemplate} from "./view/new-event-button";
import {tripSortTemplate} from "./view/trip-sort";
import {tripEventsListTemplate} from "./view/trip-events-list";
import {tripEventsItemTemplate} from "./view/trip-events-item";
import {formEditTemplate} from "./view/form-edit";
import {tripEventTemplate} from "./view/trip-event";

import {generateTripPoint} from "./mock/trip-point";

const EVENT_COUNT = 9;

const sortTripPoins = (a, b) => (dayjs(a.time.start).isAfter(dayjs(b.time.start)) ? 1 : -1);

const tripPoints = new Array(EVENT_COUNT).fill().map(generateTripPoint).sort(sortTripPoins);

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
render(tripEventsItem, formEditTemplate(tripPoints[0]));

for (let i = 1; i < EVENT_COUNT; i++) {
  render(tripEventsList, tripEventsItemTemplate());
  tripEventsItem = tripEvents.querySelector(`.trip-events__item:last-child`);
  render(tripEventsItem, tripEventTemplate(tripPoints[i]));
}
