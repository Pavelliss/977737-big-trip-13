const routeTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const TimeMS = {
  day: 86400000,
  hour: 3600000,
  minute: 60000,
};

const SortType = {
  DAY: `DAY`,
  TIME: `TIME`,
  PRICE: `PRICE`,
};

const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`,
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};


export {
  routeTypes,
  TimeMS,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
};
