import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImagesSvg} from '../commons/AppImages';
import Popover, {PopoverPlacement} from 'react-native-popover-view';

const AddressCard = ({item, index, onPress, onPressDelete, onPressEdit}) => {
  const [showPopover, setShowPopover] = useState(false);

  const setIcon = item => {
    switch (item) {
      case 'Home':
        return appImagesSvg.homeIcom;
      case 'Work':
        return appImagesSvg.workAddresIcon;
      case 'Hotel':
        return appImagesSvg.hotelIcon;
      default:
        return appImagesSvg.addressIcon;
    }
  };

  const onPressDeleted = () => {
    console.log('Delete button pressed');
    // Add your delete logic here
    setShowPopover(false);
    setTimeout(() => {
      onPressDelete();
    }, 1000);
  };

  const onPressEdited = () => {
    console.log('Delete button pressed');
    setShowPopover(false);
    setTimeout(() => {
      onPressEdit();
    }, 1000);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}>
      <View style={styles.main} key={index}>
        <View style={styles.imageTextView}>
          <SvgXml xml={setIcon(item?.title)} />
          <Text style={styles.title}>{item?.title}</Text>
          {/* <TouchableOpacity
            // onPress={onPressDot}
            onPress={()=>{setShowPopover(true)}}
            hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}
            activeOpacity={0.8}>
            <SvgXml xml={appImagesSvg.dotedImageIcon} />
          </TouchableOpacity> */}
          <Popover
            placement={PopoverPlacement.AUTO}
            isVisible={showPopover}
            onRequestClose={() => setShowPopover(false)} // Close on tap outside
            from={
              <TouchableOpacity
                hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}
                onPress={() => setShowPopover(true)}>
                <SvgXml xml={appImagesSvg.dotedImageIcon} />
              </TouchableOpacity>
            }>
            <View style={styles.mainBottomEditDel}>
              {/* First Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.popoverButtonDel}
                onPress={() => {
                  onPressDeleted();
                }}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              {/* Second Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.popoverButtonEdit}
                onPress={() => {
                  onPressEdited();
                }}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </Popover>
        </View>
        <Text style={styles.addressText}>{item?.address}</Text>
        <View style={styles.bottonLineView} />
      </View>
    </TouchableOpacity>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    justifyContent: 'center',
  },
  main: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  imageTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginLeft: '3%',
  },
  addressText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color64,
    marginLeft: '8%',
    marginTop: '1%',
    lineHeight: 20,
  },
  bottonLineView: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '5%',
    marginHorizontal: -5,
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
  mainBottomEditDel: {
    width: wp('30%'),
    padding: 10,
    justifyContent: 'center',
    bottom: 5,
  },
  popoverButtonDel: {
    backgroundColor: colors.red,
    marginHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    borderRadius: 5,
  },
  popoverButtonEdit: {
    backgroundColor: colors.grey,
    marginHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    borderRadius: 5,
  },
});
