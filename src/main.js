import {
  END_POINT,
  AUTHORIZATION,
  UpdateType,
  MenuItem,
  FilterType
} from "./const";
import {getMapOffers, isOnline} from "./utils/util";
import {toast} from "./utils/toast/toast";
import {remove, render, RenderPosition} from "./utils/render";

// api
import Api from "./api/api";
import Store from "./api/store";
import Provider from "./api/provider";

// model
import PointsModel from "./model/points";
import FilterModel from "./model/filter";

// view
import TripInfoView from "./view/trip-info";
import TripControlsView from "./view/trip-controls";
import NewButtonView from "./view/new-button";
import StatisticView from "./view/statistics";

// presenter
import TripPresenter from "./presenter/trip";
import FilterPresenter from "./presenter/filter";

const STORE_PREFIX = `big-trip-cache`;
const STORE_VER = `v13`;
const STORE_POINTS = `${STORE_PREFIX}-points-${STORE_VER}`;
const STORE_OFFERS = `${STORE_PREFIX}-offers-${STORE_VER}`;
const STORE_DESTINATIONS = `${STORE_PREFIX}-destinations-${STORE_VER}`;

const pageBody = document.querySelector(`.page-body`);
const tripMain = pageBody.querySelector(`.trip-main`);
const pageMain = pageBody.querySelector(`.page-body__page-main `);
const pageBodyContainer = pageMain.querySelector(`.page-body__container`);
const tripEvents = pageMain.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);
const storePoints = new Store(STORE_POINTS, window.localStorage);
const storeOffers = new Store(STORE_OFFERS, window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS, window.localStorage);
const apiWithProviderPoints = new Provider(api, storePoints);
const apiWithProviderOffers = new Provider(api, storeOffers);
const apiWithProviderDestinations = new Provider(api, storeDestinations);

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

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const tripControlsComponent = new TripControlsView();
const filterPresenter = new FilterPresenter(tripControlsComponent, filterModel);
const newButtonComponent = new NewButtonView();
const tripComponent = new TripPresenter(
    tripEvents,
    pointsModel,
    filterModel,
    newButtonComponent,
    apiWithProviderPoints,
    serverData,
    formattedData,
    filterPresenter
);

const initTripList = () => {
  pointsModel.setPoints(UpdateType.INIT, serverData.pointsData);
};

const renderComponents = () => {
  render(tripMain, tripControlsComponent, RenderPosition.AFTERBEGIN);
  render(tripMain, new TripInfoView(), RenderPosition.AFTERBEGIN);
  filterPresenter.init();
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

  initTripList();
  renderComponents();
};

const onControlClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:

      tripComponent.show();

      if (statisticsComponent !== null) {
        remove(statisticsComponent);
      }

      newButtonComponent.enabled();
      filterPresenter.enabled();
      filterPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filterPresenter.disabled();

      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripComponent.hide();

      statisticsComponent = new StatisticView(pointsModel.getPoints());

      render(pageBodyContainer, statisticsComponent);

      newButtonComponent.disabled();
      break;
  }
};

render(tripMain, newButtonComponent);

tripComponent.init();

tripControlsComponent.setControlClickHandler(onControlClick);

newButtonComponent.getElement().addEventListener(`click`, () => {
  if (!isOnline()) {
    toast(`You create a new point`);
    return;
  }
  tripComponent.createNewPoint();
  newButtonComponent.disabled();
});

apiWithProviderPoints.getPoints()
  .then((points) => {
    dataLoad.isPointsLoaded = true;
    serverData.pointsData = points;
    checkDataLoading();
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, serverData.pointsData);
  });

apiWithProviderOffers.getOffers().then((offers) => {
  dataLoad.isOffersLoaded = true;
  serverData.offersData = offers;
  checkDataLoading();
});

apiWithProviderDestinations.getDestinations().then((destinations) => {
  dataLoad.isDestinationsLoaded = true;
  serverData.destinationsData = destinations;
  checkDataLoading();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  toast(`You are online :)`);
  apiWithProviderPoints.sync();
});

window.addEventListener(`offline`, () => {
  toast(`You are offline :(`);
  document.title += ` [offline]`;
});
