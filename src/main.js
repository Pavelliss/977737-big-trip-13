import {END_POINT, AUTHORIZATION, UpdateType} from "./const";
import {getMapOffers} from "./utils/util";
import {render, RenderPosition} from "./utils/render";

import Api from "./api";

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

const api = new Api(END_POINT, AUTHORIZATION);

const dataLoad = {
  isPointsLoaded: false,
  isOffersLoaded: false,
  isDestinationsLoaded: false,
};

const serverData = {
  pointsData: [],
  offersData: [],
  destinationsData: [],
};

const initTripList = () => {
  pointsModel.setPoints(UpdateType.INIT, serverData.pointsData);
};

const renderComponents = () => {
  render(tripMain, tripControlsComponent);
  render(tripControlsComponent, new FilterTitleView());
  filterPresenter.init();
  render(tripMain, newButtonComponent);
};

const checkDataLoading = () => {
  if (
    !dataLoad.isPointsLoaded ||
    !dataLoad.isOffersLoaded ||
    !dataLoad.isDestinationsLoaded
  ) {
    return;
  }
  serverData.mapOffers = getMapOffers(serverData.offersData);

  renderComponents();
  initTripList();
};

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const tripEvents = pageBody.querySelector(`.trip-events`);

render(tripMain, new TripInfoView(), RenderPosition.AFTERBEGIN);

const tripControlsComponent = new TripControlsView();
const filterPresenter = new FilterPresenter(tripControlsComponent, filterModel);
const newButtonComponent = new NewButtonView();

const tripComponent = new TripPresenter(
    tripEvents,
    pointsModel,
    filterModel,
    newButtonComponent,
    api,
    serverData
);

tripComponent.init();

newButtonComponent.getElement().addEventListener(`click`, () => {
  tripComponent.createNewPoint();
  newButtonComponent.getElement().setAttribute(`disabled`, `disabled`);
});

api.getPoints()
  .then((points) => {
    dataLoad.isPointsLoaded = true;
    serverData.pointsData = points;
    checkDataLoading();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, serverData.pointsData);
  });

api.getOffers().then((offers) => {
  dataLoad.isOffersLoaded = true;
  serverData.offersData = offers;
  checkDataLoading();
});

api.getDestinations().then((destinations) => {
  dataLoad.isDestinationsLoaded = true;
  serverData.destinationsData = destinations;
  checkDataLoading();
});
