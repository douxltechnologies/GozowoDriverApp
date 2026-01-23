import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Close from '../../../../assets/icons/close.svg';
import { button, fontSize, spacing } from '../../../../utils/scaling';
import { useCancelDriverRequest } from '../../../../api/useCancelDriverRequest';
import { useDispatch, useSelector } from 'react-redux';
import { COLOR } from '../../../../utils/color';
import { WEIGHT } from '../../../../utils/weight';
import { setBids } from '../../../../store/actions';

const ReasonModal = ({
  navigation,
  item,
  setReasonModal,
  reasonModal,
}: any) => {
  const TOKEN = useSelector(state => state?.token);
  const BIDS = useSelector(state => state?.bids);
  const { cancelDriverRequest } = useCancelDriverRequest();
  const [showOther, setShowOther] = useState(false);
  const dispatch = useDispatch();
  const [reasonText, setReasonText] = useState(null);
  const reasons = [
    'I refuse to carry out order',
    'False Order',
    'Complaint about passenger',
    'Other',
  ];
  const cancel = async (reason:any) => {
    if(reason!=null || reason?.length!=0 || reason!=''){
      await cancelDriverRequest(TOKEN, {
        jobId: item?.data?.jobId,
        reason: reason,
        isCancelled: true,
      }).then(result => {
        if (result?.success) {
          dispatch(setBids([]));
          setShowOther(false);
          setReasonModal(false);
          navigation?.navigate('Home');
        }
      });
    }
  };
  return (
    <>
      <Modal
        animationType="slide"
        style={{
          backgroundColor: COLOR?.white,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: button?.width,
        }}
        transparent={true}
        visible={showOther}
        onRequestClose={() => {
          setShowOther(false);
        }}
        onDismiss={() => {
          setShowOther(false);
        }}
      >
        <View
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            marginHorizontal: spacing?.wp15,
          }}
        >
          <View
            style={{
              backgroundColor: COLOR?.white,
              paddingHorizontal: spacing?.wp15,
              paddingVertical: spacing?.hp10,
              borderWidth: 1,
              borderRadius: spacing?.hp6,
              borderColor: COLOR?.grey,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: COLOR?.black,
                  fontWeight: WEIGHT?.semi,
                  fontSize: fontSize?.font18,
                }}
              >
                Add Reason
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowOther(false);
                }}
              >
                <Close height={Dimensions.get('window').height * 0.04}></Close>
              </TouchableOpacity>
            </View>
            <TextInput
              onChangeText={reasonText => {
                setReasonText(reasonText);
              }}
              multiline
              placeholder="Enter text"
              style={{
                borderWidth: 1,
                borderColor: '#999',
                textAlignVertical: 'top',
                marginTop: spacing?.hp10,
                paddingVertical: spacing?.hp25,
                height: Dimensions.get('window').height * 0.15,
                borderRadius: spacing?.hp6,
                backgroundColor: COLOR?.white,
                width: '100%',
                paddingLeft: spacing?.wp10,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                cancel(reasonText);
              }}
              style={{
                padding: spacing?.hp15,
                backgroundColor: COLOR?.blue,
                marginTop: spacing?.hp10,
                alignSelf: 'center',
                borderRadius: spacing?.hp6,
              }}
            >
              <Text style={{ color: COLOR?.white, fontWeight: WEIGHT?.semi }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        style={{ position: 'absolute', bottom: 0 }}
        transparent={true}
        visible={reasonModal}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => {
              setReasonModal(false);
            }}
            style={{ marginLeft: spacing.wp10, marginBottom: spacing.hp10 }}
          >
            <Close height={Dimensions.get('window').height * 0.04}></Close>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flex: 0.38,
              borderTopLeftRadius: spacing.hp10,
              borderTopRightRadius: spacing.hp10,
              backgroundColor: COLOR.fadeWhite,
              alignItems: 'center',
              paddingVertical: spacing?.hp25,
            }}
          >
            <Text
              style={{
                fontSize: fontSize?.font24,
                color: COLOR?.blue,
                fontWeight: WEIGHT?.semi,
              }}
            >
              Why do you want to cancel?
            </Text>
            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
              {reasons?.map((item, index) => {
                
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (index == 3) {
                        setShowOther(true);
                      } else {
                        console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',item);
                        setShowOther(false);
                        cancel(item);
                      }
                      setReasonModal(false);
                    }}
                    style={{
                      height: button?.height,
                      width: button.width,
                      backgroundColor: COLOR?.blue,
                      borderRadius: spacing?.hp6,
                      marginTop: spacing?.hp10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize?.font18,
                        fontWeight: WEIGHT?.bold,
                        color: COLOR?.white,
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default ReasonModal;
