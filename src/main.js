import dayjs from "dayjs";
import {render, RenderPosition} from "./utils/render";

// view
import TripInfoView from "./view/trip-info";
import TripControlsView from "./view/trip-controls";
import NewButtonView from "./view/new-event-button";

// presenter
import TripPresenter from "./presenter/trip";

import {generateTripPoint} from "./mock/trip-point";

const EVENT_COUNT = 9;

const sortTripPoins = (a, b) => (dayjs(a.time.start).isAfter(dayjs(b.time.start)) ? -1 : 1);

const tripPoints = new Array(EVENT_COUNT).fill().map(generateTripPoint).sort(sortTripPoins);

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const tripEvents = pageBody.querySelector(`.trip-events`);

render(tripMain, new TripInfoView(), RenderPosition.AFTERBEGIN);

render(tripMain, new TripControlsView());
render(tripMain, new NewButtonView());

const tripComponent = new TripPresenter(tripEvents);

tripComponent.init(tripPoints);
