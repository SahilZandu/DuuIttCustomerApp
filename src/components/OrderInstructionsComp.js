import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';

export default function OrdersInstrucationsComp({ item }) {
  console.log("item?.delivery_instructions", item?.delivery_instructions);
  // delivery_instructions: {
  //   audio: instuctions ?? '',
  //   instructions: instuctionsArray ?? [],
  // },
  return (
    <View style={styles.container}>
     {item?.delivery_instructions?.instructions?.length > 0 &&
      <Text style={styles.instructionText}>
        Instructions:{' '}
        {
          item?.delivery_instructions?.instructions?.length > 0 &&
          item?.delivery_instructions.instructions?.map((data, i) => {
            console.log("data--Instructions", data);
            return (
              <Text style={styles.instInnerText}>{' '}{data}</Text>
            )
          })

        }
        {item?.delivery_instructions?.audio !== "Add instructions for delivery partner" && item?.delivery_instructions?.audio?.length > 0 &&
          <Text style={styles.instInnerText}>{' '}{item?.delivery_instructions?.audio}</Text>
        }
      </Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colorF5,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: '4%',
  },
  instructionText: {
    marginHorizontal: '2%',
    paddingVertical: '2%',
    fontSize: RFValue(11),
    fontFamily: fonts.bold,
    color: colors.main,
  },
  instInnerText: {
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
