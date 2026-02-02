import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Close from '../../../../assets/icons/close.svg';
import { fontSize, spacing } from '../../../../utils/scaling';
import { COLOR } from '../../../../utils/color';
import { WEIGHT } from '../../../../utils/weight';
import Mic from '../../../../assets/icons/mic.svg';
import Form from '../../../../assets/icons/form.svg';
import Gallery from '../../../../assets/icons/gallery.svg';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Ionicons from '@react-native-vector-icons/ionicons';
import Slider from '@react-native-community/slider';

const MediaModal = ({ item, mediaModal, setMediaModal }) => {
  const { height, width } = Dimensions?.get('window');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0); // in seconds
  const [playbackDuration, setPlaybackDuration] = useState(0); // in seconds

  const onStartPlay = async () => {
  if (!item?.data?.message) return;

  try {
    // Clean up before starting
    await AudioRecorderPlayer.stopPlayer();
    AudioRecorderPlayer.removePlayBackListener();

    setIsPlaying(true);

    await AudioRecorderPlayer.startPlayer(item.data.message);

    AudioRecorderPlayer.addPlayBackListener((e) => {
      // Convert ms → seconds
      const currentSec = Math.floor(e.currentPosition / 1000);
      const durationSec = Math.floor(e.duration / 1000);

      setPlaybackPosition(currentSec);
      setPlaybackDuration(durationSec);

      // Playback finished
      if (e.currentPosition >= e.duration && e.duration > 0) {
        AudioRecorderPlayer.stopPlayer();
        AudioRecorderPlayer.removePlayBackListener();
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    });

  } catch (err) {
    console.log('Playback error:', err);
    setIsPlaying(false);
  }
};
  const onStopPlay = async () => {
    try {
      await AudioRecorderPlayer.stopPlayer();
      AudioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
    } catch (err) {
      console.log('Stop playback error:', err);
    }
  };
const formatTime = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
  return (
    <Modal
      transparent
      animationType="slide"
      visible={mediaModal}
      onRequestClose={() => {
        setContactInfo(null);
        setEditDetails(false);
      }}
    >
      <SafeAreaProvider>
        {/* Background overlay */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent backdrop
            justifyContent: 'flex-end', // push to bottom
          }}
        >
          {/* Modal content container */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}} // prevents modal close on inner touch
            style={{
              backgroundColor: 'transparent',
              borderTopLeftRadius: spacing.hp15,
              borderTopRightRadius: spacing.hp15,
              // height: Platform.OS == 'ios' ? '48%' : '60%', // ✅ only 70% of screen height
              // overflow: 'hidden',
            }}
          >
            <View
              style={{
                paddingHorizontal: spacing.wp15,
                paddingTop: spacing.hp25,
                paddingBottom: spacing.hp15,
                flexDirection: 'row',
                borderColor: COLOR.grey,
              }}
            >
              <Text
                style={{
                  color: COLOR.black,
                  fontSize: fontSize.font14,
                  fontWeight: WEIGHT.semi,
                }}
              ></Text>
              <TouchableOpacity
                onPress={() => {
                  setMediaModal(false);
                }}
              >
                <Close />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: COLOR.white,
                flexGrow: 1,
                gap: spacing.hp10,
                justifyContent: 'space-between',
                paddingBottom: spacing.hp34,
                borderTopLeftRadius: spacing.hp10,
                borderTopRightRadius: spacing.hp10,
                padding: spacing.hp15,
              }}
            >
              <Text
                style={{
                  color: COLOR.blue,
                  fontSize: fontSize.font18,
                  fontWeight: WEIGHT.semi,
                }}
              >
                Additional Details
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: width * 0.02,
                }}
              >
                <View>
                  <Image
                    style={{
                      height: height * 0.045,
                      borderRadius: height * 0.045,
                      width: height * 0.045,
                    }}
                    source={{ uri: item?.data?.customer?.image }}
                  ></Image>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: fontSize.font14,
                      color: COLOR.black,
                      fontWeight: WEIGHT.semi,
                    }}
                  >
                    {item?.data?.customer?.name}{' '}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: width * 0.02,
                    }}
                  >
                    {/* {Array?.from(item?.data?.customer?.rating).map(() => {
                      return <RatingStar></RatingStar>;
                    })} */}
                    <Text
                      style={{
                        fontSize: fontSize.font11,
                        fontWeight: WEIGHT.semi,
                        color: COLOR.black,
                      }}
                    >
                      {item?.data?.customer?.rating} (289)
                    </Text>
                  </View>
                </View>
              </View>
              {item?.data?.jobDetails != null ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.wp10,
                    }}
                  >
                    <Form></Form>
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT.semi,
                      }}
                    >
                      Job Details
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: spacing.hp15,
                      backgroundColor: COLOR.fadeBlue,
                      borderRadius: spacing.hp10,
                      marginTop: spacing.hp15,
                    }}
                  >
                    <Text
                      style={{ fontSize: fontSize.font14, color: COLOR.black }}
                    >
                      {item?.data?.jobDetails}
                    </Text>
                  </View>
                </View>
              ) : (
                <></>
              )}
              {item?.data?.message != null ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.wp10,
                    }}
                  >
                    <Mic></Mic>
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT.semi,
                      }}
                    >
                      Voice Message
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: spacing.hp15,
                      backgroundColor: COLOR.fadeBlue,
                      borderRadius: spacing.hp10,
                      marginTop: spacing.hp15,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {item?.data?.message && (
                      <TouchableOpacity
                        onPress={isPlaying ? onStopPlay : onStartPlay}
                      >
                        <Ionicons
                          color={COLOR.blue}
                          size={spacing.hp25}
                          name={isPlaying ? 'pause-circle' : 'play-circle'}
                        ></Ionicons>
                      </TouchableOpacity>
                    )}
                    <Slider
                      style={{ width: '83%', height: 40 }}
                      minimumValue={0}
                      thumbTintColor={COLOR.blue}
                      maximumValue={playbackDuration} // total duration in ms
                      value={playbackPosition} // current position in ms
                      minimumTrackTintColor={COLOR.blue}
                      maximumTrackTintColor={COLOR.grey}
                      onSlidingComplete={async value => {
                        // allow user to seek
                        await AudioRecorderPlayer.seekToPlayer(value);
                        setPlaybackPosition(value);
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* <Text style={{ color: COLOR.black }}>
                        {formatTime(playbackPosition)}
                      </Text> */}

                      {isPlaying?<Text style={{ color: COLOR.black }}>
                        {formatTime(playbackPosition)}
                      </Text>:<Text style={{ color: COLOR.black }}>
                        {formatTime(playbackDuration)}
                      </Text>}
                    </View>
                  </View>
                </View>
              ) : (
                <></>
              )}

              {item?.data?.attachments?.length != 0 ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.wp10,
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing?.wp10,
                    }}
                  >
                    <Gallery></Gallery>
                    <Text
                      style={{
                        color: COLOR.blue,
                        fontSize: fontSize.font18,
                        fontWeight: WEIGHT.semi,
                      }}
                    >
                      Photos
                    </Text>
                  </View>
                  <FlatList
                    contentContainerStyle={{ gap: spacing.wp15 }}
                    horizontal
                    data={item?.data?.attachments}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              removeImageByIndex(index);
                            }}
                            style={{
                              position: 'absolute',
                              zIndex: 1,
                              right: Dimensions.get('window').width * 0.002,
                              top: Dimensions.get('window').height * 0.002,
                            }}
                          >
                            <Ionicons
                              size={spacing.hp25}
                              color={COLOR.white}
                              name="close-circle"
                            ></Ionicons>
                          </TouchableOpacity>
                          <View
                            style={{
                              position: 'absolute',
                              zIndex: 1,
                              height: '100%',
                              width: '100%',
                            }}
                          >
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                              }}
                            >
                              <Ionicons
                                size={spacing.hp25}
                                color={COLOR.white}
                                name="lock-closed-outline"
                              ></Ionicons>
                            </View>
                          </View>
                          <View
                            style={{
                              height: Dimensions.get('window').height * 0.075,
                              width: Dimensions.get('window').width * 0.17,
                              alignItems: 'center',
                              borderRadius: spacing.hp6,
                              justifyContent: 'center',
                              backgroundColor: COLOR.fadeGrey,
                            }}
                          >
                            <Image
                              style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: spacing.hp6,
                              }}
                              source={{ uri: item?.PhotoUrl }}
                            ></Image>
                          </View>
                        </>
                      );
                    }}
                  ></FlatList>
                </View>
              ) : (
                <></>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaProvider>
    </Modal>
  );
};
export default MediaModal;
