import React, { useEffect } from 'react';
import Logo from '../../../assets/Images/logo/Logo.svg';
import { COLOR } from '../../../utils/color';
import styles from '../../../styles';
import { logo } from '../../../utils/scaling';
import { View } from 'react-native';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.push('Loading');
    }, 3000);
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLOR.blue,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Logo width={logo.width} height={logo.height}></Logo>
    </View>
  );
};
export default Splash;
