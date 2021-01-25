import FilterView from "../view/filter";
import {UpdateType} from "../const";
import {remove, render, replace} from "../utils/render";

class Filter {
  constructor(container, filterModel) {
    this._container = container;
    this._filterModel = filterModel;

    this._isDisabled = false;
    this._currentFilter = null;
    this._filterComponent = null;
    this._filtredPoints = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._filtredPoints = this._filterModel.filtredPoints;

    const prevFilter = this._filterComponent;

    this._filterComponent = new FilterView(
        this._currentFilter,
        this._filtredPoints,
        this._isDisabled);

    this._filterComponent.setFormChangeHandler(this._handleFilterTypeChange);

    if (prevFilter === null) {
      render(this._container, this._filterComponent);
      return;
    }
    replace(this._filterComponent, prevFilter);
    remove(prevFilter);
  }

  disabled() {
    this._isDisabled = true;
  }

  enabled() {
    this._isDisabled = false;
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}

export default Filter;
