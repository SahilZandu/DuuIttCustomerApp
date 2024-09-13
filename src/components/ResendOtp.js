import React, {useEffect, useState} from 'react';
import {Pressable, Text,View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import { rootStore } from '../stores/rootStore';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { Strings } from '../translates/strings';

const ResendOtp = ({value, type,onResendClear,handleLoading}) => {
  const {resendOtp}=rootStore.authStore;
  const [timerCount, setTimer] = useState(59);
  const [start, setstart] = useState(true);

  const handleTimer = () => {
    setTimer(59);
    setstart(!start);
  };

  const handleResendOtp = async () => {
        onResendClear();
        // setTimeout(()=>{
        //     handleTimer()
        // },500)
        await resendOtp(value,type, handleTimer,handleLoading)  
  };

  // const handleResend = v => {
  //   handleLoading(v);
  // };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [start]);

  const secondsToHms = d => {
    d = Number(d);

    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var mDisplay = m > 0 ? m + (m == 1 ? ' : ' : ' : ') : '';
    var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '';
    let  newSDisplay = sDisplay
    if(sDisplay < 10){
        newSDisplay= 0 + sDisplay
    }
    return  mDisplay + newSDisplay ;
  };

  return (
    <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center',}}>
       <Text
        style={{
          color: colors.black65,
          fontSize: RFValue(12),
          fontFamily: fonts.medium,
          textAlign:'center',
        }}>
        {'Not getting Code?'}
        </Text>
    <Pressable
      disabled={timerCount != 0}
      onPress={()=>{handleResendOtp()}}
      style={{
        alignSelf: 'center',
        opacity: timerCount == 0 ? 1 : 0.5,
      }}>
    
       <Text style={{fontFamily:fonts.bold ,fontSize: RFValue(12), color:colors.main}}>
       {' '} {Strings.resend} {''}
        ({timerCount != 0 ? `${secondsToHms(timerCount)}`:'00'})
        </Text>
     
    </Pressable>
      </View>

  );
};

export default ResendOtp;
