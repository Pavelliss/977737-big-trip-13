import Observer from "../utils/observer";
import {FilterType} from "../const";
import {filter} from "../utils/filter";

class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;

    this.filtredPoints = null;
  }

  setFilter(updateType, activeFilter) {
    this._activeFilter = activeFilter;
    this._notyfy(updateType, activeFilter);
  }

  getFilter() {
    return this._activeFilter;
  }

  getFiltredPoints(points) {
    this.filtredPoints = {
      [FilterType.EVERYTHING]: filter[FilterType.EVERYTHING](points),
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points),
      [FilterType.PAST]: filter[FilterType.PAST](points)
    };
  }
}

export default Filter;
