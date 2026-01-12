import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Back from '../../../../assets/icons/back.svg';
import Globe from '../../../../assets/icons/globe.svg';
import styles from '../../../../styles';
import { fontSize, spacing } from '../../../../utils/scaling';
const Header = ({ route, navigation }) => {
  return (
    <View style={[styles.header]}>
      {route.name == 'Complete' ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingTop:
              Platform.OS == 'ios'
                ? Dimensions.get('window').height * 0.001
                : Dimensions.get('window').height * 0.03,
          }}
        >
          {route.name == 'Complete' && route?.params?.action=='edit' ? (
              <TouchableOpacity
                style={{
                  height: spacing.hp15,
                  width: spacing.wp15,
                  marginRight:spacing.wp15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.goBack()}
              >
                <Back />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          <View style={styles.innnerHeaderContainer}>
            <Text style={[styles.phoneTitle, { fontSize: fontSize.font24 }]}>
              Complete Your Profile
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingTop:
              Platform.OS == 'ios'
                ? Dimensions.get('window').height * 0.001
                : Dimensions.get('window').height * 0.03,
          }}
        >
          <View
            style={[styles.innnerHeaderContainer, { columnGap: spacing.wp10 }]}
          >
            {route.name == 'OTP' ? (
              <TouchableOpacity
                style={{
                  height: spacing.hp15,
                  width: spacing.wp15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => navigation.goBack()}
              >
                <Back />
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <Text style={[styles.phoneTitle, { fontSize: fontSize.font24 }]}>
              {route.name == 'OTP'
                ? 'Enter Verification Code'
                : 'Enter phone number'}
            </Text>
          </View>
          <View>
            <TouchableOpacity>
              <Globe></Globe>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
