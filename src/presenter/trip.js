import {remove, render, RenderPosition} from "../utils/render";
import {filter} from "../utils/filter";
import {sortPointPrice, sortPointTime, sortPointDay} from "../utils/util";
import {
  SortType,
  UserAction,
  UpdateType,
  FilterType,
} from "../const";

// view
import SortView from "../view/trip-sort";
import TripEventListView from "../view/trip-events-list";
import ListEmptyView from "../view/list-empty";
import TripEventsItemView from "../view/trip-events-item";

// presenter
import PointPresenter from "./point";
import NewPointPresenter from "./new-point";

class Trip {
  constructor(
      container,
      pointsModel,
      filterModel,
      newButtonComponent) {

    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._newPointComponent = null;
    this._tripEventsItemComponent = null;
    this._newButtonComponent = newButtonComponent;
    this._listEmptyComponent = new ListEmptyView();
    this._tripEventsListComponent = new TripEventListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeEvent = this._handleModeEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._pointsModel.addObserver(this._handleModeEvent);
    this._filterModel.addObserver(this._handleModeEvent);
  }

  init() {
    this._pointPresenter = new Map();
    this._renderTripEventList(this._getPoinsts());
  }

  createNewPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._newPointComponent = new NewPointPresenter(
        this._tripEventsListComponent,
        this._handleViewAction,
        this._newButtonComponent
    );

    this._newPointComponent.init();
  }

  _getPoinsts() {
    const filterType = this._filterModel.getFilter();
    const tripPoints = this._pointsModel.getPoints();
    const filtredTasks = filter[filterType](tripPoints);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredTasks.sort(sortPointDay);
      case SortType.PRICE:
        return filtredTasks.sort(sortPointPrice);
      case SortType.TIME:
        return filtredTasks.sort(sortPointTime);
    }

    return filtredTasks;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModeEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data[`id`]).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripEventList();
        this._renderTripEventList();
        break;
      case UpdateType.MAJOR:
        this._clearTripEventList({resetSortType: true});
        this._renderTripEventList();
        break;
    }
  }

  _handleModeChange() {
    for (let presenter of this._pointPresenter.values()) {
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
        this._handleModeChange
    );

    pointPresenter.init(tripPoint);
    this._pointPresenter.set(tripPoint[`id`], pointPresenter);
  }

  _renderTripEventList() {
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

  _clearTripEventList({resetSortType = false} = {}) {
    for (let presenter of this._pointPresenter.values()) {
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
