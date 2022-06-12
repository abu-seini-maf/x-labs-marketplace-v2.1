import { useEffect, useState } from "react";
import { useNFTTokenIds } from "./useNFTTokenIds";

export const useNFTsByContracts = (contracts) => {
  const [NFTs, setNFTs] = useState([]);
  const [NFTsTotal, setNFTsTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    NFTTokenIds,
    totalNFTs,
    fetchSuccess,
    error,
    isLoading,
  } = useNFTTokenIds(contracts?.[currentIndex]?.addrs);

  useEffect(async () => {
    if (currentIndex > contracts?.length - 1 || NFTTokenIds.length === 0) return;
    const updatesTokens = NFTTokenIds.map((nft) => ({...nft, category: contracts?.[currentIndex]?.category}));
    setNFTs(old => [...old, ...updatesTokens]);
    setNFTsTotal(old => {
      if (old === undefined || isNaN(old)) {
        old = 0;
      }
      if (totalNFTs === undefined || isNaN(totalNFTs)) {
        return old + 0;
      } else {
        return old + totalNFTs;
      }
    });
    setCurrentIndex((index) => ++index);
  }, [NFTTokenIds]);

  return {
    NFTs,
    NFTsTotal,
    fetchSuccess,
    error,
    isLoading,
  };
};
