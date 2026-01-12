import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import LogoLoading from '../../../assets/Images/logo/Logo-Loading.svg';
import { COLOR } from '../../../utils/color';
import EllipsisLoading from '@matheusdearaujo/react-native-loading-ellipsis';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../styles';
import { WEIGHT } from '../../../utils/weight';
import { fontSize, logo, spacing } from '../../../utils/scaling';

const Loading = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.push('PhoneVerification');
    }, 3000);
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'space-between', alignItems: 'center' },
        ]}
      >
        <View></View>
        <LogoLoading height={logo.height} width={logo.width}></LogoLoading>
        <View style={styles.ellipsesCOntainer}>
          <EllipsisLoading
            numberOfDots={4}
            dotSize={spacing.hp10}
            styleDot={{
              backgroundColor: COLOR.blue,
              margin: spacing.wp5 - 1,
            }}
          />
          <View
            style={[
              styles.poweredByContainer,
              { gap: spacing.wp10, marginBottom: spacing.hp50 },
            ]}
          >
            <Text style={[styles.poweredByText, { fontSize: fontSize.font24 }]}>
              Powered by
            </Text>
            <Text
              style={[
                styles.gozowoText,
                { fontSize: fontSize.font24, fontWeight: WEIGHT.bold },
              ]}
            >
              GoZowo
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default Loading;
