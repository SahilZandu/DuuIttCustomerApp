import React, {useState, useEffect} from 'react';
import {Text, View, Pressable, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  AppImages,
  appImages,
  appImagesSvg,
  //  Fonts,
  latoFonts,
} from '../../commons/AppImages';
import {fonts} from '../../theme/fonts/fonts';
import {fontsDmSan} from '../../theme/fonts/fontsDmSan';
import Base_Image_Url from '../../api/Url';
import {SvgXml} from 'react-native-svg';
// import Spacer from '../Spacer';
import FastImage from 'react-native-fast-image';
import {colors} from '../../theme/colors';
// import LikeButton from '../LIkeBtn';

function NumToTime(num) {
  var hours = Math.floor(num / 60);
  var minutes = num % 60;
  if (minutes + ''.length < 2) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}

function calculateTime(distance, speed) {
  if (distance) {
    let timeInSeconds = (distance / speed) * 3600;
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds % 3600) / 60);
    let seconds = Math.round(timeInSeconds % 60);

    if (hours == 0 && minutes == 0) {
      return seconds + ' sec';
    } else if (hours == 0) {
      return minutes + ' min';
    } else {
      return hours + ' h' + ' ' + minutes + ' min';
    }
  } else {
    return '0 sec';
  }
}

const RestaurantsCard = ({item, navigation, isHorizontal, onLike }) => {
  const distnace = item?.distance && item?.distance?.toFixed(1) + ' ' + 'KM';
console.log('item>>',item)
  const [like, setLike] = useState(item?.islike == 1 ? true : false);
  const [isResOpen, setIsResOpen] = useState(
    item.is_online ? true : false,
 
  );

  useEffect(() => {
    setLike(item?.islike == 1 ? true : false);
  }, [item?.islike]);

  return (
    <View style={{backgroundColor: '#ffffff', marginBottom: 20}}>
      <View
        style={{
          opacity: isResOpen ? 1 : 0.4,
          backgroundColor: '#FEF0F3', // Example color (can be any color)
          height: hp('10%'), // Height of the bottom view
          borderBottomLeftRadius: 20, // Rounded bottom-left corner
          borderBottomRightRadius: 90, // Optional rounded bottom-right corner
          width: '70%', // Full width of the parent view
          position: 'absolute',
          bottom: 0, // Align at the bottom of the parent view
          // paddingHorizontal: wp('3%'), // Padding from the sides for better spacing
          justifyContent: 'center', // Center items vertically within the bottom view
          alignItems: 'center', // Center items horizontally within the bottom view
          paddingTop: wp('6%'),
        }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            marginStart: 10,
          }}>
          <SvgXml 
          xml={isResOpen ? flat : flatOfline } />
          <Text style={{
            color: isResOpen ?'#ED0826': 'rgba(0, 0, 0, 0.65)', 
            fontFamily:fonts.semiBold,
            marginStart: 4}}>
            Flat 125 OFF above 319
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() =>
          // alert('under progress')
          (item.is_online)?
          navigation.navigate('resturantProducts', {
            item: item,
          })
        : ''
        }
        style={[
          styles.container,
          {
            opacity: isResOpen ? 1 : 0.5,

            width: isHorizontal ? wp('85%') : wp('95%'),
          },
        ]}>
        {/* <Image
        resizeMode="cover"
        style={[
          styles.cover,
          {
            width: isHorizontal ? wp('65%') : wp('90%'),
            height: isHorizontal ? hp('12%') : hp('18%'),
          },
        ]}
        source={
          item?.logo
            ? {uri: Base_Image_Url?.Base_Image_Url + item?.logo}
            : AppImages.orgPlaceholder
        }
      /> */}
        <View
          style={{
            // width: isHorizontal ? wp('79%') : wp('89%'),
            width: isHorizontal ? wp('85%') : wp('95%'),
            alignSelf: 'center',
            // marginTop: wp('3%'),
          }}>
          <FastImage
            style={[
              styles.cover,
              {
                // width: isHorizontal ? wp('79%') : wp('89%'),
                width: isHorizontal ? wp('85%') : wp('95%'),
                height: isHorizontal ? hp('20%') : hp('25%'),
              },
            ]}
            source={
              item?.logo
                ? {uri: Base_Image_Url?.Base_Image_Url + item?.logo}
                : appImages.foodIMage
            }
            resizeMode={FastImage.resizeMode.cover}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.white,
              alignSelf: 'flex-start',
              marginTop: -20,
              borderRadius: 20,
              marginStart:wp('4%'),
              height: 40,
              width:200,
              elevation: 2,
              
              shadowOffset: {width: -1, height: 6},
            }}>
            <View
              style={{
                flex:1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#28B056',
                borderBottomStartRadius:20,
                borderTopStartRadius:20,
                height: 40,
                padding:10
              }}>
              <SvgXml
                fill={isResOpen ? '#ffffff' : 'rgba(0, 0, 0, 0.65)'}
                xml={startIcon}
              />
              <Text
                style={{
                  color: isResOpen ? '#ffffff' : 'rgba(0, 0, 0, 0.65)',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(12),
                }}>
                3.9
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F1F2F6',
                padding:10,
                height: 40,
              }}>
            
              <Text
                style={{
                  color: isResOpen ? '#272525' : 'rgba(0, 0, 0, 0.65)',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(12),
                }}>
                25-30 min
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderBottomEndRadius:20,
                borderTopEndRadius:20,
                height: 40,
                padding:10
              }}>
            
              <Text
                style={{
                  color: isResOpen ? '#272525' : 'rgba(0, 0, 0, 0.65)',
                  fontFamily: fonts.medium,
                  fontSize: RFValue(12),
                }}>
                1 km
              </Text>
            </View>
          </View>

          <View style={{position: 'absolute', right: 0, top: 0}}>
            <SvgXml xml={likebgbtn} />

            <Pressable
              onPress={() => setLike(!like)}
              style={{position: 'absolute', top: 10, right: 10}}>
              {/* <SvgXml xml={like} /> */}
              {/* <LikeButton
              likedColor="#FF6767"
              unlikedColor="white"
              liked={like}
              onPress={() => {
                setLike(!like);
                onLike(!like);
              }}
            /> */}
            </Pressable>
          </View>

          {item?.veg_non_veg == 'veg' && (
            <View
              style={{
                marginTop: 20,
                position: 'absolute',
                top: 0, // Align to top
                right: 0, // Align to right
                justifyContent: 'center',
                width: wp('28%'),
                backgroundColor: 'white', // White background
                borderTopLeftRadius: 20, // Rounded top-left corner
                borderBottomLeftRadius: 20, // Rounded bottom-left corner
                zIndex: 1, // Ensure the element is above others if needed
              }}>
              <Image
                resizeMode="contain"
                style={{height: hp('5%'), width: wp('29%')}}
                source={appImagesSvg.typeVeg}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  paddingLeft: '5%',
                }}>
                <SvgXml
                  fill={isResOpen ? '#1D721E' : 'rgba(0, 0, 0, 0.65)'}
                  xml={pureVeg}
                />
                <Text
                  style={{
                    color: isResOpen ? '#1D721E' : 'rgba(0, 0, 0, 0.65)',
                    fontFamily: fontsDmSan.medium,
                    fontSize: RFValue(12),
                  }}>
                  {'  '}Pure Veg
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* <Spacer space={'3%'} /> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingHorizontal: wp('4%'),
          }}>
          <Text
            numberOfLines={isHorizontal ? 1 : 2}
            style={{
              fontSize: RFValue(20),
              fontFamily: fontsDmSan.semiBold,
              color: isResOpen ? 'black' : 'rgba(0, 0, 0, 0.65)',
              maxWidth: isHorizontal ? wp('60%') : wp('72%'),
              textTransform: 'capitalize',
              marginTop:10
            }}>
            {item?.name}
          </Text>

          <Image
           style={{width:24,height:24,
            marginTop:10,
          }}
          resizeMode="contain"
            source={appImages.likeIcon}/>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '2%',
            paddingHorizontal: wp('4%'),
            marginBottom: wp('3%'),
          }}>
          <Text
            style={{
              fontSize: RFValue(13),
              fontFamily: fonts.medium,
              color: '#646464',
            }}>
{item?.about}
          </Text>
        </View>

        {!isResOpen && (
          <Text
            style={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              color: 'red',
              fontSize: RFValue(12),
              fontFamily: fonts.medium,
              textAlign: 'center',
            }}>
            Currently not accepting orders.
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default RestaurantsCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 2,
    borderColor: '#D9D9D9',
    // shadowColor: '#D9D9D9',
    shadowOffset: {width: -1, height: 6},
    // shadowOpacity: 0.6,
    // shadowRadius: 5,
    //paddingBottom: hp('2%'),
    marginBottom: hp('6%'),
    // padding: hp('1.5%'),
  },
  cover: {
    // borderRadius: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // borderBottomWidth: 0.5,
    // borderColor: '#D9D9D9',
  },
});

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
<g clip-path="url(#clip0_2821_968)">
<path d="M5.25 2.24999V1.08333H8.75V2.24999H5.25ZM6.41667 8.66666H7.58333V5.16666H6.41667V8.66666ZM7 13.3333C6.28056 13.3333 5.60233 13.1949 4.96533 12.918C4.32872 12.6407 3.77222 12.2639 3.29583 11.7875C2.81944 11.3111 2.44261 10.7546 2.16533 10.118C1.88844 9.481 1.75 8.80277 1.75 8.08333C1.75 7.36388 1.88844 6.68566 2.16533 6.04866C2.44261 5.41205 2.81944 4.85555 3.29583 4.37916C3.77222 3.90277 4.32872 3.52613 4.96533 3.24924C5.60233 2.97197 6.28056 2.83333 7 2.83333C7.60278 2.83333 8.18125 2.93055 8.73542 3.12499C9.28958 3.31944 9.80972 3.60138 10.2958 3.97083L11.1125 3.15416L11.9292 3.97083L11.1125 4.78749C11.4819 5.27361 11.7639 5.79374 11.9583 6.34791C12.1528 6.90208 12.25 7.48055 12.25 8.08333C12.25 8.80277 12.1116 9.481 11.8347 10.118C11.5574 10.7546 11.1806 11.3111 10.7042 11.7875C10.2278 12.2639 9.67128 12.6407 9.03467 12.918C8.39767 13.1949 7.71944 13.3333 7 13.3333ZM7 12.1667C8.12778 12.1667 9.09028 11.7681 9.8875 10.9708C10.6847 10.1736 11.0833 9.21111 11.0833 8.08333C11.0833 6.95555 10.6847 5.99305 9.8875 5.19583C9.09028 4.39861 8.12778 3.99999 7 3.99999C5.87222 3.99999 4.90972 4.39861 4.1125 5.19583C3.31528 5.99305 2.91667 6.95555 2.91667 8.08333C2.91667 9.21111 3.31528 10.1736 4.1125 10.9708C4.90972 11.7681 5.87222 12.1667 7 12.1667Z" fill="#1D721E"/>
</g>
<defs>
<clipPath id="clip0_2821_968">
<rect width="14" height="14" fill="white" transform="translate(0 0.5)"/>
</clipPath>
</defs>
</svg>`;

const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" >
<path d="M7 0L9.26297 3.88528L13.6574 4.83688L10.6616 8.18972L11.1145 12.6631L7 10.85L2.8855 12.6631L3.33843 8.18972L0.342604 4.83688L4.73703 3.88528L7 0Z" />
</svg>`;

const flat = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6.5" cy="6.5" r="6.5" fill="#ED0826"/>
<path d="M8.14469 3.76746L9.02015 4.64293L4.64281 9.02028L3.76734 8.14476L8.14469 3.76746ZM5.29942 5.2995C4.93677 5.66213 4.34884 5.66213 3.98621 5.2995C3.62358 4.93692 3.62358 4.34896 3.98621 3.98633C4.34884 3.6237 4.93677 3.6237 5.29942 3.98633C5.66206 4.34896 5.66206 4.93692 5.29942 5.2995ZM7.48807 8.80139C7.12543 8.43875 7.12543 7.85084 7.48807 7.4882C7.8507 7.12556 8.43861 7.12556 8.80125 7.4882C9.16389 7.85084 9.16389 8.43875 8.80125 8.80139C8.43861 9.16402 7.8507 9.16402 7.48807 8.80139Z" fill="white"/>
</svg>`;
const flatOfline = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6.5" cy="6.5" r="6.5" fill="#D3D3D3"/>
<path d="M8.14469 3.76746L9.02015 4.64293L4.64281 9.02028L3.76734 8.14476L8.14469 3.76746ZM5.29942 5.2995C4.93677 5.66213 4.34884 5.66213 3.98621 5.2995C3.62358 4.93692 3.62358 4.34896 3.98621 3.98633C4.34884 3.6237 4.93677 3.6237 5.29942 3.98633C5.66206 4.34896 5.66206 4.93692 5.29942 5.2995ZM7.48807 8.80139C7.12543 8.43875 7.12543 7.85084 7.48807 7.4882C7.8507 7.12556 8.43861 7.12556 8.80125 7.4882C9.16389 7.85084 9.16389 8.43875 8.80125 8.80139C8.43861 9.16402 7.8507 9.16402 7.48807 8.80139Z" fill="white"/>
</svg>`;

const likebgbtn = `<svg xmlns="http://www.w3.org/2000/svg" width="90" height="80" viewBox="0 0 90 80" fill="none">
<path d="M0 0H80C85.5228 0 90 4.47715 90 10V80H0V0Z" fill="url(#paint0_linear_7567_5008)"/>
<defs>
<linearGradient id="paint0_linear_7567_5008" x1="105.581" y1="-19.1816" x2="52.2439" y2="48.6935" gradientUnits="userSpaceOnUse">
<stop offset="0.176707"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>`;

const like = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const pureVeg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" >
<path d="M3.0733 5.64216C3.9883 8.15618 4.77893 10.6791 4.68121 13.4374C4.50354 13.3841 4.3614 13.353 4.23259 13.2997C2.72684 12.6512 1.82517 11.4875 1.35879 9.95065C1.10561 9.1156 1.12782 8.2539 1.15002 7.39664C1.17667 6.49497 1.21665 5.5933 1.22553 4.69162C1.23442 3.91876 1.11449 3.17255 0.679199 2.47964C0.892403 2.55959 1.11005 2.63954 1.31881 2.72393C2.7224 3.3058 4.0416 4.0298 5.16092 5.07361C6.14698 5.99305 6.87099 7.06795 7.13305 8.41824C7.35958 9.58642 7.16414 10.6969 6.63557 11.754C6.34686 12.3314 5.9782 12.8555 5.53402 13.3264C5.48072 13.3841 5.41854 13.4596 5.4141 13.5307C5.37856 14.2058 5.35191 14.8854 5.32082 15.6094C5.71613 15.4362 6.08924 15.2852 6.45346 15.1119C7.97254 14.3791 9.40722 13.5129 10.6598 12.3758C11.5259 11.5941 12.2721 10.7013 12.9606 9.76409C13.6491 8.83133 14.2754 7.8497 14.9239 6.89029C14.9727 6.81478 15.0083 6.73038 15.0305 6.63711C12.9917 9.35545 10.8419 11.9539 7.87482 13.7172C7.84373 13.7084 7.81264 13.6995 7.78599 13.695C7.71936 13.282 7.61276 12.8733 7.59055 12.4602C7.50171 10.799 8.03917 9.33769 9.05188 8.03181C9.65152 7.25895 10.4199 6.68596 11.2417 6.17961C12.4187 5.4556 13.6136 4.75381 14.7817 4.01648C15.4391 3.59895 16.0432 3.10592 16.4563 2.42633C16.5718 2.23978 16.665 2.0399 16.7894 1.80005C16.856 2.13318 16.9226 2.43078 16.9804 2.73281C17.2513 4.17638 17.389 5.63327 17.2869 7.10349C17.1669 8.84465 16.7627 10.4925 15.7278 11.9361C14.5552 13.5707 12.9384 14.4501 10.9485 14.6589C10.1046 14.7477 9.26509 14.7122 8.43004 14.5478C8.35009 14.5301 8.24793 14.5789 8.16798 14.6234C7.25742 15.1297 6.34686 15.6361 5.4363 16.1469C5.2764 16.2357 5.15203 16.2091 5.01434 16.098C4.8722 15.9825 4.84999 15.8582 4.88109 15.6894C5.12094 14.3657 5.20089 13.0332 5.08097 11.6918C4.99213 10.6969 4.73451 9.74188 4.39249 8.80912C4.03271 7.81861 3.61075 6.85919 3.21099 5.88645C3.17546 5.80206 3.12216 5.72211 3.0733 5.64216Z" />
</svg>`;

const pureVegBg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="32" viewBox="0 0 140 22" fill="none">
<path d="M0 0H82.0855C86.4982 0 90.3893 2.89235 91.6611 7.11781L97.9666 28.0667H0V0Z" fill="white"/>
</svg>`;

const mapPin = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 12 16" fill="none">
<path d="M5.99984 8.66659C7.10441 8.66659 7.99984 7.77115 7.99984 6.66659C7.99984 5.56202 7.10441 4.66659 5.99984 4.66659C4.89527 4.66659 3.99984 5.56202 3.99984 6.66659C3.99984 7.77115 4.89527 8.66659 5.99984 8.66659Z"  stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.99984 14.6666C8.6665 11.9999 11.3332 9.6121 11.3332 6.66659C11.3332 3.72107 8.94536 1.33325 5.99984 1.33325C3.05432 1.33325 0.666504 3.72107 0.666504 6.66659C0.666504 9.6121 3.33317 11.9999 5.99984 14.6666Z"  stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const time = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" >
<g clip-path="url(#clip0_7566_4020)">
<path d="M6 2.00008V0.666748H10V2.00008H6ZM7.33333 9.33342H8.66667V5.33342H7.33333V9.33342ZM8 14.6667C7.17778 14.6667 6.40267 14.5085 5.67467 14.1921C4.94711 13.8752 4.31111 13.4445 3.76667 12.9001C3.22222 12.3556 2.79156 11.7196 2.47467 10.9921C2.15822 10.2641 2 9.48897 2 8.66675C2 7.84453 2.15822 7.06942 2.47467 6.34141C2.79156 5.61386 3.22222 4.97786 3.76667 4.43341C4.31111 3.88897 4.94711 3.45853 5.67467 3.14208C6.40267 2.82519 7.17778 2.66675 8 2.66675C8.68889 2.66675 9.35 2.77786 9.98333 3.00008C10.6167 3.2223 11.2111 3.54453 11.7667 3.96675L12.7 3.03341L13.6333 3.96675L12.7 4.90008C13.1222 5.45564 13.4444 6.05008 13.6667 6.68341C13.8889 7.31675 14 7.97786 14 8.66675C14 9.48897 13.8418 10.2641 13.5253 10.9921C13.2084 11.7196 12.7778 12.3556 12.2333 12.9001C11.6889 13.4445 11.0529 13.8752 10.3253 14.1921C9.59733 14.5085 8.82222 14.6667 8 14.6667ZM8 13.3334C9.28889 13.3334 10.3889 12.8779 11.3 11.9667C12.2111 11.0556 12.6667 9.95564 12.6667 8.66675C12.6667 7.37786 12.2111 6.27786 11.3 5.36675C10.3889 4.45564 9.28889 4.00008 8 4.00008C6.71111 4.00008 5.61111 4.45564 4.7 5.36675C3.78889 6.27786 3.33333 7.37786 3.33333 8.66675C3.33333 9.95564 3.78889 11.0556 4.7 11.9667C5.61111 12.8779 6.71111 13.3334 8 13.3334Z" />
</g>
<defs>
<clipPath id="clip0_7566_4020">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`;
