import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  action,
  computed,
  decorate,
  observable,
  runInAction,
  makeAutoObservable,
} from 'mobx';
import { useEffect, usestate } from 'react';
import { agent } from '../api/agent';
import { useToast } from '../halpers/useToast';

export default class CartStore {
  selectedAddress = {};
  cartItemData = {}
  constructor() {
    // this.setTokenFromStorage();
    // this.setAppUserFromStorage();
  }

  // get token() {
  //   if (!this.internalToken) this.setTokenFromStorage();
  //   return this.internalToken;
  // }

  // get appUser() {
  //   if (!this.internalAppUser) this.setAppUserFromStorage();
  //   return this.internalAppUser;
  // }

  // generateUID = (id, vcId, addons) => {
  //   let isVcID = vcId ? true : false;
  //   let isAddons = addons && addons.length > 0 ? true : false;
  //   let getaddonId = isAddons
  //     ? addons.reduce((total, item) => {
  //         return total + item.addon_prod_id;
  //       }, 0)
  //     : null;
  //   let addonId = getaddonId && getaddonId > 0 ? getaddonId : null;

  //   console.log('is varient and is addons', isVcID, isAddons);

  //   if (isVcID && isAddons) {
  //     return `${id}${vcId}${addonId}`;
  //   } else if (isVcID && !isAddons) {
  //     return `${id}${vcId}`;
  //   } else if (!vcId && isAddons) {
  //     return `${id}${addonId}`;
  //   } else {
  //     return `${id}`;
  //   }
  // };

  // checkUID = (cart, nItem) => {
  //   if (cart.find(i => i.itemsUID === nItem.itemsUID)) {
  //     return true;
  //   } else {
  //     false;
  //   }
  // };

  // setCart = async (
  //   item,
  //   quantity,
  //   vcId,
  //   vcName,
  //   vcPrice,
  //   resturant,
  //   addons,
  //   iPrice,
  // ) => {
  //  console.log('item, quantity,vcId,vcName,vcPrice,resturant,addons,iPrice',item, quantity,vcId,vcName,vcPrice,resturant,addons,iPrice);
  //   const varientProps = vcId
  //     ? {
  //         varient_id: vcId,
  //         varient_name: vcName,
  //         varient_price: vcPrice,
  //       }
  //     : {
  //         varient_id: null,
  //         varient_name: null,
  //         varient_price: null,
  //       };

  //   const cartItem = {
  //     add_on: null,
  //     add_on_amount: null,
  //     grand_total: iPrice * item.quantity,
  //     product: {...item, quantity: quantity},
  //     product_id: item?.id,
  //     quantity: quantity,
  //     sub_total: item.iPrice,
  //     org_id: item?.org_id ? item?.org_id : resturant.id,
  //     total_amount: item.iPrice * item.quantity,
  //     addon_item: addons && addons.length > 0 ? addons : [],
  //     ...varientProps,
  //     itemsUID: item.itemsUID,
  //     // itemsUID: this.generateUID(item?.id, vcId, addons),
  //   };

  //   console.log('cart item for action:', cartItem);

  //   let cart = await this.loadCartList();

  //   const appcart = {
  //     cartitems: [],

  //     cooking_instructions_audio: cart?.cooking_instructions_audio
  //       ? cart.cooking_instructions_audio
  //       : null,
  //     cooking_instructions_text: cart?.cooking_instructions_text
  //       ? cart?.cooking_instructions_text
  //       : null,
  //     coupon_amount: null,
  //     coupon_code: null,
  //     id: null,
  //     org_id: item?.org_id ? item?.org_id : resturant.id,
  //     orgdata: resturant,
  //     packing_fee: null,
  //     status: 'new',
  //     tax_amount: null,
  //     total_amount: null,
  //   };

  //   if (cart) {
  //     console.log('previous cart', cart);
  //     // if (this.checkVarientItem(cart, item, vcId)) {
  //     if (this.checkUID(cart, cartItem)) {
  //       console.log('exist item');
  //       // let updatecart = vcId
  //       //   ? cart.cartitems.map(i =>
  //       //       i.product_id === item.id && i.varient_id === vcId
  //       //         ? {...cartItem}
  //       //         : i,
  //       //     )
  //       //   : cart.cartitems.map(i =>
  //       //       i.product_id === item.id ? {...cartItem} : i,
  //       //     );
  //       // let updatecart = cart.map(i =>
  //       //   i.itemsUID === cartItem.itemsUID ? {...cartItem.product} : console.log(i),
  //       // );
  //       let updatecart = [];
  //       cart.map(i => {
  //         if (i.itemsUID === cartItem.itemsUID) {
  //           updatecart = [{...cartItem.product}];
  //         }
  //       });

  //       console.log('updatecart>', updatecart);
  //       let removeZero = updatecart.filter(i => i.quantity != 0);
  //       // appcart.cartitems = removeZero;
  //       //cart = removeZero.length == 0 ? null : appcart;
  //       console.log('exisiting cart', updatecart);
  //       await this.updateCartItemInAsync(updatecart);
  //     } else {
  //       console.log('increment cart item');
  //       let additem = [...cart, {...cartItem}];
  //       let removeZero = additem.filter(i => i.quantity != 0);
  //       appcart.cartitems = removeZero;
  //       cart = removeZero.length == 0 ? null : appcart;
  //       console.log('increment cart', cart);
  //     }
  //   } else {
  //     appcart.cartitems.push(cartItem);
  //     cart = appcart;
  //   }

  //   // if (quantity == 0) {
  //   //   this.deletItemToCart(cartItem?.itemsUID);
  //   // } else {
  //   //   this.addItemToCart(cartItem);
  //   // }
  //   console.log('finn>', cart);
  // };

  // deletItemToCart = async id => {
  //   const request = {itemsUID: id};
  //   console.log('request delete item from cart', request);
  //   try {
  //     const res = await agent.deleteCartItem(request);
  //     console.log('Delete cart Item result', res);
  //   } catch (error) {
  //     console.log('error', error);
  //     throw error;
  //   }
  // };

  // // Load food items from AsyncStorage
  // loadCartList = async () => {
  //   try {
  //     const storedFoodItems = await AsyncStorage.getItem('cartList');
  //     if (storedFoodItems) {
  //       //setCartList(JSON.parse(storedFoodItems));
  //       console.log('cartList', JSON.parse(storedFoodItems));
  //       return JSON.parse(storedFoodItems);
  //     } else {
  //       console.log('cartList>empty');
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error('Error loading food items from AsyncStorage:', error);
  //   }
  // };

  // getRestraurent = async () => {
  //   try {
  //     const restraurent = await AsyncStorage.getItem('restraurent');
  //     if (restraurent) {
  //       //setCartList(JSON.parse(storedFoodItems));
  //       console.log('restraurent', JSON.parse(restraurent));
  //       return JSON.parse(restraurent);
  //     } else {
  //       console.log('cartList>empty');
  //       return {};
  //     }
  //   } catch (error) {
  //     console.error('Error loading food items from AsyncStorage:', error);
  //   }
  // };
  // deleteCart = async () => {
  //   try {
  //     await AsyncStorage.removeItem('cartList');
  //     await AsyncStorage.removeItem('restraurent');
  //   } catch (error) {
  //     console.error('Error loading food items from AsyncStorage:', error);
  //   }
  // };

  //  getIPrice =  updatedItem => {
  //   if (updatedItem?.addons && updatedItem?.addons.length > 0) {
  //     let addonsTotalPrice = updatedItem?.addons.reduce((total, item) => {
  //       return total + item.addon_price;
  //     }, 0);
  //     return (parseInt(updatedItem?.sellingprice) + parseInt(addonsTotalPrice)) * updatedItem.quantity ;
  //   } else {
  //     return updatedItem?.sellingprice * updatedItem.quantity ;
  //   }
  // };

  // updateCartItemInAsync = async updatedItem => {
  //   console.log('Updated item>', updatedItem);
  //   try {
  //     // Retrieve the current cart items
  //     const storedItems = await AsyncStorage.getItem('cartList');
  //     const cartItems = storedItems ? JSON.parse(storedItems) : []; // If cartList exists, parse it; else, start with an empty array
  //     console.log('cartItems>', cartItems);

  //     // Find the index of the item to update based on its product_id or any unique identifier
  //     const itemIndex = cartItems.findIndex(
  //       item => item.itemsUID === updatedItem[0].itemsUID,
  //     );

  //     if (itemIndex !== -1) {
  //       if (updatedItem[0].quantity !== 0) {
  //         // If the item exists, update it with the new data
  //         cartItems[itemIndex] = {
  //           ...cartItems[itemIndex], // keep existing properties
  //           quantity: updatedItem[0].quantity, // update the quantity
  //           //sellingprice: updatedItem[0].sellingprice* updatedItem[0].quantity,
  //           //subtotalprice: updatedItem[0].sellingprice* updatedItem[0].quantity,
  //           finalprice: this.getIPrice(updatedItem[0]),

  //           //  dfd   finalprice: updatedItem[0].sellingprice * updatedItem[0].quantity,
  //           //total_amount: updatedItem.product.iPrice * updatedItem.quantity, // update total_amount
  //           //grand_total: updatedItem.product.iPrice * updatedItem.quantity, // update grand_total
  //         };
  //         console.log('Updated cart item:', cartItems[itemIndex]);
  //       } else {
  //         cartItems.splice(itemIndex, 1);
  //       }
  //     } else {
  //       console.log('Item not found in cart.');
  //     }
  //     // Save the updated cart list back to AsyncStorage
  //     await AsyncStorage.setItem('cartList', JSON.stringify(cartItems));

  //     console.log('Updated cart:', cartItems);
  //   } catch (error) {
  //     console.error('Error updating cart item in AsyncStorage:', error);
  //   }
  // };

  // // Save food items to AsyncStorage
  // saveCartItem = async (items, restorentObj) => {
  //   console.log('itmm>', items);
  //   try {
  //     // Retrieve the current cart items
  //     const storedItems = await AsyncStorage.getItem('cartList');
  //     const cartItems = storedItems ? JSON.parse(storedItems) : []; // If cartList exists, parse it; else, start with an empty array
  //     // var cartItems =[];
  //     // Add the new item to the list
  //     cartItems.push(items);

  //     console.log('cartItems>', cartItems);
  //     console.log('restorentObj>', restorentObj);

  //     // Save the updated list back to AsyncStorage
  //     await AsyncStorage.setItem('cartList', JSON.stringify(cartItems));
  //     await AsyncStorage.setItem('restraurent', JSON.stringify(restorentObj));
  //   } catch (error) {
  //     console.error('Error saving food items to AsyncStorage:', error);
  //   }
  // };

  /////

  setCart = async (cartArray, appUser, restaurant) => {
    // handleLoading(true)
    let requestData = {
      restaurant_id: restaurant?._id,
      user_id: appUser?._id,
      cart_items: cartArray,
    };
    console.log(
      'requestData setCart1: ',
      requestData,
      cartArray,
      appUser,
      restaurant,
    );
    //  return
    try {
      const res = await agent.setCart(requestData);
      console.log('setCart1 Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        // handleLoading(false);
        this.cartItemData == res?.data ?? {}
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        // handleLoading(false);
        this.cartItemData == {}
        return [];
      }
    } catch (error) {
      console.log('error setCart1:', error);
      // handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  updateCart = async (cartArray, appUser, restaurant, cart, addOnData) => {
    let filterData = cartArray?.filter(item => item?.quantity >= 1) || [];
    console.log('filterData--', filterData);
    let addonsData = {
      ...addOnData
    }
    console.log('addonsData--', addonsData?.add_on_items);

    let requestData = {
      restaurant_id: restaurant?._id,
      user_id: appUser?._id,
      cart_items: filterData,
      cart_id: cart?._id,
      selected_add_on: addonsData ?? {},
    };

    console.log('requestData,addonsData--', requestData, addonsData?.add_on_items);

    console.log(
      'requestData updateCart: ',
      requestData,
      cartArray,
      appUser,
      restaurant,
      cart,
      addonsData
    );
    //  return
    try {
      const res = await agent.updateCart(requestData);
      console.log('updateCart Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        return res;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        // handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error updateCart:', error);
      // handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  getCart = async () => {
    let requestData = {};

    console.log('requestData getCart: ', requestData);
    try {
      const res = await agent.getCart(requestData);
      console.log('getCart Res : ', res);
      if (res?.statusCode == 200) {
        return res?.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log('error getCart:', error);
      return [];
    }
  };

  deleteCart = async (cart, showPopUp) => {
    let requestData = {
      cart_id: cart?._id,
    };
    console.log('requestData deleteCart: ', requestData);
    try {
      const res = await agent.deleteCart(requestData);
      console.log('deleteCart Res : ', res);
      if (res?.statusCode == 200) {
        if (showPopUp) { useToast(res?.message, 1) };
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        return [];
      }
    } catch (error) {
      console.log('error deleteCart:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  deleteCartWithoutPopUp = async cart => {
    let requestData = {
      cart_id: cart?._id,
    };
    console.log('requestData deleteCart: ', requestData);
    try {
      const res = await agent.deleteCart(requestData);
      console.log('deleteCart Res : ', res);
      if (res?.statusCode == 200) {
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        return [];
      }
    } catch (error) {
      console.log('error deleteCart:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  setSelectedAddress = async (data) => {
    this.selectedAddress = data
  }


  calculateDeliveryFee = async (address, cartList) => {
    // console.log("address,cartList-", address, cartList);
    // console.log("address,cartList-", address?.geo_location, cartList?.restaurant?.location);
    let requestData = {
      cart_id: cartList?._id,
      customer_location: address?.geo_location,
      rest_location: {
        lat: cartList?.restaurant?.location?.coordinates[1],
        lng: cartList?.restaurant?.location?.coordinates[0],
      }

    };
    console.log(
      'requestData calculateDeliveryFee: ',
      requestData,
    );
    //  return
    try {
      const res = await agent.calculateDeliveryFee(requestData);
      console.log('calculateDeliveryFee Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        return [];
      }
    } catch (error) {
      console.log('error calculateDeliveryFee:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };


}
