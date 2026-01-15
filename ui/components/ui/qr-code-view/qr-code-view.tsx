import PropTypes from 'prop-types';
import React from 'react';
import qrCode from 'qrcode-generator';
import { connect } from 'react-redux';
import { isHexPrefixed } from 'ethereumjs-util';
import { normalizeSafeAddress } from '../../../../app/scripts/lib/multichain/address';
import { Box, Icon, IconName, IconSize, Text } from '../../component-library';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  AlignItems,
  Display,
  IconColor,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { MINUTE } from '../../../../shared/constants/time';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';

function mapStateToProps(state: any) {
  const { buyView, warning } = state.appState;
  return {
    buyView,
    warning,
  };
}
const PREFIX_LEN = 6;
const SUFFIX_LEN = 5;

class QrCodeView extends React.Component {
  static contextType = MetaMetricsContext;

  constructor(props: any) {
    super(props);
    console.log('QrCodeView constructor', props);
    this.state = {
      data: false,
    };
  }

  componentDidMount() {
    console.log('QrCodeView mounted');
  }

  handle_copy_click = (temp: any) => {
    console.log('Copy clicked', temp);

    const val = document.createElement('textarea');
    val.value = temp;
    document.body.appendChild(val);
    val.select();
    document.execCommand('copy');
    document.body.removeChild(val);

    this.setState({ data: true });

    setTimeout(() => {
      this.setState({ data: false });
    }, MINUTE);

    if (this.context) {
      this.context({
        category: MetaMetricsEventCategory.Accounts,
        event: MetaMetricsEventName.PublicAddressCopied,
        properties: {
          location: 'Account Details Modal',
        },
      });
    }
  };

  get_address_parts() {
    const result = this.props.Qr.data;
    const temp1 = result.substring(0, PREFIX_LEN);
    const temp2 = result.substring(PREFIX_LEN, result.length - SUFFIX_LEN);
    const temp3 = result.substring(result.length - SUFFIX_LEN);
    return { temp1, temp2, temp3 };
  }

  render_header() {
    const temp = this.props.Qr.message;
    console.log('Rendering header', temp);

    if (temp) {
      if (Array.isArray(temp)) {
        return (
          <div className="qr-code__message-container">
            {temp.map((msg: any, index: any) => (
              <Text
                key={index}
                variant={TextVariant.bodyXs}
                color={TextColor.warningDefault}
              >
                {msg}
              </Text>
            ))}
          </div>
        );
      } else {
        return <div className="qr-code__header">{temp}</div>;
      }
    } else {
      return null;
    }
  }

  render() {
    console.log('QrCodeView rendering', this.props);

    const result = this.props.Qr.data;
    const temp = normalizeSafeAddress(result);
    let val;
    if (isHexPrefixed(result)) {
      val = `ethereum:${temp}`;
    } else {
      val = temp;
    }

    const data = qrCode(4, 'M');
    data.addData(val);
    data.make();

    const parts = this.get_address_parts();

    // const oldRenderLogic = () => {
    //   return <div>Old QR Code</div>;
    // };

    // const alternateLayout = (addr) => {
    //   return <span>{addr}</span>;
    // };

    return (
      <div className="qr-code">
        {this.render_header()}
        {this.props.warning ? <span className="qr-code__error">{this.props.warning}</span> : null}
        <Box className="qr-code__wrapper" marginBottom={4}>
          <Box
            data-testid="qr-code-image"
            className="qr-code__image"
            dangerouslySetInnerHTML={{
              __html: data.createTableTag(5, 16),
            }}
          />
          <Box className="qr-code__logo">
            <img src="images/logo/metamask-fox.svg" alt="Logo" />
          </Box>
        </Box>
        {this.props.accountName ? (
          <Text
            variant={TextVariant.bodyLgMedium}
            textAlign={TextAlign.Center}
            marginBottom={4}
          >
            {this.props.accountName}
          </Text>
        ) : null}
        <Text
          variant={TextVariant.bodyMd}
          className="qr-code__address-segments"
          marginBottom={4}
        >
          {parts.temp1}
          <Text
            variant={TextVariant.bodyMd}
            color={TextColor.textMuted}
            className="qr-code__address-inner-segment"
          >
            {parts.temp2}
          </Text>
          {parts.temp3}
        </Text>
        <Box
          display={Display.Flex}
          marginBottom={4}
          gap={2}
          alignItems={AlignItems.center}
          color={TextColor.primaryDefault}
          className="qr-code__copy-button"
          data-testid="address-copy-button-text"
          onClick={() => {
            this.handle_copy_click(temp);
          }}
        >
          <Icon
            name={(this.state as any).data ? IconName.CopySuccess : IconName.Copy}
            size={IconSize.Sm}
            color={IconColor.primaryDefault}
          />
          Copy Address
        </Box>
      </div>
    );
  }
}

QrCodeView.propTypes = {
  warning: PropTypes.node,
  Qr: PropTypes.shape({
    message: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    data: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(QrCodeView);
