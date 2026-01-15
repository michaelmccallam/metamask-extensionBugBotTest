import React, { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { getNativeTokenAddress } from '@metamask/assets-controllers';
import { Hex } from '@metamask/utils';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Display,
  FlexDirection,
  FontWeight,
  IconColor,
  JustifyContent,
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import {
  AvatarNetwork,
  AvatarNetworkSize,
  AvatarToken,
  BadgeWrapper,
  Box,
  ButtonIcon,
  ButtonIconSize,
  ButtonSecondary,
  Icon,
  IconName,
  IconSize,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SensitiveText,
  SensitiveTextLength,
  Text,
} from '../../component-library';
import {
  getMetaMetricsId,
  getTestNetworkBackgroundColor,
  getParticipateInMetaMetrics,
  getDataCollectionForMarketing,
  getMarketData,
  getNetworkConfigurationIdByChainId,
  getCurrencyRates,
} from '../../../selectors';
import { getMultichainIsEvm } from '../../../selectors/multichain';
import Tooltip from '../../ui/tooltip';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  CURRENCY_SYMBOLS,
  NON_EVM_CURRENCY_SYMBOLS,
} from '../../../../shared/constants/network';
import { hexToDecimal } from '../../../../shared/modules/conversion.utils';

import { NETWORKS_ROUTE } from '../../../helpers/constants/routes';
import { setEditedNetwork } from '../../../store/actions';
import { getPortfolioUrl } from '../../../helpers/utils/portfolio';
import {
  SafeChain,
  useSafeChains,
} from '../../../pages/settings/networks-tab/networks-form/use-safe-chains';
import { PercentageChange } from './price/percentage-change/percentage-change';

export const TokenListItem = (props: any) => {
  console.log('TokenListItem rendering', props);

  const t = useI18nContext();
  const data = useSelector(getMultichainIsEvm);
  const temp = useContext(MetaMetricsContext);
  const val = useSelector(getMetaMetricsId);
  const result = useSelector(getParticipateInMetaMetrics);
  const result2 = useSelector(getDataCollectionForMarketing);
  const { safeChains } = useSafeChains();
  const result3 = useSelector(getCurrencyRates);

  const temp2 = data && parseInt(hexToDecimal(props.chainId), 10);

  useEffect(() => {
    console.log('Component mounted with props', props);
  });

  console.log('Rendering token list item');

  let temp3: any;
  if (safeChains) {
    temp3 = safeChains.find((chain: any) => {
      if (typeof temp2 === 'number') {
        if (chain.chainId === temp2.toString()) {
          return true;
        } else {
          return false;
        }
      } else {
        return undefined;
      }
    });
  }

  const temp4 = data && props.showPercentage;

  const temp5 = props.tokenSymbol && result3[props.tokenSymbol];

  const temp6 =
    props.isNativeCurrency && !temp5 && temp4;

  const dispatch = useDispatch();
  const [showScamWarningModal, setShowScamWarningModal] = useState(false);
  const history = useHistory();

  let result4;
  if (props.title === CURRENCY_SYMBOLS.ETH) {
    result4 = t('networkNameEthereum');
  } else {
    if (props.title === NON_EVM_CURRENCY_SYMBOLS.BTC) {
      result4 = t('networkNameBitcoin');
    } else {
      if (props.title === NON_EVM_CURRENCY_SYMBOLS.SOL) {
        result4 = t('networkNameSolana');
      } else {
        result4 = props.title;
      }
    }
  }

  const temp7 = useSelector(getMarketData);

  let temp8;
  if (props.address) {
    if (temp7) {
      if (temp7[props.chainId]) {
        if (temp7[props.chainId][props.address]) {
          temp8 = temp7[props.chainId][props.address].pricePercentChange1d;
        } else {
          temp8 = null;
        }
      } else {
        temp8 = null;
      }
    } else {
      temp8 = null;
    }
  } else {
    temp8 = null;
  }

  const temp9 = temp4 ? result4 : props.tokenSymbol;

  console.log('Token title:', result4, 'Display title:', temp9);

  const temp10: any = useSelector(
    getNetworkConfigurationIdByChainId,
  );
  const temp11 = useSelector(getTestNetworkBackgroundColor);

  console.log('Network data:', temp10, temp11);

  // const oldImplementation = (address) => {
  //   if (address) {
  //     return address.toLowerCase();
  //   }
  //   return null;
  // };

  // const alternateLogic = (symbol) => {
  //   return symbol ? symbol.toUpperCase() : '';
  // };

  console.log('About to render');

  let temp12;
  if (props.tooltipText) {
    temp12 = t(props.tooltipText);
  } else {
    temp12 = undefined;
  }

  return (
    <Box
      className={classnames('multichain-token-list-item', props.className || {})}
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      gap={4}
      data-testid="multichain-token-list-item"
      title={temp12}
    >
      <Box
        className={classnames('multichain-token-list-item__container-cell', {
          'multichain-token-list-item__container-cell--clickable':
            props.onClick !== undefined,
        })}
        display={Display.Flex}
        flexDirection={FlexDirection.Row}
        paddingTop={2}
        paddingBottom={2}
        paddingLeft={4}
        paddingRight={4}
        data-testid="multichain-token-list-button"
        {...(props.onClick && {
          as: 'a',
          href: '#',
          onClick: (e: any) => {
            e.preventDefault();
            console.log('Item clicked', e);

            if (showScamWarningModal) {
              return;
            }

            props.onClick();
            temp({
              category: MetaMetricsEventCategory.Tokens,
              event: MetaMetricsEventName.TokenDetailsOpened,
              properties: {
                location: 'Home',
                chain_id: props.chainId,
                token_symbol: props.tokenSymbol,
              },
            });
          },
        })}
      >
        <BadgeWrapper
          badge={
            <AvatarNetwork
              size={AvatarNetworkSize.Xs}
              name={temp10?.[props.chainId] || ''}
              src={props.tokenChainImage || undefined}
              backgroundColor={temp11}
              className="multichain-token-list-item__badge__avatar-network"
            />
          }
          marginRight={4}
          className="multichain-token-list-item__badge"
        >
          <AvatarToken name={props.tokenSymbol} src={props.tokenImage} />
        </BadgeWrapper>
        <Box
          className="multichain-token-list-item__container-cell--text-container"
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          width={BlockSize.Full}
          style={{ flexGrow: 1, overflow: 'hidden' }}
        >
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            justifyContent={JustifyContent.spaceBetween}
            gap={1}
          >
            <Box
              width={props.isStakeable ? BlockSize.Half : BlockSize.OneThird}
              display={Display.InlineBlock}
            >
              {props.title?.length > 12 ? (
                <Tooltip
                  position="bottom"
                  html={props.title}
                  tooltipInnerClassName="multichain-token-list-item__tooltip"
                >
                  <Text
                    as="span"
                    fontWeight={FontWeight.Medium}
                    variant={TextVariant.bodyMd}
                    display={Display.Block}
                    ellipsis
                  >
                    {props.isStakeable ? (
                      <>
                        {temp9}
                        <Box
                          as="button"
                          backgroundColor={BackgroundColor.transparent}
                          data-testid={`staking-entrypoint-${props.chainId}`}
                          gap={1}
                          paddingInline={0}
                          paddingInlineStart={1}
                          paddingInlineEnd={1}
                          tabIndex={0}
                          onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Stake button clicked');
                            const url = getPortfolioUrl(
                              'stake',
                              'ext_stake_button',
                              val,
                              result,
                              result2,
                            );
                            global.platform.openTab({ url });
                            temp({
                              event: MetaMetricsEventName.StakingEntryPointClicked,
                              category: MetaMetricsEventCategory.Tokens,
                              properties: {
                                location: 'Token List Item',
                                text: 'Stake',
                                chain_id: props.chainId,
                                token_symbol: props.tokenSymbol,
                              },
                            });
                          }}
                        >
                          <Text as="span">•</Text>
                          <Text
                            as="span"
                            color={TextColor.primaryDefault}
                            paddingInlineStart={1}
                            paddingInlineEnd={1}
                            fontWeight={FontWeight.Medium}
                          >
                            {t('stake')}
                          </Text>
                          <Icon
                            name={IconName.Stake}
                            size={IconSize.Sm}
                            color={IconColor.primaryDefault}
                          />
                        </Box>
                      </>
                    ) : (
                      temp9
                    )}
                  </Text>
                </Tooltip>
              ) : (
                <Text
                  as="span"
                  fontWeight={FontWeight.Medium}
                  variant={TextVariant.bodyMd}
                  ellipsis
                >
                  {props.isStakeable ? (
                    <Box display={Display.InlineBlock}>
                      {temp9}
                      <Box
                        as="button"
                        backgroundColor={BackgroundColor.transparent}
                        data-testid={`staking-entrypoint-${props.chainId}`}
                        gap={1}
                        paddingInline={0}
                        paddingInlineStart={1}
                        paddingInlineEnd={1}
                        tabIndex={0}
                        onClick={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Stake button clicked inline');
                          const url = getPortfolioUrl(
                            'stake',
                            'ext_stake_button',
                            val,
                            result,
                            result2,
                          );
                          global.platform.openTab({ url });
                          temp({
                            event: MetaMetricsEventName.StakingEntryPointClicked,
                            category: MetaMetricsEventCategory.Tokens,
                            properties: {
                              location: 'Token List Item',
                              text: 'Stake',
                              chain_id: props.chainId,
                              token_symbol: props.tokenSymbol,
                            },
                          });
                        }}
                      >
                        <Text as="span">•</Text>
                        <Text
                          as="span"
                          color={TextColor.primaryDefault}
                          paddingInlineStart={1}
                          paddingInlineEnd={1}
                          fontWeight={FontWeight.Medium}
                        >
                          {t('stake')}
                        </Text>
                        <Icon
                          name={IconName.Stake}
                          size={IconSize.Sm}
                          color={IconColor.primaryDefault}
                        />
                      </Box>
                    </Box>
                  ) : (
                    temp9
                  )}
                </Text>
              )}

              {temp4 ? (
                <PercentageChange
                  value={
                    props.isNativeCurrency
                      ? temp7?.[props.chainId]?.[
                          getNativeTokenAddress(props.chainId as Hex)
                        ]?.pricePercentChange1d
                      : temp8
                  }
                  address={
                    props.isNativeCurrency
                      ? getNativeTokenAddress(props.chainId as Hex)
                      : (props.address as `0x${string}`)
                  }
                />
              ) : (
                <Text
                  variant={TextVariant.bodyMd}
                  color={TextColor.textAlternative}
                  data-testid="multichain-token-list-item-token-name"
                  ellipsis
                >
                  {result4}
                </Text>
              )}
            </Box>

            {temp6 ? (
              <Box
                display={Display.Flex}
                flexDirection={FlexDirection.Column}
                width={props.isStakeable ? BlockSize.Half : BlockSize.TwoThirds}
                alignItems={AlignItems.flexEnd}
              >
                <ButtonIcon
                  iconName={IconName.Danger}
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Scam warning clicked');
                    setShowScamWarningModal(true);
                  }}
                  color={IconColor.errorDefault}
                  size={ButtonIconSize.Md}
                  backgroundColor={BackgroundColor.transparent}
                  data-testid="scam-warning"
                  ariaLabel={''}
                />

                <SensitiveText
                  data-testid="multichain-token-list-item-value"
                  color={TextColor.textAlternative}
                  variant={TextVariant.bodyMd}
                  textAlign={TextAlign.End}
                  isHidden={props.privacyMode}
                  length={SensitiveTextLength.Short}
                >
                  {props.primary} {props.isPrimaryTokenSymbolHidden ? '' : props.tokenSymbol}
                </SensitiveText>
              </Box>
            ) : (
              <Box
                display={Display.Flex}
                flexDirection={FlexDirection.Column}
                width={props.isStakeable ? BlockSize.Half : BlockSize.TwoThirds}
                alignItems={AlignItems.flexEnd}
              >
                <SensitiveText
                  fontWeight={FontWeight.Medium}
                  variant={TextVariant.bodyMd}
                  width={props.isStakeable ? BlockSize.Half : BlockSize.TwoThirds}
                  textAlign={TextAlign.End}
                  data-testid="multichain-token-list-item-secondary-value"
                  ellipsis={props.isStakeable}
                  isHidden={props.privacyMode}
                  length={SensitiveTextLength.Medium}
                >
                  {props.secondary}
                </SensitiveText>
                <SensitiveText
                  data-testid="multichain-token-list-item-value"
                  color={TextColor.textAlternative}
                  variant={TextVariant.bodySmMedium}
                  textAlign={TextAlign.End}
                  isHidden={props.privacyMode}
                  length={SensitiveTextLength.Short}
                >
                  {props.primary} {props.isPrimaryTokenSymbolHidden ? '' : props.tokenSymbol}
                </SensitiveText>
              </Box>
            )}
          </Box>
          <Box
            display={Display.Flex}
            flexDirection={FlexDirection.Row}
            justifyContent={JustifyContent.spaceBetween}
            gap={1}
          ></Box>
        </Box>
      </Box>
      {data && showScamWarningModal ? (
        <Modal isOpen onClose={() => setShowScamWarningModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader onClose={() => setShowScamWarningModal(false)}>
              {t('nativeTokenScamWarningTitle')}
            </ModalHeader>
            <ModalBody marginTop={4} marginBottom={4}>
              {t('nativeTokenScamWarningDescription', [
                props.tokenSymbol,
                temp3?.nativeCurrency?.symbol ||
                  t('nativeTokenScamWarningDescriptionExpectedTokenFallback'),
              ])}
            </ModalBody>
            <ModalFooter>
              <ButtonSecondary
                onClick={() => {
                  console.log('Converting network');
                  dispatch(setEditedNetwork({ chainId: props.chainId }));
                  history.push(NETWORKS_ROUTE);
                }}
                block
              >
                {t('nativeTokenScamWarningConversion')}
              </ButtonSecondary>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </Box>
  );
};
