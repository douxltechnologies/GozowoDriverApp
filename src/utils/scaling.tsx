import { Dimensions } from 'react-native';

export const spacing = {
  hp6:Dimensions.get('window').height * 0.006,
  hp15: Dimensions.get('window').height * 0.012, //vertical = 15
  hp10: Dimensions.get('window').height * 0.01, //vertical = 10
  hp19: Dimensions.get('window').height * 0.015, //vertical = 19
  hp21: Dimensions.get('window').height * 0.017, //vertical = 21
  hp34: Dimensions.get('window').height * 0.03, //vertical = 34
  hp25: Dimensions.get('window').height * 0.025, //vertical = 25
  hp50: Dimensions.get('window').height * 0.035, //vertical = 50

  wp5: Dimensions.get('window').width * 0.01, //horizontal = 15
  wp15: Dimensions.get('window').width * 0.025, //horizontal = 15
  wp10: Dimensions.get('window').width * 0.02, //horizontal = 10
};

export const button = {
  width: Dimensions.get('window').width * 0.86,
  height: Dimensions.get('window').height * 0.055,
};

export const fontSize = {
  font11: Dimensions.get('window').width*0.03,
  font24: Dimensions.get('window').width * 0.06,
  font18: Dimensions.get('window').width * 0.045,
  font16: Dimensions.get('window').height * 0.015,
  font14: Dimensions.get('window').height * 0.015,
  font40: Dimensions.get('window').width * 0.1,

};

export const logo={
    height:Dimensions.get('window').height * 0.1,
    width:Dimensions.get('window').width * 0.8
}