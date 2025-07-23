import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';
import ModalPopUpTouch from './ModalPopUpTouch';
import AppInputScroll from '../halpers/AppInputScroll';
import { Formik, useFormikContext } from 'formik';
import InputFieldMultiLine from './InputFieldMultiLine';
import BTN from './cta/BTN';
import { feedbackValidations } from '../forms/formsValidation/feedbackValidations';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { rootStore } from '../stores/rootStore';
import { reviewRatingValidations } from '../forms/formsValidation/reviewRatingValidations';


let starArray = [1, 2, 3, 4, 5];
const ReviewsRatingFoodComp = ({
    title,
    isVisible,
    onClose,
    loading,
    onHandleLoading,
    data,
    type,
    reviewToRider
}) => {
    const { addReviews,addFoodOrderReviews } = rootStore.dashboardStore;
    console.log("data--ReviewsRatingFoodComp",data);
    
    const [initialValues, setInitialValues] = useState({
        rating: "",
        taste_rating: "",
        packaging_rating: "",
        money_rating: "",
        feedback: '',
    });
    const [ratingShow, setRatingShow] = useState(0);
    const [ratingShow1, setRatingShow1] = useState(0);
    const [ratingShow2, setRatingShow2] = useState(0);
    const [ratingShow3, setRatingShow3] = useState(0);


    //   console.log("data type,---", data,type);

    const onRestaurantRating = item => {
        setRatingShow(item);
    };

    const onRestaurantRating1 = item => {
        setRatingShow1(item);
    };

    const onRestaurantRating2 = item => {
        setRatingShow2(item);
    };

    const onRestaurantRating3 = item => {
        setRatingShow3(item);
    };
    
    
    



    useEffect(() => {
        setRatingShow(0)
        setRatingShow1(0)
        setRatingShow2(0)
        setRatingShow3(0)
    }, [isVisible])

    const RestaurantContainer = () => {
        const { setFieldValue } = useFormikContext();
        return (
            <View style={styles.mainStarView}>
                {starArray?.map((item, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setFieldValue('rating', item);
                                onRestaurantRating(item);
                            }}
                            activeOpacity={0.8}
                            style={styles.TouchStar}>
                            <SvgXml
                                xml={
                                    ratingShow >= item
                                        ? appImagesSvg.yellowStarActive
                                        : appImagesSvg.yellowStarUnactive
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const TasteRatingContainer = () => {
        const { setFieldValue } = useFormikContext();
        return (
            <View style={styles.mainStarView}>
                {starArray?.map((item, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setFieldValue('taste_rating', item);
                                onRestaurantRating1(item);
                            }}
                            activeOpacity={0.8}
                            style={styles.TouchStar}>
                            <SvgXml
                                xml={
                                    ratingShow1 >= item
                                        ? appImagesSvg.yellowStarActive
                                        : appImagesSvg.yellowStarUnactive
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    const PackagingRatingContainer = () => {
        const { setFieldValue } = useFormikContext();
        return (
            <View style={styles.mainStarView}>
                {starArray?.map((item, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setFieldValue('packaging_rating', item);
                                onRestaurantRating2(item);
                            }}
                            activeOpacity={0.8}
                            style={styles.TouchStar}>
                            <SvgXml
                                xml={
                                    ratingShow2 >= item
                                        ? appImagesSvg.yellowStarActive
                                        : appImagesSvg.yellowStarUnactive
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const MoneyRatingContainer = () => {
        const { setFieldValue } = useFormikContext();
        return (
            <View style={styles.mainStarView}>
                {starArray?.map((item, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setFieldValue('money_rating', item);
                                onRestaurantRating3(item);
                            }}
                            activeOpacity={0.8}
                            style={styles.TouchStar}>
                            <SvgXml
                                xml={
                                    ratingShow3 >= item
                                        ? appImagesSvg.yellowStarActive
                                        : appImagesSvg.yellowStarUnactive
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const FormButton = ({ loading, onPress }) => {
        const { dirty, isValid, values } = useFormikContext();
        return (
            <BTN
                disable={!(isValid && dirty)}
                loading={loading}
                title={'Submit'}
                onPress={() => onPress(values)}
            />
        );
    };
    const handleUpdate = async values => {
        console.log('values---', values);
        let payload = {
            food_review:  values?.feedback ?? '',
            food_rating:values?.rating,
            type: "Food-Rest",
            user_id: data?.customer?._id,
            order_id:data?._id,
            rider_id: data?.rider?._id ?? data?.rider_id,
            restaurant_id:data?.restaurant?._id,
            images: [],
            taste_rating: values?.taste_rating,
            packaging_rating: values?.packaging_rating,
            value_rating: values?.money_rating
        };

        console.log("payload---handleUpdate",payload);
            // return 
        const res = await addFoodOrderReviews(payload, handleLoading,onSuccess);
        console.log('res---', res);
        // handleLoading(false);
    };

    const handleLoading = v => {
        onHandleLoading(v);
        // if (v === false) {
        //     setRatingShow(0)
        //     setRatingShow1(0)
        //     setRatingShow2(0)
        //     setRatingShow3(0)
        //     onClose();
        // }
    };

    const onSuccess = ()=>{
        setRatingShow(0)
        setRatingShow1(0)
        setRatingShow2(0)
        setRatingShow3(0)
        onClose();
    }
    return (
        <ModalPopUpTouch
            avoidKeyboard={true}
            propagateSwipe={true}
            crossImage
            isVisible={isVisible}
            onClose={onClose}
            onOuterClose={onClose}>
            <View style={styles.main}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust if needed
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Spacer space={'2%'} />
                    <AppInputScroll
                        padding={true}
                        keyboardShouldPersistTaps={'handled'}
                    // Pb={hp('15%')}
                    >
                        <Formik
                            initialValues={initialValues}
                            validationSchema={reviewRatingValidations()}>
                            <View style={styles.innerView}>
                                <Text style={styles.titleText}>{title}</Text>
                                {<RestaurantContainer />}
                                <Text style={styles.titleText}>{"Rating for taste"}</Text>
                                {<TasteRatingContainer />}
                                <Text style={styles.titleText}>{"Rating for packaging"}</Text>
                                {<PackagingRatingContainer />}
                                <Text style={styles.titleText}>{"Rating for money"}</Text>
                                {<MoneyRatingContainer />}
                                <InputFieldMultiLine
                                    height={hp('13%')}
                                    maxLength={350}
                                    inputLabel={'Add detailed review'}
                                    name={'feedback'}
                                    placeholder={'Enter Your Feedback'}
                                />
                                <Spacer space={hp('6%')} />
                                <FormButton loading={loading} onPress={handleUpdate} />
                            </View>
                        </Formik>
                    </AppInputScroll>
                </KeyboardAvoidingView>
            </View>
        </ModalPopUpTouch>
    );
};

export default ReviewsRatingFoodComp;

const styles = StyleSheet.create({
    main: {
        backgroundColor: colors.appBackground,
        height: hp('75%'),
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    innerView: {
        marginTop: '3%',
        marginHorizontal: 20,
    },
    titleText: {
        fontSize: RFValue(15),
        fontFamily: fonts.semiBold,
        color: colors.black,
    },
    mainStarView: {
        flexDirection: 'row',
        marginTop: '3%',
        marginBottom: '3%'
    },
    TouchStar: {
        paddingHorizontal: '2%',
    },
});
