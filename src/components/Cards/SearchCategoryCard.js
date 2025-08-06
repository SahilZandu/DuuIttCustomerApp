import React, { useMemo } from 'react';
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../../commons/AppImages';
import Url from '../../api/Url';
import { fonts } from '../../theme/fonts/fonts';
import { colors } from '../../theme/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const NUM_COLUMNS = 3;

const ProductGrid = ({ data, navigation }) => {
    // 🔹 Pad data to ensure each row has 3 items
    const formattedData = useMemo(() => {
        const fullRows = Math.floor(data.length / NUM_COLUMNS);
        let itemsInLastRow = data?.length - fullRows * NUM_COLUMNS;

        while (itemsInLastRow !== 0 && itemsInLastRow < NUM_COLUMNS) {
            data.push({ empty: true, _id: `empty-${Math.random()}` });
            itemsInLastRow++;
        }

        return data;
    }, [data]);

    const renderProductItem = ({ item, index }) => {
        console.log("item--renderProductItem", item);

        if (item?.empty) {
            return <View style={[styles.itemContainer, { backgroundColor: 'transparent' }]}>

            </View>;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.itemContainer}
                onPress={() =>
                    navigation.navigate('categoryViseFoodListing', { category: item })
                }
            >
                <Image
                    source={
                        (item?.image && item?.image?.length > 0)
                            ? { uri: Url.Image_Url + item?.image }
                            : appImages.burgerImage
                    }
                    resizeMode="cover"
                    style={styles.image}
                />
                <Text
                    numberOfLines={2}
                    style={styles.name}>
                    {item.name}
                </Text>

            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            bounces={false}
            data={formattedData}
            renderItem={renderProductItem}
            keyExtractor={item => item?._id?.toString()}
            numColumns={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={() => (
                <View style={styles.headerView}>
                    <Text style={styles.headerText}>
                        W H A T'S   O N   Y O U R   M I N D ?
                    </Text>
                </View>
            )}
        />
    );
};

export default ProductGrid;

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: wp('2%'),
        paddingBottom: hp('2%'),
    },
    itemContainer: {
        flex: 1,
        margin: wp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 10,
        paddingVertical: hp('1%'),
        minHeight: hp('18%'),
    },
    image: {
        width: wp('26%'),
        height: hp('12%'),
        borderRadius: 100,
        borderWidth: 0.1,
        borderColor: colors.main
    },
    name: {
        marginTop: hp('1.5%'),
        fontSize: RFValue(12),
        fontFamily: fonts.medium,
        color: colors.black,
        textAlign: 'center',
        width: wp('30%'),
        textTransform:'capitalize'
    },
    headerView: {
        marginBottom: '1%', marginTop: '2%', marginHorizontal: 10, justifyContent: 'center'
    },
    headerText: {
        fontSize: RFValue(11), fontFamily: fonts.medium,
        textTransform: 'uppercase', color: colors.grey,
    }
});


