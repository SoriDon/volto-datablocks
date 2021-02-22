import React from 'react';
import { connect } from 'react-redux';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
// import { Grid } from 'semantic-ui-react';
import { settings } from '~/config';

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line !== '') line += ',';

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(items, fileTitle) {
  // Convert Object to JSON
  let jsonObject = JSON.stringify(items);

  let csv = convertToCSV(jsonObject);

  let exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    let link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      if (document) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}

const SourceView = ({
  initialSource,
  initialSourceLink,
  multipleSources,
  providerUrl,
  data_providers,
  connectorsDataProviders,
  download_button,
}) => {
  return (
    <React.Fragment>
      {(providerUrl || connectorsDataProviders) &&
        (download_button === undefined || download_button === true) && (
          <VoltoIcon
            className="discreet download-button"
            title="Download data"
            onClick={() => {
              const connectorsData = {};
              connectorsDataProviders &&
                Object.keys(connectorsDataProviders).forEach((key) => {
                  if (
                    connectorsDataProviders[key].path &&
                    data_providers?.data?.[
                      `${connectorsDataProviders[key].path}/@connector-data`
                    ]
                  ) {
                    connectorsData[connectorsDataProviders[key].path] =
                      data_providers?.data?.[
                        `${connectorsDataProviders[key].path}/@connector-data`
                      ];
                  }
                });
              const connectorData =
                data_providers?.data?.[`${providerUrl}/@connector-data`];

              if (connectorData) {
                let array = [];
                connectorData &&
                  Object.entries(connectorData).forEach(([key, items]) => {
                    items.forEach((item, index) => {
                      if (!array[index]) array[index] = {};
                      array[index][key] = item;
                    });
                  });
                exportCSVFile(array, providerUrl);
                return;
              }

              if (connectorsData) {
                let title = '';
                let array = [];
                Object.entries(connectorsData).forEach(
                  ([connectorKey, connector]) => {
                    title += connectorKey + ' & ';
                    Object.entries(connector).forEach(([key, items]) => {
                      items.forEach((item, index) => {
                        if (!array[index]) array[index] = {};
                        array[index][key] = item;
                      });
                    });
                  },
                );
                exportCSVFile(array, title.slice(0, -3));
                return;
              }

              if (!providerUrl) return;

              const dlAnchorElem = document.createElement('a');
              dlAnchorElem.setAttribute(
                'href',
                `${settings.apiPath}${providerUrl}/@@download`,
              );
              dlAnchorElem.click();
            }}
            name={downloadSVG}
            size="20px"
          />
        )}

      <div className="sources">
        <span className="discreet">
          {initialSource || (multipleSources && multipleSources.length)
            ? multipleSources && multipleSources.length
              ? 'Sources: '
              : 'Source: '
            : ''}
        </span>
        <a
          className="discreet block_source"
          href={initialSourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {initialSource}
        </a>
        {multipleSources && multipleSources.length
          ? multipleSources.map((item) =>
              item.chart_source_link ? (
                <a
                  key={item.chart_source_link}
                  className="discreet block_source"
                  href={item.chart_source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.chart_source}
                </a>
              ) : (
                <div key={item.chart_source} className="discreet block_source">
                  {item.chart_source}
                </div>
              ),
            )
          : ''}
      </div>
    </React.Fragment>
  );
};

export default connect((state, props) => ({
  data_providers: state.data_providers,
}))(SourceView);