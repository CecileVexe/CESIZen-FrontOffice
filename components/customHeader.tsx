import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";

export const CustomHeader = ({ navigation, back }: any) => {
  const today = new Date();
  const parseToday = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View style={styles.header}>
      {back && (
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Icon source="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text variant="titleMedium" style={styles.title}>
        {parseToday}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "#52B788",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
});
