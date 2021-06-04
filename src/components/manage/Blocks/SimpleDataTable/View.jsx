import React from 'react';
import { compose } from 'redux';
import config from '@plone/volto/registry';
import { DefaultView } from './templates/default';

import { connectBlockToProviderData } from '../../../../hocs';
import { serializeNodes } from '../../../../serialize';
import {
  filterDataByParameters,
  connectToDataParameters,
} from '../../../../helpers';

import './styles.less';

const getAlignmentOfColumn = (col, idx) => {
  return typeof col !== 'string' && col.textAlign
    ? col.textAlign
    : idx === 0
    ? 'left'
    : 'right';
};

const getNameOfColumn = (col) => {
  return typeof col === 'string' ? col : col.column;
};

const getTitleOfColumn = (col) => {
  return typeof col === 'string' ? col : col.title || getNameOfColumn(col);
};

const selectedColumnValidator = (allColDefs) => (colDef) => {
  return typeof colDef === 'string'
    ? false
    : allColDefs.includes(colDef?.column);
};

const getProviderData = (provider_data) => {
  return provider_data &&
    Object.keys(provider_data).length &&
    provider_data[Object.keys(provider_data)[0]].length
    ? provider_data
    : null;
};

const SimpleDataTableView = (props) => {
  const { data = {}, pagination = {}, connected_data_parameters = {} } = props;
  const {
    columns,
    description,
    has_pagination = false,
    max_count = 5,
    placeholder = 'No results',
    show_header = false,
    template,
  } = data;

  const provider_data = has_pagination
    ? getProviderData(props.provider_data) ||
      getProviderData(props.prev_provider_data)
    : getProviderData(props.provider_data);

  const tableTemplate = template || 'default';
  const TableView =
    config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[
      tableTemplate
    ]?.view || DefaultView;

  // TODO: sorting
  const row_size =
    has_pagination || max_count > 0
      ? Math.min(pagination.itemsPerPage, pagination.totalItems) || 0
      : pagination.totalItems;
  const providerColumns = Object.keys(provider_data || {});
  const sureToShowAllColumns = !Array.isArray(columns) || columns.length === 0;
  const validator = selectedColumnValidator(providerColumns);
  const selectedColumns = sureToShowAllColumns
    ? providerColumns
    : columns.filter(validator);

  const tableData = connected_data_parameters
    ? filterDataByParameters(provider_data, connected_data_parameters)
    : provider_data;

  return (
    <div className="simple-data-table">
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>

      <TableView
        {...props}
        has_pagination={has_pagination}
        placeholder={placeholder}
        provider_data={provider_data}
        row_size={row_size}
        selectedColumns={selectedColumns}
        show_header={show_header}
        tableData={tableData}
        getAlignmentOfColumn={getAlignmentOfColumn}
        getNameOfColumn={getNameOfColumn}
        getTitleOfColumn={getTitleOfColumn}
      />
    </div>
  );
};

export default compose(connectToDataParameters, (SimpleDataTableView) => {
  return connectBlockToProviderData(SimpleDataTableView, {
    pagination: {
      getEnabled: (props) => props.data.has_pagination,
      getItemsPerPage: (props) => {
        const { max_count = 5 } = props.data;
        return max_count
          ? typeof max_count !== 'number'
            ? parseInt(max_count) || 5
            : max_count
          : max_count || 5;
      },
    },
  });
})(SimpleDataTableView);
