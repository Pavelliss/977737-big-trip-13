import {remove, render, RenderPosition} from "../utils/render";
import {
  sortPointPrice,
  sortPointTime,
  sortPointDay
} from "../utils/util";

import {
  SortType,
  UserAction,
  UpdateType,
  FilterType,
} from "../const";

// view
import SortView from "../view/sort";
import TripEventListView from "../view/trip-events-list";
import ListEmptyView from "../view/list-empty";
import TripEventsItemView from "../view/trip-events-item";
import LoadingView from "../view/loading";

// presenter
import PointPresenter from "./point";
import NewPointPresenter from "./new-point";
import {State as PointPresenterViewState} from "./point";

class Trip {
  constructor(
      container,
      pointsModel,
      filterModel,
      newButtonComponent,
      api,
      serverData,
      formattedData,
      filterPresenter,
      tripInfoPresenter
  ) {

    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._serverData = serverData;
    this._formattedData = formattedData;
    this._api = api;
    this._filterPresenter = filterPresenter;
    this._tripInfoPresenter = tripInfoPresenter;

    this._currentSortType = null;
    this._isLoading = true;

    this._sortComponent = null;
    this._newPointComponent = null;
    this._tripEventsItemComponent = null;
    this._newButtonComponent = newButtonComponent;
    this._listEmptyComponent = new ListEmptyView();
    this._tripEventsListComponent = new TripEventListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeEvent = this._handleModeEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init() {
    this._currentSortType = SortType.DAY;
    this._pointPresenter = new Map();
    this._pointsModel.addObserver(this._handleModeEvent);
    this._filterModel.addObserver(this._handleModeEvent);

    this._renderTripEventList(this._getPoinsts());
  }

  createNewPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._newPointComponent = new NewPointPresenter(
        this._tripEventsListComponent,
        this._handleViewAction,
        this._newButtonComponent,
        this._serverData,
        this._formattedData
    );

    this._newPointComponent.init();
  }

  destroy() {
    this._clearTripEventList();

    this._pointsModel.removeObserver(this._handleModeEvent);
    this._filterModel.removeObserver(this._handleModeEvent);
  }

  show() {
    this._container.classList.remove(`trip-events--hidden`);
  }

  hide() {
    this._container.classList.add(`trip-events--hidden`);
  }

  _getPoinsts() {
    const tripPoints = this._pointsModel.getPoints();
    const filterType = this._filterModel.getFilter();

    this._filterModel.getFiltredPoints(tripPoints);

    const filtredPoints = this._filterModel.filtredPoints[filterType];

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort(sortPointDay);
      case SortType.PRICE:
        return filtredPoints.sort(sortPointPrice);
      case SortType.TIME:
        return filtredPoints.sort(sortPointTime);
    }

    return filtredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);

        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._newPointComponent.setSaving();

        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._newPointComponent.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);

        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModeEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data[`id`]).init(data);
        this._tripInfoPresenter.init();
        break;
      case UpdateType.MINOR:
        this._clearTripEventList();
        this._renderTripEventList();
        this._tripInfoPresenter.init();
        break;
      case UpdateType.MAJOR:
        this._clearTripEventList({resetSortType: true});
        this._renderTripEventList();
        this._filterPresenter.init();
        this._tripInfoPresenter.init();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTripEventList();
        break;
    }
  }

  _handleModeChange() {
    for (const presenter of this._pointPresenter.values()) {
      presenter.resetView();
    }
  }

  _handleSortChange(sortType) {
    sortType = sortType.slice(5).toUpperCase();

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripEventList();
    this._renderTripEventList();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    render(this._container, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderTripPoint(tripPoint) {
    const pointPresenter = new PointPresenter(
        this._tripEventsItemComponent,
        this._handleViewAction,
        this._handleModeChange,
        this._serverData,
        this._formattedData
    );

    pointPresenter.init(tripPoint);
    this._pointPresenter.set(tripPoint[`id`], pointPresenter);
  }

  _renderTripEventList() {
    if (this._isLoading) {
      this._renderLoading();
      this._newButtonComponent.disabled();
      return;
    }

    this._newButtonComponent.enabled();

    const points = this._getPoinsts();

    if (points.length === 0) {
      render(this._container, this._listEmptyComponent);
      return;
    }

    this._renderSort();

    render(this._container, this._tripEventsListComponent);

    points.forEach((tripPoint) => {
      this._tripEventsItemComponent = new TripEventsItemView();

      render(
          this._tripEventsListComponent,
          this._tripEventsItemComponent,
          RenderPosition.AFTERBEGIN
      );

      this._renderTripPoint(tripPoint);
    });
  }

  _renderLoading() {
    render(this._container, this._loadingComponent);
  }

  _clearTripEventList({resetSortType = false} = {}) {
    for (const presenter of this._pointPresenter.values()) {
      presenter.destroy();
    }

    remove(this._listEmptyComponent);
    remove(this._tripEventsListComponent);
    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    this._pointPresenter.clear();
  }
}

export default Trip;
