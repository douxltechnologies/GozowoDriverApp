import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Platform,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { GiftedChat, Bubble, Composer, Send } from 'react-native-gifted-chat';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../../utils/color';
import styles from '../../../styles';
import { button, fontSize, spacing } from '../../../utils/scaling';
import Back from '../../../assets/icons/back.svg';
import Call from '../../../assets/icons/call-outlined.svg';
import Add from '../../../assets/icons/add-black-line.svg';
import Emoji from '../../../assets/icons/emoji.svg';
import { ENDPOINT } from '../../../utils/urls';
import { useSelector } from 'react-redux';
import { useSaveJob } from '../../../api/useSaveJob';
const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const TOKEN = useSelector(state => state?.token);
  const PROFILE = useSelector(state => state?.user);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);
  const { sendMessage, loading, error } = useSaveJob();
  const BIDS = useSelector(state => state?.bids);
  useEffect(() => {
    if (!TOKEN || !PROFILE?.id) return;

    const socket = new WebSocket(
      `ws://${ENDPOINT}/api/WebSocket/ConnectWebhook/${PROFILE.id}?token=${TOKEN}`,
    );

    socketRef.current = socket;

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket Connected');
    };

    socketRef.current.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log('📩 WS Message Received:', data);
      if (data.type === 'IS_TYPING') {
        setTyping(true);
      }

      if (data.type === 'MESSAGE') {
        const newMessage = {
          _id: data.message._id || Math.random().toString(),
          text: data.message.text,
          createdAt: new Date(data.message.createdAt),
          user: {
            _id: data.message.user._id,
            name: data.message.user.name,
            avatar: data.message.user.avatar,
          },
        };

        setMessages(prev => GiftedChat.append(prev, [newMessage]));
        setTyping(false);
      }
    };

    socketRef.current.onerror = e => console.log('❌ WS Error', e);
    socketRef.current.onclose = () => console.log('🔌 WS Closed');

    return () => socketRef.current.close();
  }, [TOKEN, PROFILE?.id]);

  useEffect(() => {
    if (BIDS.type === 'IS_TYPING') {
      setTyping(true);
    }

    if (BIDS.type === 'MESSAGE') {
      const newMessage = {
        _id: BIDS.message._id || Math.random().toString(),
        text: BIDS.message.text,
        createdAt: new Date(BIDS.message.createdAt),
        user: {
          _id: BIDS.message.user._id,
          name: BIDS.message.user.name,
          avatar: BIDS.message.user.avatar,
        },
      };

      setMessages(prev => GiftedChat.append(prev, [newMessage]));
      setTyping(false);
    }
  }, [BIDS]);

  useEffect(() => {
    setMessages([]);
  }, []);

  const renderSend = props => (
    <Send
      containerStyle={{
        backgroundColor: COLOR.fadeGrey,
        height: Dimensions.get('window').height * 0.07,
        width: Dimensions.get('window').width * 0.4,
        paddingBottom: Dimensions.get('window').height * 0.005,
      }}
      {...props}
    ></Send>
  );

  const typingStarted = () => {
    console.log('Typing started');
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Typing started Inside::::::::::::::');
      socketRef.current.send(
        JSON.stringify({
          type: 'IS_TYPING',
          recieverId: route?.params?.data?.data?.customer?.Id,
        }),
      );
    } else {
      console.log('❌ Socket not open', socketRef.current?.readyState);
    }
  };
  const sendMsg = async message => {
    console.log(saveJobData, '================saveJobData', message);

    const saveJobData = {
      jobId: route?.params?.data?.data?.jobId,
      receiverId: route?.params?.data?.data?.customer?.Id,
      senderId: PROFILE?.id,
      message: message,
    };
    await sendMessage(TOKEN, saveJobData)
      .then(res => {
        if (res?.status == true) {
          return;
        }
      })
      .catch(err => {
        console.error('Error sending message:', err);
      });
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  // 👇 Custom bubble renderer
  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: COLOR.blue, // 💬 current user bubble color
        },
        left: {
          backgroundColor: COLOR.white, // 💬 other user bubble color
        },
      }}
      textStyle={{
        right: {
          color: '#fff', // text color for your messages
        },
        left: {
          color: '#000', // text color for others
        },
      }}
    />
  );

  const renderComposer = props => (
    useEffect(() => {
      if (props.text && props.text.length !== 0) {
        typingStarted();
      }
    }, [props.text]),
    (
      <View
        style={{
          height: Dimensions.get('window').height * 0.07,
          backgroundColor: COLOR.fadeGrey,
          paddingHorizontal: spacing.wp10,
          justifyContent: 'center',
          width: '100%',
          marginBottom:0.04,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Add */}
          <TouchableOpacity style={{ marginRight: spacing.wp10 }}>
            <Add height={20} />
          </TouchableOpacity>

          {/* Input */}
          <Composer
            {...props}
            textInputStyle={{
              flex: 1,
              backgroundColor: COLOR.white,
              borderRadius: 25,
              paddingHorizontal: spacing.wp10,
              borderWidth: 1,
              borderColor: '#ccc',
              color: COLOR.black,
              width: '100%',
            }}
          />

          {/* Emoji */}
          <TouchableOpacity style={{ marginHorizontal: spacing.wp10 }}>
            <Emoji height={20} />
          </TouchableOpacity>
          {props.text?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                props?.textInputProps?.onChangeText('');
                sendMsg(props.text);
                props.onSend([
                  {
                    _id: Math.random().toString(),
                    text: props.text,
                    createdAt: new Date(),
                    user: { _id: 1, name: 'You' },
                  },
                ]);
              }}
              style={{ marginHorizontal: spacing.wp10 }}
            >
              <Text>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  );
  console.log(route?.params?.data?.data?.customer);
  return (
        <KeyboardAvoidingView style={{ flex: 1}} keyboardVerticalOffset={Platform?.OS=='android'?Dimensions.get('window').height*0.05:0} behavior={Platform.OS=='ios'?'padding':'padding'} enabled>
          <View
            style={[
              styles.header,
              {
                borderBottomWidth: 1,
                paddingBottom: spacing.hp15,
                borderColor: COLOR.grey,
                justifyContent: 'flex-start',
                paddingHorizontal: spacing.wp15,
              },
            ]}
          >
            <TouchableOpacity
              style={{
                height: spacing.hp15,
                width: spacing.wp15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Back></Back>
            </TouchableOpacity>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: spacing.wp15,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '95%',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Image
                  style={{
                    height: Dimensions.get('window').height * 0.045,
                    width: Dimensions.get('window').width * 0.1,
                    borderRadius: 200,
                  }}
                  source={{
                    uri: route?.params?.data?.data?.customer?.image,
                  }}
                />
                <View>
                  <Text
                    style={[
                      styles.title,
                      { fontSize: fontSize.font18, marginLeft: spacing.wp15 },
                    ]}
                  >
                    {route?.params?.data?.data?.customer?.name}
                  </Text>

                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: fontSize.font11,
                        color: COLOR.grey,
                        marginLeft: spacing.wp15,
                      },
                    ]}
                  >
                    Online
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity>
                  <Call></Call>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <GiftedChat
            messages={messages}
            onSend={onSend}
            colorScheme="black"
            user={{
              _id: 1,
              name: 'You',
              avatar:
                'https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg',
            }}
            isTyping={typing}
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderComposer={renderComposer}
            keyboardShouldPersistTaps="handled"
            dismissKeyboardOnPress={false}
            bottomOffset={Platform.OS === 'ios' ? 30 : 0}
            showAvatarForEveryMessage
            showUserAvatar
            renderAvatar={props => (
              <Image
                style={{ height: 28, width: 28, borderRadius: 50 }}
                source={{ uri: props.currentMessage?.user?.avatar }}
              />
            )}
          />
        </KeyboardAvoidingView>
  );
};

export default Chat;
