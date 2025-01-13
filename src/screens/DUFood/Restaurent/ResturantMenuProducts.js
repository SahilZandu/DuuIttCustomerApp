import React, {useState, useEffect, useCallback,useRef, PureComponent, memo} from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  findNodeHandle,
  UIManager,
  SafeAreaView,
  FlatList,
  Image,
  useWindowDimensions,
  DeviceEventEmitter,
  Animated,
  TouchableOpacity,
} from 'react-native';

// import RestaurantHeader from '../../Components/RestautantHeader';
import {rootStore} from '../../../stores/rootStore';
import OrgCard from '../../../components/OrgCard';
// import {offerData} from '../../Components/offerdata';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProductCard from '../../../components/Cards/ProductCard';
import {restuarantStyles} from '../Menu/styles';
import GroupsFilter from '../../../components/GroupsFilter';
import RestaurantItemLoader from '../../../components/AnimatedLoader/RestaurantItemLoader';
import {SvgXml} from 'react-native-svg';
import MenuListModal from '../../../components/MenuListModal';
import ViewCartBtn from '../Components/ViewCartBtn';
import {useFocusEffect} from '@react-navigation/native';
import OrderCustomization from '../../../components/OrderCustomization';
// import OrderVarientsComponent from '../../Components/OrderVarientsComponent';
// import Base_Image_Url from '../../api/Url';
// import FullImageView from '../../common/FullImageView';
// import OrderAddonComponent from '../../Components/OrderAddonComponents';
// import UpdateQunatityItem from './Components/UpdateQunatityItem';
// import CartItemUpdate from '../../Components/CartItemUpdate';
// import DashboardCartBtn from '../DashBoardScreens/DashboardCartBtn';
// import PopUpModal from '../../Components/PopUpModal';
// import {getIsOrgOpenSoon} from '../../helpers/getIsOrgOpenSoon';
import FastImage from 'react-native-fast-image';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import {object} from 'yup';

let filterType = 'all';

let CustomizeItem = null;
let itemForEdit = null;

let idForUpdate = null;

const resClosedIcon = require('../../assets/closed.png');

const ResturantProducts = memo(({navigation, route}) => {
  const {saveCartItem, loadCartList} = rootStore.cartStore;

  // const imageUrl = Base_Image_Url?.Base_Image_UrlProduct;
  // const {item} = route?.params;
  // const org_id = item?.org_id ? item?.org_id : item?.id;

  // const {
  //   getResturantMenu,
  //   getResturantDetail,
  //   likeOrg,
  //   dislikeOrg,
  //   getResturantReviews,
  // } = rootStore.resturantstore;
  // const {getRestaurantProduct} = rootStore.homeStore;
  // const {
  //   getCart,
  //   setCart,
  //   updateCartItem,
  //   deleteCart,
  //   setCartEmpty,
  //   getCouponList,
  // } = rootStore.cartStore;

  const [groupProducts, setGroupProduts] = useState([]);
  const [groupProductsfilter, setGroupProdutsFilter] = useState([
    {
      name: 'Recomended for you ',
      id: 'dd',
      isExpended: true,

      products: [
        {
          id: 11,
          product_id: 11,
          title: 'Margherita pizza',
          description: 'Margherita pizza is a classic Italian dish that features a round, hand-tossed pizza base with tomato sauce, mozzarella cheese, and basil leaves',
          in_stock: 1,
          veg_non_veg: 'veg',
          tag: 'bestseller',
          product_addon_groups: [
            {
              id: 21,
              max_selection: '3',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'Toping',

              addonprod: [
                {
                  id: 54,
                  name: 'Extra Cheese',
                  price: 22,
                },
                {
                  id: 55,
                  name: 'veg toppings',
                  price: 43,
                },
              ],
            },
            {
              id: 22,
              max_selection: '1',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'Seasoning',

              addonprod: [
                {
                  id: 56,
                  name: 'Oregano',
                  price: 22,
                },
                {
                  id: 57,
                  name: 'Garlic',
                  price: 43,
                },
              ],
            },
          ],
          // product_varient_group:[
          //   {name:'v test'},
          //   {name:'v test 2'},
          // ],
          combination: [
            {
              first_gp: {name:'7 inch'},
              id: 72,
              price: 200,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'10 inch'},
              id: 73,
              price: 200,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'12 inch'},
              id: 74,
              price: 540,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '54',
            },
            {
              first_gp:  {name:'14 inch'},
              id: 75,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'16 inch'},
              id: 76,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'20 inch'},
              id: 77,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '54',
            },
            {
              first_gp:  {name:'22 inch'},
              id: 78,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'24 inch'},
              id: 79,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'25 inch'},
              id: 80,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '54',
            },
          ],
          product_varient_group: [
            {
              id: 22,
              name: 'Size of Crust',
              position: null,
              product_id: 66,
             // varient: [Array],
            },
            {
              id: 23,
              name: 'Size',
              position: null,
              product_id: 66,
              //varient: [Array],
            },
          ],
        },
        {
          id: 13,
          product_id: 13,
          title: 'Cheez pizza',
          description: 'Cheez pizza is a classic Italian dish that features a round, hand-tossed pizza base with tomato sauce, mozzarella cheese, and basil leaves',
          in_stock: 1,
          veg_non_veg: 'veg',
          tag: 'bestseller',
          product_addon_groups: [
            {
              id: 21,
              max_selection: '3',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'Toping',

              addonprod: [
                {
                  id: 558,
                  name: 'Mushroom',
                  price: 22,
                },
                {
                  id: 548,
                  name: 'Sausage',
                  price: 43,
                },
              ],
            },
            {
              id: 22,
              max_selection: '1',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'seasoning',

              addonprod: [
                {
                  id: 538,
                  name: 'Basil',
                  price: 22,
                },
                {
                  id: 518,
                  name: 'Parsley',
                  price: 43,
                },
              ],
            },
          ],
          // product_varient_group:[
          //   {name:'v test'},
          //   {name:'v test 2'},
          // ],
          combination: [
            {
              first_gp: {name:'7 inch'},
              id: 72,
              price: 200,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'10 inch'},
              id: 73,
              price: 200,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'12 inch'},
              id: 74,
              price: 540,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '49',
              varient_id_2: '54',
            },
            {
              first_gp:  {name:'14 inch'},
              id: 75,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'16 inch'},
              id: 76,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'20 inch'},
              id: 77,
              price: 450,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '50',
              varient_id_2: '54',
            },
            {
              first_gp:  {name:'22 inch'},
              id: 78,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '52',
            },
            {
              first_gp:  {name:'24 inch'},
              id: 79,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '53',
            },
            {
              first_gp:  {name:'25 inch'},
              id: 80,
              price: 650,
              product_id: 66,
              // second_gp: [Object],
              varient_id_1: '51',
              varient_id_2: '54',
            },
          ],
          product_varient_group: [
            {
              id: 22,
              name: 'Size of Crust',
              position: null,
              product_id: 66,
              //varient: [Array],
            },
            {
              id: 23,
              name: 'Size',
              position: null,
              product_id: 66,
              //varient: [Array],
            },
          ],
        },
      ],
    },
    {
      id: 'dd',
      name: 'snacks',
      isExpended: true,

      products: [
        {
          id: 22,
          product_id: 22,
          title: 'Samosa',
          description: 'With just the mention of this Indian snack, food lovers will surely drool. Popular mostly in northern parts of India, ',
          in_stock: 1,
          veg_non_veg: 'veg',
          tag: 'bestseller',
          product_addon_groups: [
            {
              id: 21,
              max_selection: '3',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'Toping',

              addonprod: [
                {
                  id: 558,
                  name: 'Mushroom',
                  price: 22,
                },
                {
                  id: 548,
                  name: 'Sausage',
                  price: 43,
                },
              ],
            },
            {
              id: 22,
              max_selection: '1',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'seasoning',

              addonprod: [
                {
                  id: 538,
                  name: 'Basil',
                  price: 22,
                },
                {
                  id: 518,
                  name: 'Parsley',
                  price: 43,
                },
              ],
            },
          ],
          // product_varient_group:[
          //   {name:'v test'},
          //   {name:'v test 2'},
          // ],
          // combination: [
          //   {
          //     first_gp: {name:'7 inch'},
          //     id: 72,
          //     price: 200,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'10 inch'},
          //     id: 73,
          //     price: 200,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'12 inch'},
          //     id: 74,
          //     price: 540,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '54',
          //   },
          //   {
          //     first_gp:  {name:'14 inch'},
          //     id: 75,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'16 inch'},
          //     id: 76,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'20 inch'},
          //     id: 77,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '54',
          //   },
          //   {
          //     first_gp:  {name:'22 inch'},
          //     id: 78,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'24 inch'},
          //     id: 79,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'25 inch'},
          //     id: 80,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '54',
          //   },
          // ],
          // product_varient_group: [
          //   {
          //     id: 22,
          //     name: 'Size of Crust',
          //     position: null,
          //     product_id: 66,
          //     //varient: [Array],
          //   },
          //   {
          //     id: 23,
          //     name: 'Size',
          //     position: null,
          //     product_id: 66,
          //     //varient: [Array],
          //   },
          // ],
        },
        {
          id: 23,
          product_id: 23,
          title: 'Momo',
          description: 'Many hardcore foodies would say Momo are not any ordinary Indian snack but is an emotion; ',
          in_stock: 1,
          veg_non_veg: 'veg',
          tag: 'bestseller',
          product_addon_groups: [
            {
              id: 21,
              max_selection: '3',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'Toping',

              addonprod: [
                {
                  id: 558,
                  name: 'Mushroom',
                  price: 22,
                },
                {
                  id: 548,
                  name: 'Sausage',
                  price: 43,
                },
              ],
            },
            {
              id: 22,
              max_selection: '1',
              org_id: 17,
              priceable: 1,
              product_id: 81,
              title: 'seasoning',

              addonprod: [
                {
                  id: 538,
                  name: 'Basil',
                  price: 22,
                },
                {
                  id: 518,
                  name: 'Parsley',
                  price: 43,
                },
              ],
            },
          ],
          // product_varient_group:[
          //   {name:'v test'},
          //   {name:'v test 2'},
          // ],
          // combination: [
          //   {
          //     first_gp: {name:'7 inch'},
          //     id: 72,
          //     price: 200,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'10 inch'},
          //     id: 73,
          //     price: 200,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'12 inch'},
          //     id: 74,
          //     price: 540,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '49',
          //     varient_id_2: '54',
          //   },
          //   {
          //     first_gp:  {name:'14 inch'},
          //     id: 75,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'16 inch'},
          //     id: 76,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'20 inch'},
          //     id: 77,
          //     price: 450,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '50',
          //     varient_id_2: '54',
          //   },
          //   {
          //     first_gp:  {name:'22 inch'},
          //     id: 78,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '52',
          //   },
          //   {
          //     first_gp:  {name:'24 inch'},
          //     id: 79,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '53',
          //   },
          //   {
          //     first_gp:  {name:'25 inch'},
          //     id: 80,
          //     price: 650,
          //     product_id: 66,
          //     // second_gp: [Object],
          //     varient_id_1: '51',
          //     varient_id_2: '54',
          //   },
          // ],
          // product_varient_group: [
          //   {
          //     id: 22,
          //     name: 'Size of Crust',
          //     position: null,
          //     product_id: 66,
          //     //varient: [Array],
          //   },
          //   {
          //     id: 23,
          //     name: 'Size',
          //     position: null,
          //     product_id: 66,
          //     //varient: [Array],
          //   },
          // ],
        },
      ],
    },
  ]);
  const [orgMenu, setOrgMenu] = useState([
    {name: 'Pizza', count: 4},
    {name: 'Hamburger', count: 6},
    {name: 'Sandwitch', count: 10},
    {name: 'Biryani', count: 9},
  ]);
  const [showFilters, setShowFilters] = useState(true);
  const [restaurant, setRestaurant] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setOpenMenu] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [isCartCount, setIsCartCount] = useState(0);
  const [isOtherCart, setIsOtherCart] = useState(null);
  const [itemModal, setItemModal] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);
  const [fullImage, setFullImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [removeCart, setRemoveCart] = useState(false);
  const [isResOpen, setIsResOpen] = useState(true);
  const [isResOpenSoon, setIsResOpenSoon] = useState(null);
  const [orgOffers, setOrgOffers] = useState([]);
  const [orgReviews, setOrgReviews] = useState([]);

  const scrollViewRef = useRef(null);
  const groupRefs = useRef([]);

  const GetResturantDetail = async () => {
    const getRes = await getResturantDetail(org_id);
    console.log('get Restaurant', getRes);
    if (getRes) {
      setRestaurant(getRes);
      setIsResOpen(getRes.org_order_type != null ? true : false);
      setIsResOpenSoon(getIsOrgOpenSoon(getRes?.orgtimings));
    } else {
      setRestaurant(item);
      setIsResOpen(item.rest_open != null ? true : false);
    }
  };

  

  useEffect(() => {
   
    const requestNode = DeviceEventEmitter.addListener('requestNode', key => {
      scrollToGroup_(key);
    });

    return () => {
      requestNode.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCartItemsCount();
    }, []),
  );

  const GetProducts = async () => {
    const getcategoryProduct = await getRestaurantProduct(
      org_id,
      handleLoading,
    );
    console.log('resProduct--', getcategoryProduct);

    if (getcategoryProduct) {
      await setGroupProduts(getcategoryProduct);
      setGroupProdutsFilter(getcategoryProduct);
    }
    setLoading(false);
  };

  const handleLoading = v => {
    // setLoading(v);
  };

  const scrollToGroup = index => {
    setOpenMenu(!menuOpen);
    const nodeHandle = findNodeHandle(groupRefs.current[index]);

    console.log('nodeHandle', nodeHandle);

    UIManager.measureLayout(
      nodeHandle,
      findNodeHandle(scrollViewRef.current),
      () => {},
      (x, y) => {
        let a = y;
        scrollViewRef.current.scrollTo({y, animated: true});
      },
    );
    setShowFilters(false);
  };
  const scrollToGroup_ = index => {
    setOpenMenu(!menuOpen);
    const nodeHandle = findNodeHandle(groupRefs.current[index]);

    console.log('nodeHandle>', nodeHandle);
    DeviceEventEmitter.emit('scrollUpTo', nodeHandle);

    // UIManager.measureLayout(
    //   nodeHandle,
    //   findNodeHandle(scrollViewRef.current),
    //   () => {},
    //   (x, y) => {
    //     let a = y;
    //     scrollViewRef.current.scrollTo({y, animated: true});
    //   },
    // );
    // setShowFilters(false);
  };

  const getOrgMenu = async () => {
    const getMenu = await getResturantMenu(org_id);
    console.log('menu detail list', getMenu);

    if (getMenu) {
      setOrgMenu(getMenu);
    }
  };

  const getReviews = async () => {
    const reviews = await getResturantReviews(org_id);
    console.log('get org Reviews:', reviews);
    setOrgReviews(reviews && reviews.length > 0 ? reviews : []);
  };

  const handleReviewNavigation = () => {
    navigation.navigate('ç', {navigation});

    // if (orgReviews && orgReviews.length > 0 && restaurant) {
    //   navigation.navigate('restaurantDetail', {reviews: orgReviews, restaurant});
    // }
  };

  const getOffers = async () => {
    const getOrgOffers = await getCouponList();

    if (getOrgOffers && getOrgOffers.length > 0) {
      setOrgOffers(getOrgOffers);
    } else {
      getOrgOffers([]);
    }

    console.log('getOrgOffers', getOrgOffers);
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        //await GetProducts();
        //GetResturantDetail();
        //getReviews();
        //getOrgMenu();
        //await getUserCart();
        //getOffers();
        //setUpdate(!update);
      }

      fetchData();

      const intervalId = setInterval(() => {
        fetchData();
      }, 60000);

      return () => clearInterval(intervalId);
    }, []),
  );

  const handleFilter = type => {
    // const arr = groupProducts;
    // if (type !== 'all') {
    //   let filterA = arr.map(group => ({
    //     ...group,
    //     products: group.products.filter(product => product.veg_non_veg == type),
    //   }));
    //   let find = filterA.filter(i => i.products.length > 0);
    //   setGroupProdutsFilter(find);
    // } else {
    //   setGroupProdutsFilter(groupProducts);
    // }
  };

  const BottomContent = () => {
    return (
      <>
        <Pressable
          onPress={() => setOpenMenu(true)}
          style={{
            position: 'absolute',
            bottom: isCart ? '8%' : isOtherCart ? '11%' : '7%',
            transform: [{translateX: -wp('10%')}], // Offsets the width to truly center
            left: '50%', // Centers the button horizontally
            //  backgroundColor:'red',
            height: hp('10%'),
            width: wp('20%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgXml xml={menub} />
        </Pressable>
      </>
    );
  };

  const onSucess = () => {};

  const handleAddRemove = async (action, i, item, indx, index, quan) => {
    const vcId = null;
    const vcName = null;
    const vcPrice = null;
    const addons = null;
    const iPrice = item?.selling_price;
    await setCart(
      item,
      quan,
      vcId,
      vcName,
      vcPrice,
      restaurant,
      addons,
      iPrice,
    );
    getUserCart();
  };

  const getUserCart = async () => {
    const gettcart = await getCart();
    DeviceEventEmitter.emit('cart', 'black');

    console.log('getCart:-', gettcart);
    if (gettcart && gettcart?.org_id == org_id) {
      setIsCart(
        gettcart && gettcart?.cartitems && gettcart?.cartitems.length > 0
          ? gettcart
          : null,
      );
    } else if (gettcart && gettcart?.org_id !== org_id) {
      setIsOtherCart(
        gettcart && gettcart?.cartitems && gettcart?.cartitems.length > 0
          ? gettcart
          : null,
      );
    } else {
      setVisible(false);
      setIsCart(null);
      setIsOtherCart(null);
    }
    setUpdate(!update);
  };

  const onRemoveCart = async orgId => {
    await deleteCart(orgId);
    await setCartEmpty();

    setRemoveCart(false);
    getUserCart();
  };

  const getCartItemsCount = async c => {
    const cartItems = await loadCartList();
    console.log('user cart', cartItems);

   if(cartItems.length>0)
   {
    setIsCart(true);
    setIsCartCount(cartItems.length);
   }
   else{
    setIsCart(false);
    setIsCartCount(0);;
   }
    
  };

  const setFirstGroupSelected = (indexx, item) => {
    setGroupProdutsFilter(prevState =>
      prevState.map(
        (group, index) =>
          index === indexx // Only modify the first group
            ? {...group, isExpended: !item.isExpended} // Add isExpended to the first group
            : group, // Leave other groups unchanged
      ),
    );
  };

  const renderGroups = ({item, index}) => {
    let i = item;
    let indx = index;
    // Toggle FlatList visibility and arrow direction
    const toggleFlatListVisibility = () => {
      setFirstGroupSelected(indx, item);
    };

    return (
      <View
        ref={el => (groupRefs.current[index] = el)}
        key={index}
        style={{
          paddingTop: '4%',
          backgroundColor: 'white',
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#3D3D3D',
              fontSize: RFValue(16), // You can replace RFValue(14) if you want
              fontFamily: fonts.bold, // Replace with your actual font
            }}>
            {item?.name} ({item?.products?.length})
          </Text>

          {/* Arrow Button */}
          <TouchableOpacity onPress={toggleFlatListVisibility}>
            {
              <SvgXml
                xml={
                  item.isExpended
                    ? appImagesSvg.arroeDown
                    : appImagesSvg.arroeUp
                }
              />
              // <Image
              // width={24}
              // height={24}
              // source={appImages.downArrow}/>
            }
          </TouchableOpacity>
        </View>

        {/* Conditionally render the FlatList based on visibility */}

        {item.isExpended && (
          <FlatList
            data={item.products}
            renderItem={({item, index}) => (
              <ProductCard
                isResOpen={isResOpen}
                restaurant={restaurant}
                update={update}
                item={item}
                index={index}
                onDetail={() => {
                  CustomizeItem = null;
                  CustomizeItem = item;
                  setItemModal(true);
                }}
                onAdd={(action, quan) => {
                  handleAddRemove(action, i, item, indx, index, quan);
                }}
                editVarient={() => {
                  CustomizeItem = null;
                  CustomizeItem = item;
                  setVisible(true);
                }}
                removeCart={id => onRemoveCart(id)}
              />
            )}
            keyExtractor={subItem => subItem.id.toString()}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                {Array.from({length: 30}).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 4, // Dot size
                      height: 1, // Dot height
                      borderRadius: 2, // Make the dots round
                      backgroundColor: '#838282', // Dot color
                      marginHorizontal: 2, // Space between the dots
                    }}
                  />
                ))}
              </View>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.appBackground}}>
      {/* <RestaurantHeader
        isLike={restaurant ? (restaurant?.orguser ? true : false) : false}
        navigation={navigation}
        onSearch={() =>
          navigation.navigate('categoryMenu', {
            item,
            orgId: org_id,
            restaurant,
          })
        }
        onlike={() => {
          let a = restaurant;
          if (a.orguser) {
            dislikeOrg(org_id, onSucess);
          } else {
            likeOrg(org_id, 1, onSucess);
          }
          a.orguser = a.orguser ? null : 'likeed';
          setRestaurant(a);
          setUpdate(!update);
        }}
        onDetail={() =>
          navigation.navigate('restaurant', {
            restaurant: restaurant,
            isResOpen,
            isResOpenSoon,
          })
        }
        // optionsPress={() => setOptons(!options)}
      /> */}

      <ScrollView
        contentContainerStyle={{paddingBottom: '40%'}}
        onScrollEndDrag={() => {
          if (!showFilters) {
            setShowFilters(true);
          }
        }}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={showFilters ? [1] : []}>
        <View
          style={{width: wp('100%'), height: hp('25%'), position: 'relative'}}>
          <FastImage
            style={[
              {
                // width: isHorizontal ? wp('79%') : wp('89%'),
                width: wp('100%'),
                height: hp('25%'),
                opacity: isResOpen ? 1 : 0.6,
                backgroundColor: 'white',
              },
            ]}
            source={appImages.foodIMage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: '100%', // Set the width of the back arrow container
              height: '100%', // Set the height of the back arrow container
              backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent white background
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <SvgXml
              style={{
                top: 10, // Adjust top distance as per your design
                left: 10,
              }}
              xml={appImagesSvg.whitebackArrow} // Replace with your image source
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: colors.white,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            marginTop: hp('-4%'),
          }}>
          <OrgCard
            // org={item}
            org={{
              name: 'Souriya FastFood',
              description: 'Pizza , Fast food, Burger',
              average_rating: '3.4',
            }}
            isResOpen={isResOpen}
            // offerData={offerData}
            // isResOpenSoon={isResOpenSoon}
            orgOffers={orgOffers}
            onReviews={handleReviewNavigation}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              marginStart: 20,
              flexDirection: 'row',
              alignItems: 'center',
              height: hp('4.5%'),
              width: '20%',
              paddingHorizontal: '3%',
              backgroundColor: '#D6FFE473',
              // backgroundColor: selected == item.type ? '#D6FFE473' : 'white',

              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#28B056',
              // borderColor: selected == item.type ? '#28B056' : '#D9D9D9',
              opacity: showFilters ? 1 : 0,
            }}>
            <SvgXml xml={filter} />
            <Text
              style={{
                color: '#646464',
                fontFamily: fonts.medium,
                fontSize: RFValue(10),
              }}>
              {'  '}
              Filter
            </Text>
            {/* {selected == item.type && <SvgXml xml={close} />} */}
          </View>

          <GroupsFilter
            onFilter={f => {
              (filterType = f), handleFilter(f);
            }}
            showFilters={showFilters}
            filterType={filterType}
          />
        </View>

        <View style={{flex: 1}}>
          {groupProductsfilter && groupProductsfilter?.length > 0 ? (
            <>
              <Text
                style={{
                  color: '#3D3D3D',
                  fontSize: RFValue(14),
                  fontFamily: fonts.medium,
                  paddingTop: 20,
                  width: wp('100%'),
                  textAlign: 'center',
                  backgroundColor: 'white',
                }}>
                Menu
              </Text>
              <FlatList
                data={groupProductsfilter}
                renderItem={renderGroups}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: wp('100%'), // Dot size
                      height: 4, // Dot height
                      backgroundColor: '#F4F4F4', // Dot color
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  paddingStart: 10,
                  paddingEnd: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#8F8F8F',
                    height: 4,
                    width: 4,
                    borderRadius: 4,
                    marginTop: 5,
                  }}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#3D3D3D',
                    fontSize: RFValue(10),
                    fontFamily: fonts.medium,
                    paddingTop: 20,
                    marginStart: 10,
                  }}>
                  {
                    'Menu items, nutritional information and prices are set directly by the restaurant'
                  }
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  paddingStart: 10,
                  paddingEnd: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#8F8F8F',
                    height: 4,
                    width: 4,
                    borderRadius: 4,
                    marginTop: 5,
                  }}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#3D3D3D',
                    fontSize: RFValue(10),
                    fontFamily: fonts.medium,
                    paddingTop: 20,
                    marginStart: 10,
                  }}>
                  {
                    'Nutritional information values displayed are indicative, per serving and may vary depending on the ingredients, portion size and customizations.'
                  }
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  paddingStart: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#8F8F8F',
                    height: 4,
                    width: 4,
                    borderRadius: 4,
                    marginTop: 5,
                  }}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#3D3D3D',
                    fontSize: RFValue(10),
                    fontFamily: fonts.medium,
                    paddingTop: 20,
                    marginStart: 10,
                  }}>
                  {
                    'An average active adult requires 2,000 kcal energy per day, however, calorie needs may vary.'
                  }
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',

                  paddingTop: 20,
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#E95D5D',
                    fontSize: RFValue(10),
                    fontFamily: fonts.medium,

                    marginStart: 10,
                  }}>
                  {'Report an issue with the menu '}
                </Text>
                <SvgXml xml={appImagesSvg.reportMenu} />
              </View>
            </>
          ) : (
            <View
              pointerEvents="none"
              style={{
                height: hp('85%'),
                alignItems: 'center',
                paddingTop: '40%',
              }}>
              {!loading && (
                <Text style={restuarantStyles.noDataText}>
                  No product found
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {!loading && orgMenu && orgMenu.length > 0 && <BottomContent />}
      {isCart && !loading && (
        <View
          style={
            {
              // bottom: '2%',
            }
          }>
          <ViewCartBtn
            items={isCartCount}
            viewCart={() => navigation.navigate('cart', {restaurant})}
          />
        </View>
      )}

      {/* {isOtherCart && !loading && (
        <DashboardCartBtn
          bottom={'6%'}
          isDash={true}
          items={getCartItemsCount(isOtherCart.cartitems)}
          restaurantData={isOtherCart}
          onViewCart={() =>
            navigation.navigate('cart', {restaurant: isOtherCart?.orgdata})
          }
          onDeletePress={() => {
            setRemoveCart(true);
          }}
        />
      )} */}

      <MenuListModal
        menu={orgMenu}
        visible={menuOpen}
        onClose={() => setOpenMenu(false)}
        onSelectMenu={key => {
          scrollToGroup_(key);
        }}
      />

      {/* <PopUpModal
        visible={removeCart}
        onDelete={() => {
          onRemoveCart(isOtherCart?.org_id);
        }}
        type={'delete'}
        text={'Are you sure you want to clear your cart?'}
        title={'Empty Cart'}
        onClose={() => setRemoveCart(false)}
        CTATitle={'Yes, I agree'}
      /> */}

      {loading && (
        <View style={{position: 'absolute', backgroundColor: 'white', flex: 1}}>
          <RestaurantItemLoader />
        </View>
      )}
      <OrderCustomization
        isResOpen={isResOpen}
        appCart={isCart}
        setFullImage={setFullImage}
        visible={itemModal}
        close={() => setItemModal(false)}
        item={CustomizeItem}
        // imageUrl={imageUrl}
        addToCart={async (quan, sellAmount, vcId, vcName, addons, iPrice) => {
          console.log(
            'modal ckilc data',
            quan,
            sellAmount,
            vcId,
            vcName,
            addons,
            iPrice,
            CustomizeItem,
          );
          setItemModal(false);
          var title = CustomizeItem.title;
          var veg_non_veg = CustomizeItem.veg_non_veg;
          var description = CustomizeItem.description;
          var prdId = CustomizeItem.id;
          // const objg = {};
          // objg.quantity=quan;
          // objg.sellingprice=sellingPrice;
          // // objg.addons=addons;
          // objg.finalprice=iPrice;

          const varientProps = vcId
          ? {
              varient_id: vcId,
              varient_name: vcName,
              //varient_price: vcPrice,
            }
          : {
              varient_id: null,
              varient_name: null,
              //varient_price: null,
            };
          var obj = {
            quantity: quan,
            sellingprice: sellAmount,
            addons: addons,
            ...varientProps,
            subtotalprice: iPrice,
            finalprice: iPrice * quan,
            productname: title,
            veg_non_veg: veg_non_veg,
            productdescription: description,
            productid: prdId,
            product_id: prdId,
            itemsUID: prdId,
          };

          console.log('objll>', obj);
          var restaurentObj = {
            restaurentname: 'Souriya FastFood',
            restaurentid: 12,
          };
          console.log('restaurentObj>', restaurentObj);
          //loadCartList();
          saveCartItem(obj, restaurentObj);
          setTimeout(() => {
            getCartItemsCount();
          }, 300);
          
          // await setCart(
          //   CustomizeItem,
          //   quan,
          //   vcId,
          //   vcName,
          //   sellAmount,
          //   restaurant,
          //   addons,
          //   iPrice,
          // );
          // getUserCart();
        }}
      />

      {/* <FullImageView
        uri={imageUrl + itemDetails?.product_pic}
        visible={fullImage}
        onRequestClose={() => {
          setFullImage(false);
          setTimeout(() => {
            setItemModal(true);
          }, 1);
        }}
      /> */}

      {/* <UpdateQunatityItem
        visible={visible}
        setVisible={setVisible}
        onCrossBtn={() => {
          setVisible(false);
        }}
        item={isCart}
        handleAddRemove={async (item, quan) => {
          const vcId = item?.varient_id ? item?.varient_id : null;
          const vcName = item?.varient_name ? item?.varient_name : null;
          const vcPrice = item?.varient_price ? item?.varient_price : null;
          const addons =
            item.addon_item && item.addon_item.length > 0
              ? item.addon_item
              : null;
          const iPrice = item?.sub_total;
          await setCart(
            item?.product,
            quan,
            vcId,
            vcName,
            vcPrice,
            restaurant,
            addons,
            iPrice,
          );
          getUserCart();
        }}
        onAddNew={() => {
          setVisible(false);
          setItemModal(true);
        }}
        onEdit={item => {
          console.log('item', item);
          idForUpdate = null;
          idForUpdate = item.itemsUID;
          itemForEdit = null;
          itemForEdit = item;
          setVisible(false);
          setIsEdit(true);
        }}
      /> */}

      {/* <CartItemUpdate
        isResOpen={isResOpen}
        visible={isEdit}
        close={() => setIsEdit(false)}
        onUpdate={async (quan, sellAmount, vcId, vcName, addons, iPrice) => {
          console.log(
            'values:--',
            quan,
            sellAmount,
            vcId,
            vcName,
            addons,
            iPrice,
          );
          setIsEdit(false);
          await updateCartItem(
            itemForEdit?.product,
            quan,
            vcId,
            vcName,
            sellAmount,
            addons,
            iPrice,
            idForUpdate,
          );
          getUserCart();
        }}
        cartItem={itemForEdit}
        product={itemForEdit?.product}
        imageUrl={imageUrl}
      /> */}
    </View>
  );
});

export default ResturantProducts;

const menub = `<svg width="80" height="30" viewBox="0 0 76 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 13C0 5.8203 5.8203 0 13 0H63C70.1797 0 76 5.8203 76 13C76 20.1797 70.1797 26 63 26H13C5.8203 26 0 20.1797 0 13Z" fill="#646464"/>
<path d="M20.3571 18.7144C20.3571 19.9769 19.6196 21.0001 18.3571 21.0001H13.6428C12.3803 21.0001 11.6428 19.9769 11.6428 18.7144" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M20.8571 15.8569C21.4882 15.8569 22 16.4966 22 17.2855C22 18.0744 21.4882 18.7141 20.8571 18.7141H11.1429C10.5118 18.7141 10 18.0744 10 17.2855C10 16.4966 10.5118 15.8569 11.1429 15.8569" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M21.1429 15.8574H15.2611C15.1854 15.8574 15.1128 15.8874 15.0593 15.9409L14.1011 16.8991C14.0878 16.9124 14.072 16.923 14.0547 16.9301C14.0374 16.9373 14.0188 16.941 14 16.941C13.9812 16.941 13.9626 16.9373 13.9453 16.9301C13.928 16.923 13.9122 16.9124 13.8989 16.8991L12.9407 15.9409C12.8872 15.8874 12.8146 15.8574 12.7389 15.8574H10.8571C10.6298 15.8574 10.4118 15.767 10.2511 15.6063C10.0903 15.4456 10 15.2275 10 15.0002C10 14.7729 10.0903 14.5549 10.2511 14.3941C10.4118 14.2334 10.6298 14.1431 10.8571 14.1431H21.1429C21.3702 14.1431 21.5882 14.2334 21.7489 14.3941C21.9097 14.5549 22 14.7729 22 15.0002C22 15.2275 21.9097 15.4456 21.7489 15.6063C21.5882 15.767 21.3702 15.8574 21.1429 15.8574Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M11.1428 13.7144V13.7065C11.1428 11.7422 12.75 10.7144 14.7143 10.7144H17.2857C19.25 10.7144 20.8571 11.7501 20.8571 13.7144V13.7065" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M17.4642 7.85693L17.7299 10.1416" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M18 20.9998H22.9754C23.2637 20.9998 23.5414 20.8908 23.7527 20.6947C23.9641 20.4986 24.0935 20.2298 24.115 19.9423L25.3929 7.85693" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M22 7.85714L22.5714 5.57143L24.25 5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.8572 7.85693H26" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M31.71 16.5V9.5H32.96L35.33 14.16L37.69 9.5H38.94V16.5H37.88V11.33L35.74 15.5H34.92L32.77 11.34V16.5H31.71ZM42.3623 16.5V9.5H46.8123V10.36H43.4223V12.54H46.5123V13.38H43.4223V15.64H46.8123V16.5H42.3623ZM50.0752 16.5V9.5H51.1352L54.6452 14.77V9.5H55.7052V16.5H54.6452L51.1352 11.23V16.5H50.0752ZM61.746 16.62C61.246 16.62 60.7927 16.5233 60.386 16.33C59.986 16.13 59.666 15.8267 59.426 15.42C59.1927 15.0133 59.076 14.4967 59.076 13.87V9.5H60.136V13.88C60.136 14.4933 60.2827 14.9433 60.576 15.23C60.8693 15.5167 61.266 15.66 61.766 15.66C62.2593 15.66 62.6527 15.5167 62.946 15.23C63.2393 14.9433 63.386 14.4933 63.386 13.88V9.5H64.446V13.87C64.446 14.4967 64.3227 15.0133 64.076 15.42C63.836 15.8267 63.5093 16.13 63.096 16.33C62.6893 16.5233 62.2393 16.62 61.746 16.62Z" fill="white"/>
</svg>`;

const filter = `<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7.7998H3.5" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 2.2998H8.5" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.5 7.7998H11" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 2.2998H1" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 9.25C4.17158 9.25 3.5 8.57845 3.5 7.75C3.5 6.92155 4.17158 6.25 5 6.25C5.82845 6.25 6.5 6.92155 6.5 7.75C6.5 8.57845 5.82845 9.25 5 9.25Z" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 3.75C7.82845 3.75 8.5 3.07843 8.5 2.25C8.5 1.42158 7.82845 0.75 7 0.75C6.17155 0.75 5.5 1.42158 5.5 2.25C5.5 3.07843 6.17155 3.75 7 3.75Z" stroke="#646464" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
