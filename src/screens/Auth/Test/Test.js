import React, {useState, useRef} from 'react';
import {View, Text, Button, StyleSheet, AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  //   AppState.addEventListener('change',appStateManager());
  //   const appStateManager=(state) => {
  //     async()=>{
  //         if (state === 'active') {
  //             const killedTime= await AsyncStorage.getItem('killedAt');
  //             const timer= await  AsyncStorage.getItem('timerState');
  //             console.log('error');
  //             if (killedTime && timer){
  //                console.log(JSON.parse(killedTime));
  //                console.log(JSON.parse(killedTime));
  //             }
  //             } else if (state === 'background') {
  //                if (timerRef.current==null){
  //                 AsyncStorage.removeItem();
  //                 return;
  //                }
  //               await AsyncStorage.setItem('killedAt',JSON.stringify(new Date()));
  //               await AsyncStorage.setItem('timerState',JSON.stringify({time}));
  //             }
  //     }
  // }
  const storingTime = async () => {
    await AsyncStorage.setItem('killedTime', JSON.stringify(new Date()));
    await AsyncStorage.setItem('timerState', JSON.stringify({time}));
  };

  const startTimer = () => {
    if (timerRef.current !== null) return; // Prevent multiple intervals
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000); // Update every second
  };

  const stopTimer = () => {
    if (timerRef.current === null) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time / 60) % 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={startTimer} />
        <Button title="Stop" onPress={stopTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default Stopwatch;
