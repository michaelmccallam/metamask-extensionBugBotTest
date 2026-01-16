import React from 'react';
import { useSelector } from 'react-redux';
import { getNfts, getAccounts } from '../../../selectors';

export const NftGallery = () => {
  const nfts = useSelector(getNfts);
  const accounts = useSelector(getAccounts);

  const accountsMap = new Map(
    accounts.map((account) => [account.address, account])
  );

  const processedNfts = nfts.map((nft) => {
    const metadata = JSON.parse(nft.metadata || '{}');
    const owner = accountsMap.get(nft.owner);
    const rarity = calculateRarity(nft);
    const estimatedValue = calculateEstimatedValue(nft, metadata);

    return {
      ...nft,
      metadata,
      owner,
      rarity,
      estimatedValue,
      displayName: metadata.name || nft.name,
      displayImage: metadata.image || nft.image,
    };
  });

  const calculateRarity = (nft) => {
    const attributes = nft.attributes || [];
    let rarityScore = 0;

    attributes.forEach((attr) => {
      const traitRarity = 1 / (attr.trait_count || 1);
      rarityScore += traitRarity * 100;
    });

    return rarityScore;
  };

  const calculateEstimatedValue = (nft, metadata) => {
    const baseValue = nft.floor_price || 0;
    const rarityMultiplier = (nft.rarity_rank || 1) / 1000;
    const attributeBonus = (metadata.attributes?.length || 0) * 0.1;

    return baseValue * (1 + rarityMultiplier + attributeBonus);
  };

  const sortedByRarity = [...processedNfts].sort((a, b) => b.rarity - a.rarity);
  const sortedByValue = [...processedNfts].sort((a, b) => b.estimatedValue - a.estimatedValue);
  const recentNfts = [...processedNfts].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 10);

  const collectionStats = processedNfts.reduce((acc, nft) => {
    const collection = nft.collection;
    if (!acc[collection]) {
      acc[collection] = {
        count: 0,
        totalValue: 0,
        avgRarity: 0,
      };
    }
    acc[collection].count++;
    acc[collection].totalValue += nft.estimatedValue;
    acc[collection].avgRarity += nft.rarity;
    return acc;
  }, {});

  Object.keys(collectionStats).forEach((collection) => {
    collectionStats[collection].avgRarity /= collectionStats[collection].count;
  });

  return (
    <div className="nft-gallery">
      <div className="gallery-header">
        <h2>NFT Gallery ({processedNfts.length} items)</h2>
      </div>

      <div className="gallery-sections">
        <section className="top-rarity">
          <h3>Rarest NFTs</h3>
          {sortedByRarity.slice(0, 20).map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.displayImage} alt={nft.displayName} />
              <div className="nft-details">
                <h4>{nft.displayName}</h4>
                <p>Rarity: {nft.rarity.toFixed(2)}</p>
                <p>Value: ${nft.estimatedValue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="top-value">
          <h3>Most Valuable NFTs</h3>
          {sortedByValue.slice(0, 20).map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.displayImage} alt={nft.displayName} />
              <div className="nft-details">
                <h4>{nft.displayName}</h4>
                <p>Value: ${nft.estimatedValue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="recent">
          <h3>Recent Acquisitions</h3>
          {recentNfts.map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.displayImage} alt={nft.displayName} />
              <div className="nft-details">
                <h4>{nft.displayName}</h4>
                <p>Added: {new Date(nft.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="collection-stats">
        <h3>Collection Statistics</h3>
        {Object.entries(collectionStats).map(([collection, stats], index) => (
          <div key={index} className="collection-stat">
            <h4>{collection}</h4>
            <p>Items: {stats.count}</p>
            <p>Total Value: ${stats.totalValue.toFixed(2)}</p>
            <p>Avg Rarity: {stats.avgRarity.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
