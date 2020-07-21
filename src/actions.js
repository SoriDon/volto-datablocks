import {
  GET_SPARQL_DATA,
  GET_DATA_FROM_PROVIDER,
  CHANGE_SIDEBAR_STATE,
  SET_CONNECTED_DATA_PARAMETERS,
  DELETE_CONNECTED_DATA_PARAMETERS,
} from './constants';
// import { settings } from '~/config';

export function changeSidebarState(open) {
  return {
    type: CHANGE_SIDEBAR_STATE,
    open,
  };
}

export function getSparqlData(path) {
  const url = path + '/@sparql-data';
  return {
    type: GET_SPARQL_DATA,
    request: {
      op: 'get',
      path: url,
    },
  };
}

export function getDataFromProvider(path, filters) {
  // console.log('getDataFromProvider call, ', path, filters);
  return filters
    ? {
        type: GET_DATA_FROM_PROVIDER,
        path: path,
        request: {
          op: 'post',
          path: path + '/@connector-data/',
          data: { query: filters },
        },
      }
    : {
        type: GET_DATA_FROM_PROVIDER,
        path: path,
        request: {
          op: 'get',
          path: path + '/@connector-data/',
        },
      };
}

export function setConnectedDataParameters(
  path,
  parameters,
  index,
  manuallySet = false,
) {
  return {
    type: SET_CONNECTED_DATA_PARAMETERS,
    path,
    parameters,
    index,
    manuallySet,
  };
}

export function deleteConnectedDataParameters(path, index) {
  return {
    type: DELETE_CONNECTED_DATA_PARAMETERS,
    path,
    index,
  };
}
