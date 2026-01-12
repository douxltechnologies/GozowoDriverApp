import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR } from '../../../../utils/color';
import ReviewStars from '../../../../assets/icons/review-stars.svg';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import useResponsiveSize from '../../../../utils/useResponsiveSize';
import Close from '../../../../assets/icons/close-circle.svg';
import { WEIGHT } from '../../../../utils/weight';
import { button, fontSize, spacing } from '../../../../utils/scaling';

const ReviewDetailsModal = ({ setShowReview, showReview, navigation }) => {
  // const { hp, wp, fp } = useResponsiveSize(440, 956);
  // const sheetRef = useRef(null);
  // useEffect(() => {
  //   if(showReview==true){
  //   setTimeout(() => {
  //     sheetRef.current.present();
  //   }, 1000);
  //   }
  // }, [showReview]);
  return (
    <Modal
      visible={showReview}
      onDismiss={() => {
        navigation?.navigate('Home');
      }}
      onRequestClose={() => {
        navigation?.navigate('Home');
      }}
      animationType="slide"
      transparent
      style={{ position: 'absolute', bottom: 0 }}
    >
      <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => {
            setShowReview(false);
            navigation?.navigate('Home');
          }}
          style={{ marginLeft: spacing.wp10, marginBottom: spacing.hp10 }}
        >
          <Close height={Dimensions.get('window').height * 0.04}></Close>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            backgroundColor: COLOR.fadeWhite,
            borderRadius: spacing.hp10,
            justifyContent: 'space-between',
            paddingBottom: spacing.hp50,
          }}
        >
          <View>
            <Text
              style={{
                color: COLOR.blue,
                textAlign: 'center',
                marginTop: spacing.hp21,
                fontSize: fontSize.font24,
                fontWeight: WEIGHT.semi,
              }}
            >
              How was your driver?
            </Text>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: spacing.hp21,
              }}
            >
              <Image
                style={{
                  height: Dimensions.get('window').height * 0.041,
                  borderRadius: spacing.hp50,
                  width: Dimensions.get('window').width * 0.08,
                }}
                source={require('../../../../assets/Images/logo/place-holder.jpg')}
              ></Image>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing.hp34,
                  width: '100%',
                  paddingHorizontal: Dimensions.get('window').width * 0.09,
                }}
              >
                <Text>Safety</Text>
                <ReviewStars></ReviewStars>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing.hp34,
                  width: '100%',
                  paddingHorizontal: Dimensions.get('window').width * 0.09,
                }}
              >
                <Text>Communication</Text>
                <ReviewStars></ReviewStars>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing.hp34,
                  width: '100%',
                  paddingHorizontal: Dimensions.get('window').width * 0.09,
                }}
              >
                <Text>Punctuality</Text>
                <ReviewStars></ReviewStars>
              </View>
            </View>
            <TextInput
              textAlignVertical="top"
              style={{
                marginTop: spacing.hp34,
                backgroundColor: COLOR.white,
                width: '95%',
                height: Dimensions.get('window').height * 0.12,
                borderRadius: spacing.hp10,
                alignSelf: 'center',
                paddingVertical: spacing.hp15,
                paddingHorizontal: spacing.wp15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 9,
                elevation: 1, // Android only
              }}
              placeholderTextColor={COLOR.grey}
              multiline={true}
              placeholder="Add a Comment..."
            />
          </View>
          <View
            style={{
              marginTop: spacing.hp34,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation?.navigate('Home');
              }}
              style={{
                backgroundColor: COLOR.blue,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: spacing.hp10,
                width: button.width,
                height: button.height,
              }}
            >
              <Text
                style={{
                  color: COLOR.white,
                  fontSize: fontSize.font18,
                  fontWeight: WEIGHT.semi,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReviewDetailsModal;
