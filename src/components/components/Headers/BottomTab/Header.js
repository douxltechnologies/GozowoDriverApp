import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Wallet from '../../../../assets/icons/wallet.svg';
import { fontSize, spacing } from '../../../../utils/scaling';
import { COLOR } from '../../../../utils/color';
import { WEIGHT } from '../../../../utils/weight';

const Header = () => {
  const [activeTab, setActiveTab] = useState('online');

  return (
    <View
      style={{
        paddingHorizontal: spacing?.wp15,
        paddingVertical: spacing.hp50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity>
        <Wallet />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1.5,
          borderColor: COLOR.blue,
          borderRadius: spacing.hp6,
        }}
      >
        {/* ONLINE BUTTON */}
        <TouchableOpacity
          onPress={() => setActiveTab('online')}
          style={{
            paddingHorizontal: Dimensions.get('window').width * 0.07,
            paddingVertical: spacing.hp6,
            backgroundColor: activeTab === 'online' ? COLOR.blue : COLOR.white,
            borderTopLeftRadius: spacing.hp6,
            borderBottomLeftRadius: spacing.hp6,
          }}
        >
          <Text
            style={{
              color: activeTab === 'online' ? COLOR.white : COLOR.blue,
              fontSize: fontSize.font14,
              fontWeight: WEIGHT.semi,
            }}
          >
            Online
          </Text>
        </TouchableOpacity>

        {/* OFFLINE BUTTON */}
        <TouchableOpacity
          onPress={() => setActiveTab('offline')}
          style={{
            paddingHorizontal: Dimensions.get('window').width * 0.07,
            paddingVertical: spacing.hp6,
            backgroundColor: activeTab === 'offline' ? COLOR.blue : COLOR.white,
            borderTopRightRadius: spacing.hp6,
            borderBottomRightRadius: spacing.hp6,
          }}
        >
          <Text
            style={{
              color: activeTab === 'offline' ? COLOR.white : COLOR.blue,
              fontSize: fontSize.font14,
              fontWeight: WEIGHT.semi,
            }}
          >
            Offline
          </Text>
        </TouchableOpacity>
      </View>

      <View />
    </View>
  );
};

export default Header;
