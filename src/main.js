import dayjs from "dayjs";
import {render, RenderPosition} from "./utils/render";
import {generateTripPoint} from "./mock/trip-point";

// model
import PointsModel from "./model/points";
import FilterModel from "./model/filter";

// view
import TripInfoView from "./view/trip-info";
import TripControlsView from "./view/trip-controls";
import NewButtonView from "./view/new-event-button";
import FilterTitleView from "./view/filter-title";

// presenter
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

const EVENT_COUNT = 9;

const sortTripPoins = (a, b) => (dayjs(a.time.start).isAfter(dayjs(b.time.start)) ? -1 : 1);

const tripPoints = new Array(EVENT_COUNT).fill().map(generateTripPoint).sort(sortTripPoins);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPoints);
const filterModel = new FilterModel();

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const tripEvents = pageBody.querySelector(`.trip-events`);

render(tripMain, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripControlsComponent = new TripControlsView();

render(tripMain, tripControlsComponent);
render(tripControlsComponent, new FilterTitleView());

const filterPresenter = new FilterPresenter(tripControlsComponent, filterModel);
filterPresenter.init();

const newButtonComponent = new NewButtonView();
render(tripMain, newButtonComponent);

const tripComponent = new TripPresenter(tripEvents, pointsModel, filterModel, newButtonComponent);

tripComponent.init();

newButtonComponent.getElement().addEventListener(`click`, () => {
  tripComponent.createNewPoint();
  newButtonComponent.getElement().setAttribute(`disabled`, `disabled`);
});
