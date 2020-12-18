import dayjs from "dayjs";
import {FilterType} from "../const";

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.time.start >= dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => point.time.start < dayjs()),
};

export {filter};
