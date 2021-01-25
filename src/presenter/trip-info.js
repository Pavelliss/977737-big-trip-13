import {render, replace, remove, RenderPosition} from "../utils/render";
import {FilterType} from "../const";
import {filter} from "../utils/filter";
import TripInfoView from "../view/trip-info";

class TripInfo {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._tripInfoComponent = null;
  }

  init() {
    const prevTripInfo = this._tripInfoComponent;
    const tripPoints = this._pointsModel.getPoints();

    if (tripPoints.length === 0) {
      return;
    }

    const filtredPoints = filter[FilterType.EVERYTHING](tripPoints);

    this._tripInfoComponent = new TripInfoView(filtredPoints);

    if (prevTripInfo === null) {
      render(
          this._container,
          this._tripInfoComponent,
          RenderPosition.AFTERBEGIN
      );
      return;
    }

    replace(this._tripInfoComponent, prevTripInfo);
    remove(prevTripInfo);
  }
}

export default TripInfo;
