import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  View,
  ScrollView,
  Text,
  findNodeHandle,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity,
  StyleSheet,
  UIManager,
  Alert,
} from 'react-native';
import { rootStore } from '../../../stores/rootStore';
import OrgCard from '../../../components/OrgCard';
// import {offerData} from '../../Components/offerdata';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProductCard from '../../../components/Cards/ProductCard';
import GroupsFilter from '../../../components/GroupsFilter';
import { SvgXml } from 'react-native-svg';
import MenuListModal from '../../../components/MenuListModal';
import ViewCartBtn from '../Components/ViewCartBtn';
import { useFocusEffect } from '@react-navigation/native';
import OrderCustomization from '../../../components/OrderCustomization';
import FastImage from 'react-native-fast-image';
import { appImages, appImagesSvg } from '../../../commons/AppImages';
import { colors } from '../../../theme/colors';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import Url from '../../../api/Url';
import PopUp from '../../../components/appPopUp/PopUp';

let filterType = 'all';

let CustomizeItem = null;

const ResturantProducts = memo(({ navigation, route }) => {
  const { item } = route.params;
  const { setCart, getCart, updateCart, deleteCart } = rootStore.cartStore;
  const { restaurantUnderMenuGroup, setCategoryMenuList, categoryMenuList } =
    rootStore.foodDashboardStore;
  const { appUser } = rootStore.commonStore;
  const [groupProducts, setGroupProducts] = useState(categoryMenuList ?? []);
  const [groupProductsfilter, setGroupProdutsFilter] = useState(
    categoryMenuList ?? [],
  );
  const [orgMenu, setOrgMenu] = useState([
    // {name: 'Recomended for you', count: 2},
    // {name: 'snacks', count: 2},
    // {name: 'Sandwitch', count: 10},
    // {name: 'Biryani', count: 9},
  ]);
  const [showFilters, setShowFilters] = useState(true);
  const [restaurant, setRestaurant] = useState(item ?? {});
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [isCart, setIsCart] = useState({});
  const [itemModal, setItemModal] = useState(false);
  const [fullImage, setFullImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [removeCart, setRemoveCart] = useState(false);
  const [isResOpen, setIsResOpen] = useState(true);
  const [orgOffers, setOrgOffers] = useState([]);
  const [selectedCartList, setSelectedCartList] = useState({});
  const [isRemoveCart, setIsRemoveCart] = useState(false);
  const [clickItem, setClickItem] = useState({});

  const scrollViewRef = useRef(null);
  const groupRefs = useRef([]);

  // console.log('item---item?._id', item, item);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      filterType = 'all';
      setTimeout(() => {
        const { categoryMenuList } = rootStore.foodDashboardStore;
        getUserCart(categoryMenuList);
      }, 500);
    }, []),
  );

  useEffect(() => {
    if (item) {
      getRestCategoryList();
      setRestaurant(item ?? {});
    }
  }, [item]);

  // console.log('restaurant---', restaurant);

  const getRestCategoryList = async () => {
    try {
      const res = await restaurantUnderMenuGroup(
        item?._id,
        handleLoading,
      );
      console.log('API Response:', res);
      onMenuCount(res?.food_items);
      setGroupProducts(res?.food_items || []);
      setGroupProdutsFilter(res?.food_items || []);
      getUserCart(res?.food_items);
      setCategoryMenuList(res?.food_items);
    } catch (error) {
      console.error('Error fetching restaurant category list:', error);
    }
  };

  const onMenuCount = arr => {
    if (!Array?.isArray(arr)) {
      console.error('Error: arr is not an array', arr);
      return;
    }
    let menuList = arr?.map(group => {
      return {
        id: group?._id ?? '1234567890', // Default ID if missing
        name: group?.name ?? 'Unknown Group', // Default name if missing
        count: group?.food_items?.length || 0, // Count food_items or default to 0
      };
    });
    // console.log('Organized Menu List (all):', menuList);
    setOrgMenu(menuList);
  };

  const handleLoading = v => {
    setLoading(v);
  };

  const scrollToGroup = index => {
    setOpenMenu(!openMenu);
    const nodeHandle = findNodeHandle(groupRefs.current[index]);

    console.log('nodeHandle>', nodeHandle);
    // DeviceEventEmitter.emit('scrollUpTo', nodeHandle);

    UIManager.measureLayout(
      nodeHandle,
      findNodeHandle(scrollViewRef.current),
      () => { },
      (x, y) => {
        let a = y;
        scrollViewRef.current.scrollTo({ y, animated: true });
      },
    );
    setShowFilters(false);
  };

  const handleReviewNavigation = () => {
    // console.log('ç---');
    navigation.navigate('restaurantDetail', { restaurantData: restaurant });
    // if (orgReviews && orgReviews.length > 0 && restaurant) {
    //   navigation.navigate('restaurantDetail', {reviews: orgReviews, restaurant});
    // }
  };

  const handleFilter = type => {
    // console.log("type---handleFilter", type);
    const arr = groupProductsfilter;

    if (type !== 'all') {
      const filterA = arr?.map(group => {
        return {
          ...group,
          food_items: group.food_items?.filter(
            product => product?.veg_nonveg === type,
          ),
        };
      });

      // console.log("filterA--", filterA);
      onMenuCount(filterA);
      setGroupProducts([...filterA]);
    } else {
      onMenuCount(arr);
      setGroupProducts(arr);
    }
  };

  const BottomContent = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpenMenu(true)}
        style={[
          styles.menuBtnTouch,
          {
            bottom: isCart?.food_item?.length > 0 ? '10%' : '3%',
          },
        ]}>
        <View style={styles.menuBtnView}>
          <SvgXml xml={appImagesSvg.menubtn} />
          <Text style={styles.menuBtnText}>{'Menu'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleAddRemove = async (
    action,
    upperItem,
    item,
    upperIndex,
    index,
    quan,
  ) => {
    // console.log('item,quan,handleAddRemove',action,  upperItem,  item, upperIndex, index,quan);
    let newItem = {
      ...item,
      quantity: quan,
      food_item_id: item?._id,
      food_item_price: item?.selling_price,
    };

    // console.log('item,quan,handleAddRemove', item, quan, restaurant, newItem);

    // const getCartList = await getCart(restaurant);
    const getCartList = { ...selectedCartList };
    console.log('getCartList handleAddRemove:-', getCartList, item);
    if (getCartList?.cart_items?.length > 0) {
      if (getCartList?.restaurant_id == item?.restaurant_id) {
        const checkAvailabilityById = getCartList?.cart_items?.find(
          cartItem => cartItem?.food_item_id === item?._id,
        );
        // console.log('getCartList checkAvailability', checkAvailabilityById);

        let updatedCartList = getCartList?.cart_items;

        if (checkAvailabilityById) {
          updatedCartList = getCartList?.cart_items?.map(data => {
            if (data?.food_item_id == item?._id) {
              return { ...data, quantity: quan };
            }
            return {
              ...data,
            };
          });
          // console.log(
          //   'updatedCartList--',
          //   updatedCartList,
          //   appUser,
          //   restaurant,
          //   getCartList,
          // );
          const resUpdateCart = await updateCart(updatedCartList, appUser, restaurant, getCartList);
          if (resUpdateCart?.statusCode == 200) {
            getUserCart(groupProducts);
          }
        } else {
          // console.log('updateCart--', updatedCartList, appUser, restaurant, [
          //   newItem,
          // ]);
          const resUpdateCart = await updateCart(
            [...updatedCartList, ...[newItem]],
            appUser,
            restaurant,
            getCartList,
          );
          if (resUpdateCart?.statusCode == 200) {
            getUserCart(groupProducts);
          }
        }
        // setTimeout(() => {
        //   getUserCart(groupProducts);
        // }, 500);
      } else {
        setClickItem(newItem);
        setIsRemoveCart(true);
        //  Alert.alert("yes..",'this is otehr restairant you cant not add the list os data')
      }
    } else {
      console.log('setCart--first', appUser, restaurant, [newItem]);
      const resSetCart = await setCart([newItem], appUser, restaurant);
      if (resSetCart?.restaurant_id?.length > 0) {
        getUserCart(groupProducts);
      }
    }
  };

  const getUserCart = async groupProducts => {
    let gettcart = await getCart();
    console.log('getCart:-', gettcart, groupProducts);
    setSelectedCartList(gettcart ?? {});
    // onIDQuantity(gettcart, groupProducts);
    if (gettcart && gettcart?.food_item?.length > 0) {
      let findingResturant = gettcart?.food_item?.every(
        item => item?.restaurant_id === restaurant?._id,
      );
      // console.log('findingResturant--', findingResturant);
      if (findingResturant == true) {
        setIsCart(gettcart);
      }
      onIDQuantity(gettcart, groupProducts);
    } else {
      setVisible(false);
      setIsCart({});
      onIDQuantity(gettcart, groupProducts);
    }
    // setUpdate(!update);
  };

  const onIDQuantity = (cart, groupProducts) => {
    let arr = [...groupProducts];

    if (arr?.length > 0 && cart?.cart_items?.length > 0) {
      const updateMenuData = arr?.map(group => ({
        ...group,
        food_items: group?.food_items?.map(product => {
          const exactItem = cart?.cart_items?.find(
            data => data?.food_item_id === product?._id,
          );
          // console.log('exactItem--', exactItem, product);
          return exactItem
            ? { ...product, quantity: exactItem?.quantity }
            : { ...product, quantity: 0 };
        }),
      }));

      console.log('updateMenuData--', updateMenuData);
      onMenuCount(updateMenuData);
      setGroupProducts([...updateMenuData]);
      setCategoryMenuList(updateMenuData);
    } else {
      const updateData = arr?.map(group => ({
        ...group,
        food_items: group?.food_items?.map(product => ({
          ...product,
          quantity: 0,
        })),
      }));

      onMenuCount(updateData);
      setGroupProducts([...updateData]);
      setCategoryMenuList(updateData);
    }
  };


  const onDeleteCart = async (showPopUp) => {
    const deleteCartData = await deleteCart(isCart, showPopUp);
    console.log('deleteCartData--', deleteCartData);
    if (deleteCartData?.restaurant_id?.length > 0) {
      setIsRemoveCart(false);
      const resSetCart = await setCart([clickItem], appUser, restaurant);
      if (resSetCart?.restaurant_id?.length > 0) { }
      getUserCart(groupProducts);
    } else {
      setIsRemoveCart(false);
    }
    // console.log('setCart--new Rest data', appUser, restaurant, [clickItem]);
    // setTimeout(() => {
    //   getUserCart(groupProducts);
    // }, 1000);
  };

  const onRemoveCart = async orgId => {
    // await deleteCart(orgId);
    // await setCartEmpty();
    setRemoveCart(false);
    getUserCart(groupProducts);
  };

  // const getCartItemsCount = async () => {
  //   const cartItems = await loadCartList();
  //   console.log('user cart c', cartItems );

  //   if (cartItems?.length > 0) {
  //     setIsCart(cartItems);
  //   } else {
  //     setIsCart({});
  //   }
  // };

  const setFirstGroupSelected = (item, index) => {
    // console.log('indexx, item---', index, item);
    const newArrayList = groupProducts?.map((data, i) => {
      if (i === index) {
        return { ...data, expandable: !data.expandable };
      }
      return { ...data };
    });
    setGroupProducts([...newArrayList]);

    // setGroupProducts(prevState =>
    //   prevState?.map(
    //     (group, index) =>
    //       index === indexx ? {...group, expandable: !item.expandable} : group, // Leave other groups unchanged
    //   ),
    // );
  };

  const renderGroups = ({ item, index }) => {
    // console.log('item, index---', item, index);
    let upperItem = item;
    let upperIndex = index;
    return (
      <View
        ref={el => (groupRefs.current[index] = el)}
        key={item?._id || item?.name}
        style={styles.renderCategoryItemView}>
        <View style={styles.categoryRenderView}>
          <Text style={styles.categoryName}>
            {item?.name} ({item?.food_items?.length})
          </Text>
          <TouchableOpacity
            onPress={() => {
              setFirstGroupSelected(item, index);
            }}>
            {
              <SvgXml
                width={15}
                height={15}
                xml={
                  item.expandable
                    ? appImagesSvg.arroeDown
                    : appImagesSvg.arroeUp
                }
              />
            }
          </TouchableOpacity>
        </View>

        {/* Conditionally render the FlatList based on visibility */}

        {item?.expandable && (
          <FlatList
            data={item?.food_items}
            renderItem={({ item, index }) => (
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
                  handleAddRemove(
                    action,
                    upperItem,
                    item,
                    upperIndex,
                    index,
                    quan,
                  );
                }}
                editVarient={() => {
                  CustomizeItem = null;
                  CustomizeItem = item;
                  setVisible(true);
                }}
                removeCart={id => onRemoveCart(id)}
              />
            )}
            keyExtractor={subItem => subItem?._id}
            ItemSeparatorComponent={() => (
              <View style={styles.separateRenderView}>
                {Array?.from({ length: 30 }).map((_, index) => (
                  <View key={index} style={styles.separateRenderDoted} />
                ))}
              </View>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        onScrollEndDrag={() => {
          if (!showFilters) {
            setShowFilters(true);
          }
        }}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={showFilters ? [2] : []}>
        {/* {!showFilters && <Spacer space={'20%'}/>} */}
        <View style={styles.coverBtnView}>
          <FastImage
            style={[
              styles.coverImage,
              {
                opacity: isResOpen ? 1 : 0.6,
              },
            ]}
            source={
              restaurant?.restaurant?.logo?.length > 0
                ? { uri: Url.Image_Url + restaurant?.restaurant?.logo }
                : appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity
            hitSlop={styles.btnHitSlot}
            style={styles.btnTouch}
            onPress={() => {
              navigation.goBack();
            }}>
            <SvgXml
              style={styles.backBtnImage}
              xml={appImagesSvg.whitebackArrow}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantDetailsView}>
          <OrgCard
            org={restaurant}
            isResOpen={isResOpen}
            // offerData={offerData}
            // isResOpenSoon={isResOpenSoon}
            orgOffers={orgOffers}
            onReviews={handleReviewNavigation}
          />
        </View>
        <View style={styles.restaurantScrollViewHold}>
          <ScrollView
            style={{ flex: 1 }}
            horizontal={true}
            nestedScrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: '45%' }}>
            <View style={styles.filterMainView}>
              <View style={[styles.filterView, { opacity: showFilters ? 1 : 0 }]}>
                <SvgXml xml={appImagesSvg.filter} />
                <Text style={styles.filterText}>
                  {'  '}
                  Filter
                </Text>
              </View>
              <GroupsFilter
                mainStyle={styles.filterInnerView}
                onFilter={f => {
                  (filterType = f), handleFilter(f);
                }}
                showFilters={showFilters}
                filterType={filterType}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomLineview} />
        </View>
        {loading == true ? (
          <AnimatedLoader type="restaurantItemLoader" />
        ) : (
          <View style={[styles.categoryFlatlistView]}>
            {groupProducts?.length > 0 ? (
              <>
                <Text style={styles.menuText}>Menu</Text>
                <FlatList
                  style={{ marginTop: '3%' }}
                  data={groupProducts}
                  renderItem={renderGroups}
                  // keyExtractor={item => item?._id || item?.name}
                  keyExtractor={(item, index) =>
                    item?._id ?? `${item?.name}-${index}`
                  }
                  ItemSeparatorComponent={() => (
                    <View style={styles.separateView}>
                      <View style={styles.separateLine} />
                    </View>
                  )}
                />
              </>
            ) : (
              <View style={styles.noDataView}>
                {!loading && (
                  <Text style={styles.noDataText}>No product found</Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {!loading && orgMenu && orgMenu?.length > 0 && <BottomContent />}

      {isCart?.food_item?.length > 0 && !loading && (
        <ViewCartBtn
          isCart={isCart}
          viewCart={() =>
            navigation.navigate('cart', { restaurant })
          }
        />
      )}

      {/* {isOtherCart && !loading && (
        <DashboardCartBtn
          bottom={'6%'}
          isDash={true}
          items={getCartItemsCount(isOtherCart?.cartitems)}
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
        visible={openMenu}
        onClose={() => setOpenMenu(false)}
        onSelectMenu={key => {
          // navigation.navigate('orderPlaced')
          scrollToGroup(key);
        }}
      />

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

          const getCartList = { ...selectedCartList };
          console.log(
            'getCartList OrderCustomization:-',
            getCartList,
            CustomizeItem,
          );

          if (Array?.isArray(getCartList?.cart_items)) {
            const checkAvailabilityById = getCartList?.cart_items?.find(
              cartItem => cartItem?.food_item_id === CustomizeItem?._id,
            );
            // console.log('getCartList checkAvailability', checkAvailabilityById);
            let updatedCartList = getCartList?.cart_items;
            if (checkAvailabilityById) {
              updatedCartList = getCartList?.cart_items?.map(data => {
                if (data?.food_item_id == CustomizeItem?._id) {
                  return { ...data, quantity: quan };
                }
                return {
                  ...data,
                };
              });
              // console.log(
              //   'updatedCartList--',
              //   updatedCartList,
              //   appUser,
              //   restaurant,
              //   getCartList,
              // );
              const resUpdateCart = await updateCart(
                updatedCartList,
                appUser,
                restaurant,
                getCartList,
              );
              if (resUpdateCart?.statusCode == 200) {
                getUserCart(groupProducts);
              }

            } else {
              // console.log('updateCart--', updatedCartList, appUser, restaurant, [
              //   newItem,
              // ]);
              const resUpdateCart = await updateCart(
                [...updatedCartList, ...[CustomizeItem]],
                appUser,
                restaurant,
                getCartList,
              );
              if (resUpdateCart?.statusCode == 200) {
                getUserCart(groupProducts);
              }
            }
          } else {
            console.log('setCart--first', appUser, restaurant, [CustomizeItem]);
            const resSetCart = await setCart([CustomizeItem], appUser, restaurant);
            if (resSetCart?.restaurant_id?.length > 0) {
              getUserCart(groupProducts);
            }

          }
          // setTimeout(() => {
          //   getUserCart(groupProducts);
          // }, 500);
        }}
      />
      <PopUp
        visible={isRemoveCart}
        type={'delete'}
        onClose={() => setIsRemoveCart(false)}
        title={'Confirm Cart Clearance'}
        text={
          'Other restaurant item is already in your cart. Please remove it.? This action cannot be undone.'
        }
        onDelete={() => {
          onDeleteCart(false);
        }}
      />
    </View>
  );
});

export default ResturantProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingBottom: '30%',
    justifyContent: 'center',
  },
  coverBtnView: {
    width: wp('100%'),
    height: hp('25%'),
    position: 'relative',
  },
  coverImage: {
    width: wp('100%'),
    height: hp('25%'),
    opacity: 1,
    backgroundColor: colors.white,
  },
  btnHitSlot: {
    left: 15,
    right: 15,
    top: 15,
    bottom: 15,
  },
  btnTouch: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backBtnImage: {
    top: hp('2%'),
    left: wp('4%'),
  },
  restaurantScrollViewHold: {
    backgroundColor: colors.white,
    paddingBottom: '1%',
    paddingTop: '2%',
  },
  bottomLineview: {
    height: 2,
    backgroundColor: colors.colorD9,
    marginTop: '4%',
  },
  restaurantDetailsView: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: hp('-4%'),
  },
  filterMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('4.5%'),
    width: wp('18%'),
    backgroundColor: colors.colorD45,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.main,
    opacity: 1,
    marginLeft: 20,
  },
  filterText: {
    color: colors.color64,
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
  },
  filterInnerView: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  categoryFlatlistView: {
    flex: 1,
    justifyContent: 'center',
  },
  menuText: {
    color: colors.color3D,
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    marginTop: '3%',
    width: wp('100%'),
    textAlign: 'center',
    backgroundColor: colors.white,
  },
  separateView: {
    paddingVertical: '3%',
    justifyContent: 'center',
  },
  separateLine: {
    height: hp('0.4%'),
    backgroundColor: colors.colorF4,
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('20%'),
  },
  noDataText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  renderCategoryItemView: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  categoryRenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    color: colors.color3D,
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
  },
  separateRenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  separateRenderDoted: {
    width: 4,
    height: 1,
    borderRadius: 2,
    backgroundColor: colors.color83,
    marginHorizontal: 2,
  },
  restaurantLoaderView: {
    flex: 1,
    // position: 'absolute',
    backgroundColor: colors.white,
  },
  menuBtnTouch: {
    position: 'absolute',
    bottom: '3%',
    backgroundColor: colors.color64,
    height: hp('4.2%'),
    width: wp('24%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
  },
  menuBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  menuBtnText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.white,
    marginLeft: '6%',
    textTransform: 'uppercase',
  },
});
