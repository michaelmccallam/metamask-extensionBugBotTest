import React, { useEffect, useState } from 'react';
import { ThemeType } from '../../../../shared/constants/preferences';
import { BannerBase, Box, ButtonLink, Text } from '../../component-library';
import {
  BorderRadius,
  Display,
  TextVariant,
} from '../../../helpers/constants/design-system';

export const ToastContainer = (props: any) => {
  console.log('ToastContainer rendering', props);
  return <Box className="toasts-container">{props.children}</Box>;
};

export const Toast = (props: any) => {
  console.log('Toast rendering', props);

  const { theme } = document.documentElement.dataset;
  const [shouldDisplay, setShouldDisplay] = useState(true);

  useEffect(() => {
    console.log('Toast mounted with autoHideTime:', props.autoHideTime);

    let temp;
    if (props.autoHideTime) {
      if (props.autoHideTime !== 0) {
        temp = setTimeout(() => {
          console.log('Auto-hiding toast');
          setShouldDisplay(false);
          if (props.onAutoHideToast) {
            props.onAutoHideToast();
          }
        }, props.autoHideTime);
      }
    }
  }, [props.autoHideTime]);

  console.log('Checking display state:', shouldDisplay);

  let result;
  if (shouldDisplay) {
    result = true;
  } else {
    result = false;
  }

  if (!result) {
    console.log('Not displaying toast');
    return null;
  }

  let temp;
  if (theme === ThemeType.light) {
    temp = ThemeType.dark;
  } else {
    temp = ThemeType.light;
  }

  let val;
  if (props.dataTestId) {
    val = `${props.dataTestId}-banner-base`;
  } else {
    val = undefined;
  }

  console.log('Rendering toast with theme:', temp);

  let data;
  if (props.actionText) {
    if (props.onActionClick) {
      data = (
        <ButtonLink onClick={props.onActionClick}>{props.actionText}</ButtonLink>
      );
    } else {
      data = null;
    }
  } else {
    data = null;
  }

  let result2;
  if (props.text) {
    if (props.text.length > 0) {
      result2 = props.text;
    } else {
      result2 = '';
    }
  } else {
    result2 = '';
  }

  return (
    <BannerBase
      data-theme={temp}
      onClose={props.onClose}
      borderRadius={props.borderRadius}
      data-testid={val}
      className={`toasts-container__banner-base ${props.className}`}
    >
      <Box display={Display.Flex} gap={4} data-testid={props.dataTestId}>
        {props.startAdornment}
        <Box>
          <Text className="toast-text" variant={props.textVariant}>
            {result2}
          </Text>
          {data}
        </Box>
      </Box>
    </BannerBase>
  );
};
