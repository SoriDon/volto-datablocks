import React from 'react';
import { Icon } from '@plone/volto/components';
import { Table, Menu } from 'semantic-ui-react';
import RenderComponent from '../../components';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

const View = (props) => {
  const {
    data = {},
    pagination = {},
    updatePagination = () => {},
    getAlignmentOfColumn,
    getTitleOfColumn,
    getNameOfColumn,
    selectedColumns,
    tableData,
    show_header,
    has_pagination,
    row_size,
  } = props;

  return (
    <div className="default-table">
      {row_size ? (
        <Table
          textAlign="left"
          striped={data.striped}
          className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header ? (
            <Table.Header>
              <Table.Row>
                {selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    {getTitleOfColumn(colDef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {Array(Math.max(0, row_size))
              .fill()
              .map((_, i) => (
                <Table.Row key={i}>
                  {selectedColumns.map((colDef, j) => (
                    <Table.Cell
                      key={`${i}-${getNameOfColumn(colDef)}`}
                      textAlign={getAlignmentOfColumn(colDef, j)}
                    >
                      <RenderComponent
                        tableData={tableData}
                        colDef={colDef}
                        row={i}
                        {...props}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
          {has_pagination ? (
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell
                  colSpan={selectedColumns.length}
                  style={{ textAlign: 'center' }}
                >
                  <Menu pagination>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={props.isPending || pagination.activePage === 1}
                      onClick={() => {
                        if (pagination.activePage > 1) {
                          updatePagination({
                            activePage: pagination.activePage - 1,
                          });
                        }
                      }}
                    >
                      <Icon name={leftSVG} size="24px" />
                    </Menu.Item>
                    <Menu.Item
                      as="a"
                      icon
                      disabled={
                        props.isPending ||
                        row_size < pagination.itemsPerPage ||
                        pagination.activePage * pagination.itemsPerPage >=
                          pagination.maxItems
                      }
                      onClick={() => {
                        if (row_size === pagination.itemsPerPage) {
                          updatePagination({
                            activePage: pagination.activePage + 1,
                          });
                        }
                      }}
                    >
                      <Icon name={rightSVG} size="24px" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          ) : null}
        </Table>
      ) : (
        'No results'
      )}
    </div>
  );
};

export default View;