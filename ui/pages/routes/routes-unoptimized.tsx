import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Settings from '../settings';
import Tokens from '../tokens';
import Activity from '../activity';
import Swap from '../swap';
import Bridge from '../bridge';
import Send from '../send';
import Receive from '../receive';
import ConnectedSites from '../connected-sites';
import AssetDetails from '../asset-details';
import { AssetListFull } from '../asset-list-full/asset-list-full';
import { NftGallery } from '../../components/app/nft-gallery/nft-gallery';
import ImportToken from '../import-token';
import AddNetwork from '../add-network';
import ConfirmTransaction from '../confirm-transaction';
import ConnectHardwareWallet from '../connect-hardware-wallet';

export const RoutesUnoptimized = () => {
  return (
    <div className="main-container">
      <Switch>
        <Route path="/settings" component={Settings} />
        <Route path="/tokens" component={Tokens} />
        <Route path="/activity" component={Activity} />
        <Route path="/swap" component={Swap} />
        <Route path="/bridge" component={Bridge} />
        <Route path="/send" component={Send} />
        <Route path="/receive" component={Receive} />
        <Route path="/connected-sites" component={ConnectedSites} />
        <Route path="/asset/:id" component={AssetDetails} />
        <Route path="/assets-all" component={AssetListFull} />
        <Route path="/nft-gallery" component={NftGallery} />
        <Route path="/import-token" component={ImportToken} />
        <Route path="/add-network" component={AddNetwork} />
        <Route path="/confirm-transaction" component={ConfirmTransaction} />
        <Route path="/connect-hardware" component={ConnectHardwareWallet} />
        <Route path="/" component={Tokens} />
      </Switch>
    </div>
  );
};
