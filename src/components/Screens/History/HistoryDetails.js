// Optimized & Cleaned HistoryDetails Screen
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { ChevronLeft, Star } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { useGetJobById } from '../../../api/useGetJobById';
import { fontSize, spacing } from '../../../utils/scaling';
import { WEIGHT } from '../../../utils/weight';
import { COLOR } from '../../../utils/color';
import { GOOGLE_API_KEY } from '../../../utils/keys';

const { width, height } = Dimensions.get('window');

const HistoryDetails = ({ navigation, route }) => {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const TOKEN = useSelector(state => state?.token);

  const [tripDetails, setTripDetails] = useState(null);
  const { getJobById } = useGetJobById();

  /* -------------------- Fetch Job -------------------- */
  useEffect(() => {
    if (!route?.params?.jobId) return;

    const fetchJob = async () => {
      const result = await getJobById(TOKEN, route.params.jobId);
      if (result) setTripDetails(result);
    };

    fetchJob();
  }, [route?.params?.jobId, TOKEN]);

  /* -------------------- Locations -------------------- */
  const pickup = useMemo(() => {
    if (!tripDetails) return null;
    return {
      latitude: Number(tripDetails.pickupLocationLat),
      longitude: Number(tripDetails.pickupLocationLong),
    };
  }, [tripDetails]);

  const dropoff = useMemo(() => {
    if (!tripDetails) return null;
    return {
      latitude: Number(tripDetails.dropOffLocationLat),
      longitude: Number(tripDetails.dropOffLocationLong),
    };
  }, [tripDetails]);

  /* -------------------- Fit Map -------------------- */
  useEffect(() => {
    if (!isFocused || !pickup || !dropoff || !mapRef.current) return;

    const timer = setTimeout(() => {
      mapRef.current.fitToCoordinates([pickup, dropoff], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isFocused, pickup, dropoff]);

  const totalStops = (tripDetails?.stops?.length || 0) + 2;

  if (!tripDetails) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <ChevronLeft size={24} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* -------------------- Map -------------------- */}
        {pickup && dropoff && (
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                ...pickup,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
            >
              <Marker coordinate={pickup}>
                <View style={styles.pickupMarker} />
              </Marker>
              <Marker coordinate={dropoff}>
                <View style={styles.dropoffMarker} />
              </Marker>

              <MapViewDirections
                apikey={GOOGLE_API_KEY}
                origin={pickup}
                destination={dropoff}
                strokeWidth={3}
                strokeColor={COLOR.blue}
              />
            </MapView>
          </View>
        )}

        {/* -------------------- Details -------------------- */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {/* Driver Card */}
          <View style={styles.card}>
            <Text style={styles.jobType}>Job Type {tripDetails?.jobType?.name}</Text>

            <View style={styles.driverRow}>
              <Image source={{ uri: tripDetails.userImage }} style={styles.avatar} />
              <View>
                <Text style={styles.driverName}>{tripDetails.userName}</Text>
                <View style={styles.ratingRow}>
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={12} color="#FFD700" fill="#FFD700" />
                  ))}
                  <Text style={styles.ratingText}>
                    {tripDetails.userRating} ({tripDetails.totalRaters})
                  </Text>
                </View>
                <Text style={styles.metaText}>
                  {tripDetails.vehicleCategory?.name} - {tripDetails.vehicleSubCategory?.name}
                </Text>
                <Text style={styles.metaText}>
                  {tripDetails.driver?.vehicleDetails?.model} {tripDetails.driver?.vehicleDetails?.year}
                </Text>
              </View>
            </View>

            {/* Locations */}
            <View style={styles.locationRow}>
              <View style={styles.timeline}>
                {[...Array(totalStops)].map((_, index) => {
                  const isFirst = index === 0;
                  const isLast = index === totalStops - 1;
                  return (
                    <View key={index} style={styles.timelineItem}>
                      {!isFirst && <View style={styles.dots} />}
                      <View
                        style={[
                          styles.stopDot,
                          isFirst && { borderColor: COLOR.green },
                          isLast && { borderColor: COLOR.blue },
                        ]}
                      />
                      {!isLast && <View style={styles.dots} />}
                    </View>
                  );
                })}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.address}>{tripDetails.pickupLocation}</Text>
                {tripDetails.stops?.map((s, i) => (
                  <Text key={i} style={styles.address}>{s.Address}</Text>
                ))}
                <Text style={styles.address}>{tripDetails.dropOffLocation}</Text>
              </View>
            </View>
          </View>

          {/* Payment */}
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.card}>
            <PayRow label="Booking Fare" value={`SAR ${tripDetails.fare}`} />
            <PayRow label="Platform Fee" value="SAR 7" />
            <PayRow label="Tax" value="SAR 3" />
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total Payable</Text>
              <Text style={styles.totalText}>SAR 310</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Contact Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Rebook</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PayRow = ({ label, value }) => (
  <View style={styles.payRow}>
    <Text>{label}</Text>
    <Text style={{ fontWeight: WEIGHT.bold }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLOR.white },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.hp15 },
  headerTitle: { fontSize: fontSize.font20, fontWeight: WEIGHT.bold, marginLeft: 12 },
  mapWrapper: { height: height * 0.3 },
  pickupMarker: { width: 12, height: 12, backgroundColor: COLOR.green, borderRadius: 6 },
  dropoffMarker: { width: 12, height: 12, backgroundColor: COLOR.blue, borderRadius: 6 },
  detailsContainer: { padding: spacing.wp15 },
  sectionTitle: { fontSize: fontSize.font16, fontWeight: WEIGHT.bold, marginVertical: 10 },
  card: { backgroundColor: COLOR.white, padding: 15, borderRadius: 8, marginBottom: 15 },
  jobType: { fontWeight: WEIGHT.bold, marginBottom: 10 },
  driverRow: { flexDirection: 'row', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  driverName: { fontWeight: WEIGHT.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11 },
  metaText: { fontSize: 11, color: COLOR.grey },
  locationRow: { flexDirection: 'row', marginTop: 15 },
  timeline: { alignItems: 'center', marginRight: 10 },
  timelineItem: { alignItems: 'center' },
  stopDot: { width: 12, height: 12, borderWidth: 2, borderRadius: 6 },
  dots: { height: 12, borderLeftWidth: 1, borderColor: '#ccc' },
  address: { marginBottom: 15, fontSize: 13 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 },
  totalText: { fontWeight: WEIGHT.bold },
  primaryBtn: { backgroundColor: COLOR.blue, padding: 14, borderRadius: 8, alignItems: 'center' },
  primaryText: { color: COLOR.white, fontWeight: WEIGHT.bold },
  secondaryBtn: { backgroundColor: COLOR.grey, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  secondaryText: { fontWeight: WEIGHT.bold },
});

export default HistoryDetails;