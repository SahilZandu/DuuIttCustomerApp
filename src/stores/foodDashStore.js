import { action, computed, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';

export default class FoodDashStore {
  restaurentList = [];
  allCategoryList = [];
  categoryMenuList = [];
  favoriteRestaurantList = [];
  repeatedOrderList = [];
  recommendedOrderList = [];
  foodOrderTrackingList = [];
  mealOrderList = [];
  changeLiveLocation = {
    address: '',
    geoLocation: {},
  }

  restaurentAll = async (geoLocation, selectedFilter, limit, handleLoading) => {
    // let vegNonVeg='';
    let requestData;
    if (selectedFilter === 'veg' || selectedFilter === 'non-veg') {
      requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
        veg_non_veg: selectedFilter,
        // limit: limit,
      };
    } else if (selectedFilter === 'price_low') {
      requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
        price_low: selectedFilter,
        // limit: limit,
      };
    } else {
      requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
      };
    }

    console.log('requestData retaurentsList', requestData, limit);

    try {
      const res = await agent.restaurentAll(requestData);
      console.log('restaurentAll Res : ', res);
      if (res?.statusCode == 200) {
        this.restaurentList = res?.data;
        handleLoading(false);
        return res?.data;
      } else {
        this.restaurentList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurentAll:', error);
      handleLoading(false);
      return [];
    }
  };

  allDishCategory = async handleLoading => {
    try {
      const res = await agent.allDishCategory();
      console.log('allDishCategory Res : ', res);
      if (res?.statusCode == 200) {
        this.allCategoryList = res?.data ?? [];
        handleLoading(false);
        return res?.data;
      } else {
        this.allCategoryList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error allDishCategory:', error);
      handleLoading(false);
      return [];
    }
  };

  restaurantListAccordingCategory = async (menuId, handleLoading) => {
    let requestData = {
      menu_group_id: menuId,
    };
    try {
      const res = await agent.restaurantListAccordingCategory(requestData);
      console.log('restaurant List According Category Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading(false);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurant List According Category:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  restaurantUnderMenuGroup = async (restaurantId, handleLoading) => {
    let requestData = {
      restaurant_id: restaurantId,
    };
    try {
      const res = await agent.restaurantUnderMenuGroup(requestData);
      console.log('restaurant Under Menu Group Res : ', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurant Under Menu Group:', error);
      handleLoading(false);
      return [];
    }
  };

  setCategoryMenuList = async data => {
    this.categoryMenuList = data;
  };

  restaurantListForDishCategory = async (item, handleLoading) => {
    handleLoading(true);
    let requestData = {
      dish_name: item?.name,
    };
    try {
      const res = await agent.restaurantListForDishCategory(requestData);
      console.log('restaurant List For Dish Category Res : ', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurant List For Dish Category:', error);
      handleLoading(false);
      return [];
    }
  };

  restaurantCustomerLikeDislike = async item => {
    let requestData = {
      restaurant_id: item?.id,
      is_like: item?.like,
    };
    console.log('requestData--restaurantCustomerLikeDislike', requestData);
    try {
      const res = await agent.restaurantCustomerLikeDislike(requestData);
      console.log('restaurant  CustomerLikeDislike Res : ', res);
      if (res?.statusCode == 200) {
        return res;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        return {};
      }
    } catch (error) {
      console.log('error restaurant CustomerLikeDislike:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return {};
    }
  };

  restaurantLikedByCustomer = async handleLoading => {
    let requestData = {};
    try {
      const res = await agent.restaurantLikedByCustomer(requestData);
      console.log('restaurant LikedByCustomer Res : ', res);
      if (res?.statusCode == 200) {
        this.favoriteRestaurantList = res?.data ?? [];
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        this.favoriteRestaurantList = [];
        return [];
      }
    } catch (error) {
      console.log('error restaurant LikedByCustomer:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      this.favoriteRestaurantList = [];
      return [];
    }
  };

  foodOrder = async (payload, handleLoading, navigation) => {
    handleLoading(true);
    let requestData = {
      ...payload,
    };

    console.log('requestData----foodOrder', requestData, payload);

    try {
      const res = await agent.foodOrder(requestData);
      console.log('foodOrder Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading(false);
        navigation.navigate('orderPlaced', {
          restaurant: [],
        });
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
      }
    } catch (error) {
      console.log('error foodOrder:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  getRepeatedOrderList = async (geoLocation, handleLoading) => {
    let requestData = {
      delivery_address: {
        geo_location: {
          lng: geoLocation?.lng,
          lat: geoLocation?.lat,
        }
      }
    }

    console.log("requestData---", requestData);

    try {
      const res = await agent.getRepeatedOrderList(requestData);
      console.log('restaurant getRepeatedOrderList Res : ', res);
      if (res?.statusCode == 200) {
        this.repeatedOrderList = res?.data?.orders ?? [];
        handleLoading(false);
        return res?.data?.orders;
      } else {
        this.repeatedOrderList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurant getRepeatedOrderList:', error);
      this.repeatedOrderList = [];
      handleLoading(false);
      // const m = error?.data?.message
      //   ? error?.data?.message
      //   : 'Something went wrong';
      // useToast(m, 0);
      return [];
    }
  };

  getRecomendedItems = async (geoLocation, handleLoading) => {
    let requestData = {
      near_by: {
        lng: geoLocation?.lng,
        lat: geoLocation?.lat,
      }
    }

    try {
      const res = await agent.getRecomendedItems(requestData);
      console.log('restaurant getRecomendedItems Res : ', res);
      if (res?.statusCode == 200) {
        this.recommendedOrderList = res?.data?.data ?? [];
        handleLoading(false);
        return res?.data?.data;
      } else {
        this.recommendedOrderList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurant getRecomendedItems:', error);
      this.recommendedOrderList = [];
      handleLoading(false);
      // const m = error?.data?.message
      //   ? error?.data?.message
      //   : 'Something went wrong';
      // useToast(m, 0);
      return [];
    }
  };

  getFoodOrderTracking = async handleLoading => {
    try {
      const res = await agent.getFoodOrderTracking();
      console.log('getFoodOrderTracking Res : ', res);
      if (res?.statusCode == 200) {
        this.foodOrderTrackingList = res?.data ?? [];
        handleLoading(false);
        return res?.data;
      } else {
        this.foodOrderTrackingList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error getFoodOrderTracking:', error);
      handleLoading(false);
      return [];
    }
  };

  getCompleteMealItems = async (restaurant, handleLoading) => {
    let requestData = {
      restaurant_id: restaurant?._id,
    };
    console.log('requestData---getCompleteMealItems', requestData);
    try {
      const res = await agent.completeMealItems(requestData);
      console.log('getCompleteMealItems Res : ', res);
      if (res?.statusCode == 200) {
        this.mealOrderList = res?.data ?? [];
        handleLoading(false);
        return res?.data;
      } else {
        this.mealOrderList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error getCompleteMealItems:', error);
      handleLoading(false);
      return [];
    }
  };

  setChangeLiveLocation = (data) => {
    this.changeLiveLocation = data
  }

}
