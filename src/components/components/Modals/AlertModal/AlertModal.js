import React from 'react';
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../../../utils/color';
import { button, fontSize, spacing } from '../../../../utils/scaling';
import { WEIGHT } from '../../../../utils/weight';
import Error from '../../../../assets/icons/delete_error.svg';
import Success from '../../../../assets/icons/success.svg';
import Close from '../../../../assets/icons/close-circle-dark.svg';

const AlertModal = ({ navigation,modalType, title, message, showAlertModal, setShowAlertModal }) => {
  const closeModal = () => {
    if(title=='Address Saved!'){
      navigation.navigate('ReviewDetails');
    }
    setShowAlertModal(false);
}
  return (
    <Modal visible={showAlertModal} transparent animationType="fade">
      <SafeAreaProvider style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // backdrop
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  height: Dimensions.get('window').height * 0.203,
                  borderRadius: spacing.hp10,
                  backgroundColor: COLOR.white,
                  width: button.width,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: spacing.hp15,
                  }}
                >
                  <View style={{ width: Dimensions.get('window').width * 0.05 }} />
                  {modalType=='success'?<Success></Success>:<Error></Error>}
                  <TouchableOpacity onPress={closeModal}>
                    <Close />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontSize: fontSize.font18,
                    color: COLOR.black,
                    fontWeight: WEIGHT.semi,
                    marginTop: spacing.hp10,
                  }}
                >
                  {title}
                </Text>
                <Text
                  style={{
                    fontSize: fontSize.font14,
                    color: COLOR.black,
                    marginTop: spacing.hp6,
                  }}
                >
                  {message}
                </Text>

                <TouchableOpacity
                  onPress={closeModal}
                  style={{
                    height: button.height,
                    alignItems: 'center',
                    marginTop: spacing.hp21,
                    justifyContent: 'center',
                    borderRadius: spacing.hp10,
                    width: Dimensions.get('window').width * 0.719,
                    backgroundColor: modalType=='success'?COLOR.fadeGreen:COLOR.fadeRed,
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSize.font18,
                      fontWeight: WEIGHT.bold,
                      color: modalType=='success'?COLOR.darkGreen:COLOR.red,
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </Modal>
  );
};

export default AlertModal;
