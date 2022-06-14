import { Select, Input, Modal, Card, Tooltip, Image, Badge, Spin, Alert } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";
import { useNFTSearch } from 'hooks/useNFTSearch';
import { useState, useCallback } from 'react';
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { useMoralisQuery, useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import { getNativeByChain } from "helpers/networks";

const styles = {
    NFTs: {
        display: "flex",
        flexWrap: "wrap",
        WebkitBoxPack: "start",
        justifyContent: "center",
        margin: "0 auto",
        maxWidth: "1000px",
        gap: "10px",
        maxHeight: 'calc(100vh - 200px)',
        overflowX: 'scroll'
    },
}

function SearchCollections() {
    const fallbackImg =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==";
    const { Option } = Select;
    const { chainId, marketAddress, contractABI, walletAddress } =
    useMoralisDapp();
    const { Moralis } = useMoralis();
    const NFTCollections = getCollectionsByChain(chainId);
    const contractABIJson = JSON.parse(contractABI);
    const contractProcessor = useWeb3ExecuteFunction();
    const [query, setQuery] = useState('');
    const { NFTSearch, totalNFTs, fetchSuccess } = useNFTSearch(query);
    const { Search } = Input;
    const { Meta } = Card;
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisibility] = useState(false);
    const [nftToBuy, setNftToBuy] = useState(null);
    const [loading, setLoading] = useState(false);
    const nativeName = getNativeByChain(chainId);
    const purchaseItemFunction = "createMarketSale";
    const queryMarketItems = useMoralisQuery("CreatedMarketItems");
    const fetchMarketItems = JSON.parse(
        JSON.stringify(queryMarketItems.data, [
            "objectId",
            "createdAt",
            "price",
            "nftContract",
            "itemId",
            "sold",
            "tokenId",
            "seller",
            "owner",
            "confirmed",
        ])
    );

    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, 500);
        };
    };

    const debouncedSearch = useCallback(debounce(onSearch), []);

    function onSearch(value) {
        if (value.target) {
            value = value.target.value;
        }
        if (value && value.length >= 3) {
            setQuery(value);
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    }

    const handleBuyClick = (nft) => {
        setNftToBuy(nft);
        setVisibility(true);
    };

    const getMarketItem = (nft) => {
        const result = fetchMarketItems?.find(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false &&
                e.confirmed === true
        );
        return result;
    };

    async function purchase() {
        setLoading(true);
        const tokenDetails = getMarketItem(nftToBuy);
        const itemID = tokenDetails.itemId;
        const tokenPrice = tokenDetails.price;
        const ops = {
          contractAddress: marketAddress,
          functionName: purchaseItemFunction,
          abi: contractABIJson,
          params: {
            nftContract: nftToBuy.token_address,
            itemId: itemID,
          },
          msgValue: tokenPrice,
        };
    
        await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
            console.log("success");
            setLoading(false);
            setVisibility(false);
            updateSoldMarketItem();
            succPurchase();
          },
          onError: (error) => {
            setLoading(false);
            failPurchase();
          },
        });
      }

      async function updateSoldMarketItem() {
        const id = getMarketItem(nftToBuy).objectId;
        const marketList = Moralis.Object.extend("CreatedMarketItems");
        const query = new Moralis.Query(marketList);
        await query.get(id).then((obj) => {
          obj.set("sold", true);
          obj.set("owner", walletAddress);
          obj.save();
        });
      }

      function succPurchase() {
        let secondsToGo = 5;
        const modal = Modal.success({
          title: "Success!",
          content: `You have purchased this NFT`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      }
    
      function failPurchase() {
        let secondsToGo = 5;
        const modal = Modal.error({
          title: "Error!",
          content: `There was a problem when purchasing this NFT`,
        });
        setTimeout(() => {
          modal.destroy();
        }, secondsToGo * 1000);
      }

    return (
        <div style={{ display: 'flex', width: '400px', marginLeft: '50px' }}>
            {/* <Select
            showSearch
            style={{width: "1000px",
                    marginLeft: "20px" }}
            placeholder="Find a Collection"
            optionFilterProp="children"
            onChange={onChange}
        >   
        {NFTCollections && 
            NFTCollections.map((collection, i) => 
            <Option value={collection.addrs} key= {i}>{collection.name}</Option>
            )
            }   
        </Select> */}

            <Search placeholder="input search text" onSearch={debouncedSearch} enterButton allowClear onChange={debouncedSearch} />

            <Modal
                title={`Search Results - ${totalNFTs} items found`}
                centered
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                keyboard={true}
                width={1000}
            >
                <div style={styles.NFTs}>
                    {NFTSearch?.map((nft, index) => (
                        <Card
                            hoverable
                            actions={[
                                <Tooltip title="View On Blockexplorer">
                                    <FileSearchOutlined
                                        onClick={() =>
                                            window.open(
                                                `${getExplorer(chainId)}address/${nft.token_address}`,
                                                "_blank"
                                            )
                                        }
                                    />
                                </Tooltip>,
                                <Tooltip title="Buy NFT">
                                    <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                                </Tooltip>,
                            ]}
                            style={{ width: 240, border: "2px solid #e7eaf3" }}
                            cover={
                                <Image
                                    preview={false}
                                    src={nft.image || "error"}
                                    fallback={fallbackImg}
                                    alt=""
                                    style={{ height: "240px", objectFit: 'contain' }}
                                />
                            }
                            key={index}
                        >
                            {getMarketItem(nft) && (
                                <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                            )}
                            <Meta title={nft?.metadata?.name ? nft?.metadata?.name : nft?.name} description={`#${nft.token_id} ${ getMarketItem(nft) ? ' - Price: ' + getMarketItem(nft).price / ("1e" + 18) : ''}`} />
                        </Card>
                    ))}
                </div>
                {getMarketItem(nftToBuy) ? (
                    <Modal
                        title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
                        visible={visible}
                        onCancel={() => setVisibility(false)}
                        onOk={() => purchase()}
                        okText="Buy"
                    >
                        <Spin spinning={loading}>
                            <div
                                style={{
                                    width: "250px",
                                    margin: "auto",
                                }}
                            >
                                <Badge.Ribbon
                                    color="green"
                                    text={`${getMarketItem(nftToBuy).price / ("1e" + 18)
                                        } ${nativeName}`}
                                >
                                    <img
                                        src={nftToBuy?.image}
                                        style={{
                                            width: "250px",
                                            borderRadius: "10px",
                                            marginBottom: "15px",
                                        }}
                                    />
                                </Badge.Ribbon>
                            </div>
                        </Spin>
                    </Modal>
                ) : (
                    <Modal
                        title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
                        visible={visible}
                        onCancel={() => setVisibility(false)}
                        onOk={() => setVisibility(false)}
                    >
                        <img
                            src={nftToBuy?.image}
                            style={{
                                width: "250px",
                                margin: "auto",
                                borderRadius: "10px",
                                marginBottom: "15px",
                            }}
                        />
                        <Alert
                            message="This NFT is currently not for sale"
                            type="warning"
                        />
                    </Modal>
                )}
            </Modal>

        </div>
    )
}
export default SearchCollections;