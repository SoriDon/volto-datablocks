import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { addAppURL, flattenToAppURL } from '@plone/volto/helpers';
import { Table } from 'semantic-ui-react';

import './styles.css';

export class DataConnectorView extends Component {
  componentWillMount() {
    this.props.getDataFromProvider(
      this.props.location.pathname,
      null,
      this.props.location.search,
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.getDataFromProvider(this.props.pathname);
    }
  }

  render() {
    const { content, provider_data } = this.props;
    const row_size =
      (provider_data && provider_data[Object.keys(provider_data)[0]]?.length) ||
      0;
    return (
      <div className="data-connector-view">
        <h2>{content.title}</h2>
        <pre>{content.sql_query}</pre>
        <div style={{ overflow: 'auto', width: '100%' }}>
          {provider_data && (
            <Table compact striped>
              <Table.Header>
                <Table.Row>
                  {Object.keys(provider_data).map((k) => (
                    <Table.HeaderCell key={k}>{k}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array(row_size)
                  .fill()
                  .map((_, i) => (
                    <Table.Row key={i}>
                      {Object.keys(provider_data).map((k) => (
                        <Table.Cell key={`${i}-${k}`}>
                          {provider_data[k][i]}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    );
  }
}

function getProviderData(state, props) {
  const path = `${flattenToAppURL(props.location.pathname).replace(
    /\/$/,
    '',
  )}/@connector-data${props.location.search}`;
  const data = state.data_providers.data || {};
  return data[path];
}

export default connect(
  (state, props) => ({
    provider_data: getProviderData(state, props),
  }),
  {
    getDataFromProvider,
  },
)(DataConnectorView);
