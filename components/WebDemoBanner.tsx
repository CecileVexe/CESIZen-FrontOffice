import { Platform, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const WARNING_BACKGROUND = "#FF9800";
const WARNING_TEXT = "#2B1700";

// Bandeau d'avertissement affiché uniquement sur la version web (démo portfolio)
const WebDemoBanner = () => {
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Icon source="alert" size={20} color={WARNING_TEXT} />
      <Text style={styles.text}>
        Aperçu web d'une app conçue pour mobile : l'affichage et certaines
        fonctionnalités peuvent différer.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: WARNING_BACKGROUND,
    borderBottomWidth: 3,
    borderBottomColor: "#E65100",
  },
  text: {
    flexShrink: 1,
    color: WARNING_TEXT,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default WebDemoBanner;
