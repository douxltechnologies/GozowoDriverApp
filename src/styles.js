import { StyleSheet } from 'react-native';
import { COLOR } from './utils/color';
import { WEIGHT } from './utils/weight';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ellipsesCOntainer: { display: 'flex', flexDirection: 'column' },
  poweredByContainer: { display: 'flex', flexDirection: 'row' },
  poweredByText: {
    color: COLOR.blue,
  },
  gozowoText: {
    color: COLOR.blue,
  },
  phoneTitle: {
    color: COLOR.black,
    fontWeight: WEIGHT.semi,
  },
  phoneDescription: { color: COLOR.black },
  phoneInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  countrySelector: {
    backgroundColor: COLOR.fadeBlue,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappButton: {
    backgroundColor: COLOR.green,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  smsButton: {
    borderWidth: 1,
    borderColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  whatsappText: {
    color: COLOR.white,
  },
  smsText: {
    color: COLOR.blue,
  },
  termsconditions: {
    color: COLOR.blue,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innnerHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: COLOR.white,
  },
  serviceType: {
    backgroundColor: COLOR.white,
  },
  serviceHeading: {
    color: COLOR.black,
  },
  serviceText: {
    color: COLOR.black,
  },
  serviceContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  serviceButton: {
    backgroundColor: COLOR.fadeBlue,
  },
  serviceButtonText: {
    color: COLOR.blue,
  },
  selectedServiceButton: {
    backgroundColor: COLOR.blue, // blue highlight
  },

  selectedServiceButtonText: {
    color: COLOR.white, // white text for selected
    fontWeight: 'bold',
  },
  vehicleButton: {
    backgroundColor: COLOR.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: COLOR.black,
  },
  menuContainer: {
    backgroundColor: COLOR.white,
    alignItems: 'center',
    elevation:5,
  },
  iconContainer: {
    borderWidth: 1,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  modalMenu: {
    elevation: 5,
    borderBottomWidth: 5,
    position:'absolute',
    bottom:100
  },
  iconsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
   },
     sectionTitle: {
    color: COLOR.blue,
  },
    card: {
    backgroundColor: COLOR.white,
    alignItems: 'center',
  },
    modalContainer: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLOR.fadeWhite,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color:COLOR.black },
  closeText: { color: COLOR.blue, fontSize: 14 },
  subtitle: { color:COLOR.black},
  placeAddress: { color: COLOR.black },
  distanceText: { color: COLOR.grey},
  map: { ...StyleSheet.absoluteFillObject },
});

export default styles;
