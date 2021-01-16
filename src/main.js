import {
  END_POINT,
  AUTHORIZATION,
  UpdateType,
  MenuItem,
  FilterType
} from "./const";
import {getMapOffers} from "./utils/util";
import {remove, render, RenderPosition} from "./utils/render";

import Api from "./api";

// model
import PointsModel from "./model/points";
import FilterModel from "./model/filter";

// view
import TripInfoView from "./view/trip-info";
import TripControlsView from "./view/trip-controls";
import NewButtonView from "./view/new-event-button";
import FilterTitleView from "./view/filter-title";
import StatisticView from "./view/statistics";

// presenter
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const pageMain = pageBody.querySelector(`.page-body__page-main `);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const dataLoad = {
  isPointsLoaded: false,
  isOffersLoaded: false,
  isDestinationsLoaded: false,
};

const serverData = {
  pointsData: [],
  offersData: [],
  destinationsData: []
};

const formattedData = {
  mapOffers: null
};

let statisticsComponent = null;

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

  formattedData.mapOffers = getMapOffers(serverData.offersData);

  renderComponents();
  initTripList();
};

const onControlClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripComponent.show();
      remove(statisticsComponent);
      newButtonComponent.getElement().removeAttribute(`disabled`);
      break;
    case MenuItem.STATISTICS:
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripComponent.hide();
      statisticsComponent = new StatisticView(serverData.pointsData);

      render(pageBodyContainer, statisticsComponent);

      newButtonComponent.getElement().setAttribute(`disabled`, `disabled`);
      break;
  }
};

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

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
    serverData,
    formattedData
);

tripComponent.init();

tripControlsComponent.setControlClickHandler(onControlClick);

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
