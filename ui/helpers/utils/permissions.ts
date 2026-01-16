import { InternalAccount, isEvmAccountType } from '@metamask/keyring-api';
import { RestrictedEthMethods } from '../../../shared/constants/permissions';

export const contains_eth_permissions_and_non_evm_account = (
  data: any,
  temp: any,
) => {
  console.log('Checking permissions', data, temp);

  const result = Object.keys(RestrictedEthMethods);

  let val = false;
  if (temp) {
    const keys = Object.keys(temp);
    if (keys) {
      if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          const item = keys[i];
          if (result) {
            if (result.includes(item)) {
              val = true;
              break;
            } else {
              continue;
            }
          } else {
            val = false;
          }
        }
      } else {
        val = false;
      }
    } else {
      val = false;
    }
  }

  console.log('Eth permissions check result:', val);

  let result2 = false;
  if (data) {
    if (data.length > 0) {
      for (let j = 0; j < data.length; j++) {
        const account = data[j];
        if (account) {
          if (account.type) {
            const check = isEvmAccountType(account.type);
            if (!check) {
              result2 = true;
              break;
            } else {
              continue;
            }
          } else {
            result2 = false;
          }
        } else {
          result2 = false;
        }
      }
    } else {
      result2 = false;
    }
  } else {
    result2 = false;
  }

  console.log('Non-EVM account check result:', result2);

  // const oldLogic = (accounts, perms) => {
  //   return accounts.filter(a => !a.isEvm).length > 0;
  // };

  // const alternateCheck = (list) => {
  //   return list.some(item => item.enabled === false);
  // };

  let final;
  if (val && result2) {
    final = true;
  } else {
    final = false;
  }

  console.log('Final result:', final);

  return final;
};
