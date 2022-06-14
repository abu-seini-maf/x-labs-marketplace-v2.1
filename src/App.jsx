import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import NFTTokenIds from "components/NFTTokenIds";
import { Menu, Layout } from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTBalance from "components/NFTBalance";
import NFTMarketTransactions from "components/NFTMarketTransactions";
import NFTExplore from 'components/NFTExplore';
import ExploreFeatures from "components/ExploreFeatures";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();



  const [inputValue, setInputValue] = useState("explore");
  const [category, setCategory] = useState("all categories");


  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <SearchCollections />
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              marginLeft: "50px",
              width: "100%",
            }}
            defaultSelectedKeys={["nftMarket"]}
          >
            <Menu.Item key="exploreNFTs" onClick={() => setCategory('all categories')}>
              <NavLink to="/ExploreNFTs">NFT's</NavLink>
            </Menu.Item>
            <Menu.Item key="nftMarket" onClick={() => { setInputValue("explore"); setCategory('all categories') }} >
              <NavLink to="/NFTMarketPlace">Collections</NavLink>
            </Menu.Item>
            <Menu.Item key="exploreFeatures">
              <NavLink to="/features">Features</NavLink>
            </Menu.Item>
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/ExploreNFTs">
              <NFTExplore category={category} setCategory={setCategory} />
            </Route>
            <Route path="/NFTMarketPlace">
              <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} category={category} setCategory={setCategory} />
            </Route>
            <Route path="/Transactions">
              <NFTMarketTransactions />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/features">
              <ExploreFeatures />
            </Route>
          </Switch>
          <Redirect to="/NFTMarketPlace" />
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>
          X-Labs 2022
        </Text>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{ display: "flex" }}>
    <svg width="120" height="38" viewBox="0 0 918 157" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M212.458 146.553C212.458 149.526 214.868 151.935 217.84 151.935H333.853C336.825 151.935 339.235 149.526 339.235 146.553V141.575C339.235 138.603 336.825 136.193 333.853 136.193H234.632C231.659 136.193 229.25 133.783 229.25 130.811V8.71112C229.25 5.73876 226.84 3.32917 223.868 3.32917H217.84C214.868 3.32917 212.458 5.73875 212.458 8.71111V146.553Z" fill="black" />
      <path d="M499.023 109.536C501.016 109.536 502.846 110.638 503.779 112.399L523.205 149.072C524.138 150.834 525.968 151.935 527.961 151.935H533.941C538.021 151.935 540.617 147.573 538.672 143.987L463.91 6.14519C462.969 4.40992 461.153 3.32917 459.179 3.32917H448.411C446.418 3.32917 444.588 4.43071 443.655 6.19204L370.645 144.034C368.747 147.619 371.345 151.935 375.401 151.935H381.453C383.462 151.935 385.303 150.817 386.229 149.035L405.253 112.436C406.179 110.654 408.02 109.536 410.029 109.536H499.023ZM449.253 27.9332C451.258 24.0912 456.75 24.0736 458.779 27.9027L490.518 87.7807C492.418 91.3652 489.82 95.6832 485.763 95.6832H422.776C418.735 95.6832 416.135 91.3944 418.005 87.8113L449.253 27.9332Z" fill="black" />
      <path d="M575.052 146.553C575.052 149.526 577.462 151.935 580.434 151.935H648.306C681.469 151.935 704.138 147.317 715.682 135.563C721.559 129.686 724.498 121.5 724.498 111.425V111.215C724.498 94.4833 717.391 85.0908 702.918 80C700.004 78.9751 699.803 72.4718 702.601 71.1646C714.35 65.6773 720.3 56.5243 720.3 41.74V41.3202C720.3 13.4041 698.471 3.32917 650.405 3.32917H580.434C577.462 3.32917 575.052 5.73875 575.052 8.71111V146.553ZM651.244 69.6561H596.806C593.834 69.6561 591.424 67.2466 591.424 64.2742V22.5642C591.424 19.5918 593.834 17.1823 596.806 17.1823H651.035C687.556 17.1823 703.928 22.8494 703.928 42.7895V42.9994C703.928 57.902 694.693 65.0384 678.951 67.7671C670.975 69.2364 661.949 69.6561 651.244 69.6561ZM591.424 88.4714C591.424 85.499 593.834 83.0894 596.806 83.0894H649.775C674.543 83.0894 691.754 84.7686 700.78 92.7446C705.607 96.7326 707.706 102.4 707.706 110.376V110.586C707.706 124.859 699.52 132.415 681.469 135.144C672.444 136.823 660.9 137.452 646.837 137.452H596.806C593.834 137.452 591.424 135.043 591.424 132.07V88.4714Z" fill="black" />
      <path d="M843.312 156.133C894.526 156.133 917.825 139.551 917.825 110.796C917.825 90.2259 906.7 80.1509 883.612 75.1134C872.068 72.5947 858.005 70.9155 840.583 69.866C810.988 67.977 794.196 65.0384 786.22 58.3218C782.232 54.7536 780.343 49.926 780.343 43.839C780.343 24.7385 797.135 14.6635 834.496 14.6635C869.987 14.6635 892.289 24.1887 897.809 45.1215C898.494 47.7185 900.724 49.7161 903.409 49.7161H909.894C913.185 49.7161 915.727 46.7757 914.91 43.5876C907.695 15.4175 881.201 0.390625 834.916 0.390625C786.85 0.390625 763.552 17.6021 763.552 44.2588C763.552 63.3593 774.046 73.4342 795.036 78.4717C805.531 80.9905 818.334 82.8795 834.076 83.929C865.561 85.8181 884.661 87.917 894.317 95.0535C898.724 98.6217 901.243 104.079 901.243 111.635C901.243 130.526 884.661 141.23 843.522 141.23C801.333 141.23 780.464 131.419 774.835 104.104C774.291 101.467 772.039 99.4613 769.347 99.4613H762.123C758.875 99.4613 756.351 102.327 756.971 105.515C761.328 127.893 773.084 142.519 795.666 150.046C808.049 154.244 824.002 156.133 843.312 156.133Z" fill="black" />
      <path d="M65.4508 98.5939C71.8951 91.8594 82.6873 91.9654 88.9983 98.8251L137.793 151.863C139.267 153.465 141.346 154.377 143.523 154.377C150.311 154.377 153.849 146.298 149.246 141.31L98.7998 86.6475C93.0008 80.3639 93.1062 70.649 99.04 64.4926L143.092 18.7888C147.796 13.9086 144.337 5.77148 137.559 5.77148C135.435 5.77148 133.405 6.65091 131.952 8.20088L89.6363 53.3485C83.2246 60.1892 72.354 60.1486 65.9936 53.2602L24.4386 8.25526C22.9766 6.67194 20.9196 5.77148 18.7646 5.77148C12.0048 5.77148 8.50705 13.8417 13.1289 18.7746L55.891 64.415C61.7902 70.7112 61.6967 80.5329 55.6787 86.7157L2.96876 140.87C-1.93989 145.913 1.63345 154.377 8.67106 154.377C10.8423 154.377 12.9192 153.49 14.4203 151.922L65.4508 98.5939Z" fill="black" />
    </svg>

  </div>
);

export default App;
