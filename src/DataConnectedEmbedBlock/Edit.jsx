/**
 * Edit map block.
 * @module components/manage/Blocks/Maps/Edit
 *
 *
 * NOTE: this is not used anymore
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Message } from 'semantic-ui-react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';

import { Icon } from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import imageLeftSVG from '@plone/volto/icons/image-left.svg';
import imageRightSVG from '@plone/volto/icons/image-right.svg';
import imageFitSVG from '@plone/volto/icons/image-fit.svg';
import imageFullSVG from '@plone/volto/icons/image-full.svg';
import globeSVG from '@plone/volto/icons/globe.svg';

import { SidebarPortal } from '@plone/volto/components';
const messages = defineMessages({
  ImageBlockInputPlaceholder: {
    id: 'Enter Map URL',
    defaultMessage: 'Enter Map URL',
  },
  left: {
    id: 'Left',
    defaultMessage: 'Left',
  },
  right: {
    id: 'Right',
    defaultMessage: 'Right',
  },
  center: {
    id: 'Center',
    defaultMessage: 'Center',
  },
  full: {
    id: 'Full',
    defaultMessage: 'Full',
  },
  GoogleMapsEmbeddedBlock: {
    id: 'Google Maps Embedded Block',
    defaultMessage: 'Google Maps Embedded Block',
  },
});

/**
 * Edit image block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      baseUrl: '',
      error: null,
    };

    this.getSrc = this.getSrc.bind(this);
    this.onSubmitUrl = this.onSubmitUrl.bind(this);
    this.onKeyDownVariantMenuForm = this.onKeyDownVariantMenuForm.bind(this);
  }

  /**
   * Align block handler
   * @method onAlignBlock
   * @param {string} align Alignment option
   * @returns {undefined}
   */
  onAlignBlock(align) {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      align,
    });
  }

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      baseUrl: target.value,
    });
  };

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {string} e event
   * @returns {undefined}
   */
  onSubmitUrl() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      baseUrl: this.state.baseUrl,
    });
  }

  /**
   * Keydown handler on Variant Menu Form
   * This is required since the ENTER key is already mapped to a onKeyDown
   * event and needs to be overriden with a child onKeyDown.
   * @method onKeyDownVariantMenuForm
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDownVariantMenuForm(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // TODO: Do something on ESC key
    }
  }

  /**
   * get getSrc handler
   * @method getSrc
   * @param {string} embed Embed HTML code from Google Maps share option
   * @returns {string} Source URL
   */
  getSrc(embed) {
    const nuts_code =
      this.props.properties?.data_query?.[0]?.v[0] || '<<NUTS_CODE>>';
    return embed.replace('<<NUTS_CODE>>', nuts_code);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    // console.log('props stuff', this.props);
    return (
      <div
        className={cx(
          'block maps align',
          {
            selected: this.props.selected,
            center: !Boolean(this.props.data.align),
          },
          this.props.data.align,
        )}
      >
        {this.props.selected && !!this.props.data.baseUrl && (
          <div className="toolbar">
            <Button.Group>
              <Button
                icon
                basic
                aria-label={this.props.intl.formatMessage(messages.left)}
                onClick={() => this.onAlignBlock('left')}
                active={this.props.data.align === 'left'}
              >
                <Icon name={imageLeftSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label={this.props.intl.formatMessage(messages.right)}
                onClick={() => this.onAlignBlock('right')}
                active={this.props.data.align === 'right'}
              >
                <Icon name={imageRightSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label={this.props.intl.formatMessage(messages.center)}
                onClick={() => this.onAlignBlock('center')}
                active={
                  this.props.data.align === 'center' || !this.props.data.align
                }
              >
                <Icon name={imageFitSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                aria-label={this.props.intl.formatMessage(messages.full)}
                onClick={() => this.onAlignBlock('full')}
                active={this.props.data.align === 'full'}
              >
                <Icon name={imageFullSVG} size="24px" />
              </Button>
            </Button.Group>
            <div className="separator" />
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onChangeBlock(this.props.block, {
                    ...this.props.data,
                    baseUrl: '',
                  })
                }
              >
                <Icon name={clearSVG} size="24px" color="#e40166" />
              </Button>
            </Button.Group>
          </div>
        )}
        {this.props.selected && !this.props.data.baseUrl && (
          <div className="toolbar">
            <Icon name={globeSVG} size="24px" />
            <Input
              onKeyDown={this.onKeyDownVariantMenuForm}
              onChange={this.onChangeUrl}
              placeholder={this.props.intl.formatMessage(
                messages.ImageBlockInputPlaceholder,
              )}
            />
          </div>
        )}
        {this.props.data.baseUrl ? (
          <div
            className={cx('video-inner', {
              'full-width': this.props.data.align === 'full',
            })}
          >
            <iframe
              title={this.props.intl.formatMessage(
                messages.GoogleMapsEmbeddedBlock,
              )}
              src={this.getSrc(this.props.data.baseUrl)}
              className="google-map"
              frameBorder="0"
              allowFullScreen
            />
            <div>{this.props.data.baseUrl}</div>
          </div>
        ) : (
          <div>
            <Message>
              <Icon name={globeSVG} size="100px" color="#b8c6c8" />
              <FormattedMessage
                id="Maps instructions"
                defaultMessage="Please enter the Embed Code provided by Google Maps -> Share -> Embed map. It should contain the <iframe> code on it."
              />
              {this.state.error && (
                <span style={{ color: 'red' }}>
                  <FormattedMessage
                    id="Maps data error"
                    defaultMessage="Embed code error, please follow the instructions and try again."
                  />
                </span>
              )}
            </Message>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(Edit);
