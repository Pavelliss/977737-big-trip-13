import {render, RenderPosition} from "../utils/render";
import {updateItem, sortPointPrice, sortPointTime} from "../utils/util";
import {SortType} from "../const";

// view
import SortView from "../view/trip-sort";
import TripEventListView from "../view/trip-events-list";
import ListEmptyView from "../view/list-empty";
import TripEventsItemView from "../view/trip-events-item";

// presenter
import PointPresenter from "../presenter/point";

class Trip {
  constructor(container) {
    this._container = container;
    this._currentSortType = SortType.DAY;

    this._sortComponent = new SortView();
    this._tripEventsListComponent = new TripEventListView();
    this._listEmptyComponent = new ListEmptyView();
    this._tripEventsItemComponent = null;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourceTripPoints = tripPoints.slice();
    this._pointPresenter = new Map();

    this._renderSort();

    if (this._tripPoints.length === 0) {
      render(this._container, this._listEmptyComponent);
      return;
    }

    this._renderTripEventList(this._tripPoints);
  }

  _handlePointChange(updateTripPoint) {
    this._tripPoints = updateItem(this._tripPoints, updateTripPoint);
    this._pointPresenter.get(updateTripPoint[`id`]).init(updateTripPoint);
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

    this._sortPoints(sortType);
    this._clearTripEventList();
    this._renderTripEventList(this._tripPoints);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._tripPoints.sort(sortPointPrice);
        break;
      case SortType.TIME:
        this._tripPoints.sort(sortPointTime);
        break;
      default:
        this._tripPoints = this._sourceTripPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    render(this._container, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderTripPoint(tripPoint) {
    const pointPresenter = new PointPresenter(
        this._tripEventsItemComponent,
        this._handlePointChange,
        this._handleModeChange
    );

    pointPresenter.init(tripPoint);
    this._pointPresenter.set(tripPoint[`id`], pointPresenter);
  }

  _renderTripEventList() {
    render(this._container, this._tripEventsListComponent);
    this._tripPoints.forEach((tripPoint) => {
      this._tripEventsItemComponent = new TripEventsItemView();

      render(
          this._tripEventsListComponent,
          this._tripEventsItemComponent,
          RenderPosition.AFTERBEGIN
      );

      this._renderTripPoint(tripPoint);
    });
  }

  _clearTripEventList() {
    for (let presenter of this._pointPresenter.values()) {
      presenter.destroy();
    }
    this._pointPresenter.clear();
  }
}

export default Trip;
