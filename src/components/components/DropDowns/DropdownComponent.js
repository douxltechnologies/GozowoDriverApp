import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { scale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../../utils/color';
import useResponsiveSize from '../../../utils/useResponsiveSize';
import { spacing } from '../../../utils/scaling';

const DropdownComponent = ({
  nationalityValue,
  genderValue,
  setNationalityValue,
  setGenderValue,
  data,
  title,
  setNumberFocused,
  setDobFocused,
  setEmailFocused,
  setNameFocused,
  handleOtherFocus,
}) => {
  const { hp } = useResponsiveSize(440, 956);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const labelAnim = useRef(new Animated.Value(0)).current;

  // Animate label when focus/value changes
  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocus || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocus, value, labelAnim]);

  const getColor = (focused, val) => {
    if (focused) return COLOR.blue;
    if (val) return COLOR.blue;
    return COLOR.grey;
  };

  const labelStyle = {
    position: 'absolute',
    left: scale(10),
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalScale(8), verticalScale(-6)],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [scale(14), scale(11)],
    }),
    color: getColor(isFocus, value),
    backgroundColor: 'white',
    paddingHorizontal: scale(4),
    zIndex: 999,
  };

  const handleChange = item => {
    setValue(item);
    if (title === 'Nationality') {
      setNationalityValue(item);
    } else if (title === 'Gender') {
      setGenderValue(item);
    }
    setIsFocus(false);
  };

  // 🔹 When editing, set default value from props (only once)
  useEffect(() => {
    if (title === 'Nationality' && nationalityValue) {
      setValue({
        label: nationalityValue.name || nationalityValue.label,
        value: nationalityValue.id || nationalityValue.value,
      });
    } else if (title === 'Gender' && genderValue) {
      setValue({
        label: genderValue.name || genderValue.label,
        value: genderValue.id || genderValue.value,
      });
    }
  }, [title, nationalityValue, genderValue]);
  return (
    <View
      style={[
        styles.container,
        {
          height: Dimensions.get('window').height * 0.045,
          marginTop: spacing.hp21,
        },
      ]}
    >
      <Animated.Text style={labelStyle}>{title}</Animated.Text>

      <Dropdown
        style={[
          styles.dropdown,
          {
            borderColor: getColor(isFocus, value),
            borderWidth: 1.5,
          },
        ]}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: getColor(isFocus, value) },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={hp(150)}
        labelField="label"
        valueField="value"
        placeholder={!isFocus && !value ? '' : ''}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => {
          setIsFocus(true);
          setNumberFocused(false);
          setDobFocused(false);
          setEmailFocused(false);
          setNameFocused(false);
          handleOtherFocus();
        }}
        onBlur={() => setIsFocus(false)}
        onChange={handleChange}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    width: '100%',
  },
  dropdown: {
    height: Dimensions.get('window').height * 0.048,
    borderColor: COLOR.grey,
    borderWidth: 1,
    borderRadius: spacing.hp10,
    paddingLeft: Dimensions.get('window').width * 0.036,
    paddingRight: spacing.wp15,
  },
  placeholderStyle: {
    color: COLOR.grey,
  },
  selectedTextStyle: {
    color: COLOR.black,
  },
  iconStyle: {
    width: scale(20),
    height: verticalScale(20),
  },
  inputSearchStyle: {
    height: Dimensions.get('window').height*0.05,
    fontSize: verticalScale(14),
  },
});
