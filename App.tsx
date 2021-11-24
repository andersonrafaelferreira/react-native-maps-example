import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import MapView, {
  MapEvent,
  Marker,
  Callout,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { Fontisto, AntDesign } from "@expo/vector-icons";

import { Modalize } from "react-native-modalize";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

type positionData = {
  latitude: number;
  longitude: number;
};

import { colors } from "./theme";

const App = () => {
  const [allPositions, setAllPositions] = React.useState<positionData[]>([]);

  React.useEffect(() => {
    (async () => {
      // clearData();
      const recoveryData = await AsyncStorage.getItem("@saved_positions");
      const parsedData =
        recoveryData != null
          ? JSON.parse(recoveryData)
          : [
              {
                latitude: -23.5489,
                longitude: -46.6388,
              },
            ];
      console.log(parsedData, "parsedData");
      setAllPositions(parsedData);
    })();
  }, []);

  const [position, setPosition] = React.useState<positionData>({
    latitude: -23.5489,
    longitude: -46.6388,
  });

  async function clearData() {
    setAllPositions([]);
    await AsyncStorage.clear();
    modalizeRef.current?.close();
  }

  async function handleSelectMapPosition(event: MapEvent) {
    backToTheFuture(event.nativeEvent.coordinate);
    setAllPositions([...allPositions, event.nativeEvent.coordinate]);

    try {
      const preSave = JSON.stringify([...allPositions, position]);
      await AsyncStorage.setItem("@saved_positions", preSave);
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  const modalizeRef = React.useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const mapRef = React.useRef(null);

  async function backToTheFuture(item: positionData, index?: number) {
    setPosition(item);
    mapRef.current?.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    });

    if (index) {
      console.log(index);

      const removed = allPositions.slice(0, Number(index) + 1);
      setAllPositions(removed);
      await AsyncStorage.setItem("@saved_positions", JSON.stringify(removed));
    }
  }

  function hireDeveloper() {
    modalizeRef.current?.close();
  }

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent style="dark" />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onOpen}
          style={{
            width: 56,
            height: 56,
            position: "absolute",
            marginTop: 40,
            right: 20,
            zIndex: 2,
            alignSelf: "flex-end",
            borderRadius: 32,
            borderWidth: 4,
            borderColor: colors.orange,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: "https://github.com/andersonrafaelferreira.png" }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
          />
        </TouchableOpacity>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          }}
          ref={mapRef}
          onPress={handleSelectMapPosition}
          style={styles.mapStyle}
        >
          <Marker
            icon={{ uri: "https://imgur.com/scjKUVG.png" }}
            calloutAnchor={{ x: 2.7, y: 0.8 }}
            coordinate={position}
          >
            <Callout tooltip>
              <TouchableOpacity style={styles.calloutContainer} disabled>
                <Text style={styles.calloutText}>
                  {JSON.stringify(position.latitude).slice(0, 8)} |{" "}
                  {JSON.stringify(position.longitude).slice(0, 8)}
                </Text>
              </TouchableOpacity>
            </Callout>
          </Marker>
        </MapView>
      </View>
      <Modalize
        ref={modalizeRef}
        snapPoint={280}
        HeaderComponent={
          <View style={styles.headerContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Fontisto
                name="history"
                color="gray"
                size={18}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: colors.gray }}>History</Text>
            </View>
            <TouchableOpacity onPress={clearData}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.red }}>Clear List</Text>
                <AntDesign
                  name="delete"
                  color={colors.red}
                  size={18}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        }
      >
        <ScrollView
          style={{
            // flex: 1,
            height: 180,
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {allPositions.map((item, index) => (
            <TouchableOpacity
              style={styles.calloutContainer}
              key={String(Math.random())}
              onPress={() => backToTheFuture(item, index)}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {allPositions.length == Number(index) + 1 && (
                  <Image
                    source={{
                      uri: "https://imgur.com/scjKUVG.png",
                    }}
                    style={{
                      width: 18,
                      height: 18,
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.calloutText,
                    allPositions.length == Number(index) + 1 && {
                      color: colors.red,
                    },
                  ]}
                >
                  {JSON.stringify(item.latitude).slice(0, 8)} |{" "}
                  {JSON.stringify(item.longitude).slice(0, 8)}{" "}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.hireButton}
          onPress={() =>
            Linking.openURL(
              "https://www.linkedin.com/in/andersonrafaelferreira/"
            )
          }
        >
          <Text style={styles.hireButtonText}>Hire Developer</Text>
        </TouchableOpacity>
      </Modalize>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  calloutContainer: {
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
    elevation: 3,
  },

  calloutText: {
    color: colors.orange,
    fontSize: 14,
    zIndex: -10,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  hireButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    // marginHorizontal: 20,
    // marginTop: 10,
    backgroundColor: colors.blue,
  },

  hireButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    height: 60,
  },
});
