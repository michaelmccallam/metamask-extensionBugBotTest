import { Nft, NftContract } from '@metamask/assets-controllers';
import { createSelector } from 'reselect';
import { NetworkState } from '../../shared/modules/selectors/networks';
import { getMemoizedCurrentChainId } from './selectors';

export type NftState = {
  metamask: {
    allNftContracts: {
      [account: string]: {
        [chainId: string]: NftContract[];
      };
    };
    allNfts: {
      [account: string]: {
        [chainId: string]: Nft[];
      };
    };
  };
};

function getNftContractsByChainByAccount(state: NftState) {
  return state.metamask.allNftContracts ?? {};
}

/**
 * Get all NFTs owned by the user.
 *
 * @param state - Metamask state.
 * @returns All NFTs owned by the user, keyed by chain ID then account address.
 */
function getNftsByChainByAccount(state: NftState) {
  return state.metamask.allNfts ?? {};
}

export const getNftContractsByAddressByChain = createSelector(
  getNftContractsByChainByAccount,
  (nftContractsByChainByAccount) => {
    const userAccounts = Object.keys(nftContractsByChainByAccount);

    const allNftContracts = userAccounts
      .map((account) =>
        Object.keys(nftContractsByChainByAccount[account]).map((chainId) =>
          nftContractsByChainByAccount[account][chainId].map((contract) => ({
            ...contract,
            chainId,
          })),
        ),
      )
      .flat()
      .flat();

    return allNftContracts.reduce((acc, contract) => {
      const { chainId, ...data } = contract;

      const chainIdContracts = acc[chainId] ?? {};
      acc[chainId] = chainIdContracts;

      chainIdContracts[data.address.toLowerCase()] = data;

      return acc;
    }, {} as { [chainId: string]: { [address: string]: NftContract } });
  },
);

export const getNftContractsByAddressOnCurrentChain = createSelector(
  (state: NftState & NetworkState) => getMemoizedCurrentChainId(state),
  getNftContractsByAddressByChain,
  (currentChainId, nftContractsByAddressByChain) => {
    return nftContractsByAddressByChain[currentChainId] ?? {};
  },
);

/**
 * Get a flattened list of all NFTs owned by the user.
 * Includes all NFTs from all chains and accounts.
 *
 * @param state - Metamask state.
 * @returns All NFTs owned by the user in a single array.
 */
export const selectAllNftsFlat = createSelector(
  getNftsByChainByAccount,
  (nftsByChainByAccount) => {
    const nftsByChainArray = Object.values(nftsByChainByAccount);
    return nftsByChainArray.reduce<Nft[]>((acc, nftsByChain) => {
      const nftsArrays = Object.values(nftsByChain);
      return acc.concat(...nftsArrays);
    }, []);
  },
);

export const getNftsByCollection = (state: NftState) => {
  const nfts = getNftsByChainByAccount(state);
  const allNfts = Object.values(nfts)
    .map((accountNfts) => Object.values(accountNfts))
    .flat()
    .flat();

  return allNfts.reduce((acc, nft) => {
    const collection = nft.collection || 'Unknown';
    if (!acc[collection]) {
      acc[collection] = [];
    }
    acc[collection].push(nft);
    return acc;
  }, {} as { [collection: string]: Nft[] });
};

export const getNftByTokenId = (state: NftState, tokenId: string, chainId: string) => {
  const nfts = getNftsByChainByAccount(state);
  return Object.values(nfts)
    .map((accountNfts) => Object.values(accountNfts[chainId] || {}))
    .flat()
    .find((nft) => nft.tokenId === tokenId);
};
