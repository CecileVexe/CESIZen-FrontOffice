import { useEffect, useState } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, Icon, Modal, Portal, Text } from "react-native-paper";
import { customTheme } from "../utils/theme/theme";

const STORAGE_KEY = "cesizen-web-demo-modal-seen";
// En dessous de cette largeur, l'utilisateur est déjà sur mobile (ou en simulation)
const MOBILE_MAX_WIDTH = 768;

const hasSeenModal = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const markModalAsSeen = () => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Stockage indisponible (navigation privée) : la modale réapparaîtra au rechargement
  }
};

// Modale d'accueil affichée uniquement sur la version web (démo portfolio)
const WebDemoModal = () => {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web" && width >= MOBILE_MAX_WIDTH && !hasSeenModal()) {
      setVisible(true);
    }
    // Uniquement à l'arrivée sur le site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Platform.OS !== "web") {
    return null;
  }

  const handleClose = () => {
    markModalAsSeen();
    setVisible(false);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.container}
      >
        <View style={styles.iconWrapper}>
          <Icon
            source="cellphone"
            size={36}
            color={customTheme.colors.primary}
          />
        </View>

        <Text variant="titleLarge" style={styles.title}>
          Bienvenue sur CESIZen
        </Text>
        <Text style={styles.paragraph}>
          Cette application est conçue pour mobile. Pour une meilleure
          expérience :
        </Text>

        <View style={styles.option}>
          <Text style={styles.optionTitle}>
            1. Ouvrez ce lien sur votre téléphone
          </Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionTitle}>
            2. Ou simulez un téléphone dans votre navigateur
          </Text>
          <Text style={styles.optionText}>
            Ouvrez les outils de développement avec{" "}
            <Text style={styles.key}>F12</Text>, puis activez le mode appareil
            avec <Text style={styles.key}>Ctrl + Maj + M</Text>.
          </Text>
          <Text style={styles.optionHint}>
            Sur Mac : <Text style={styles.key}>Cmd + Option + I</Text> puis{" "}
            <Text style={styles.key}>Cmd + Maj + M</Text>.
          </Text>
        </View>

        <Button mode="contained" onPress={handleClose} style={styles.button}>
          J'ai compris
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 480,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  iconWrapper: {
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: customTheme.colors.secondary,
    marginBottom: 8,
  },
  paragraph: {
    textAlign: "center",
    marginBottom: 16,
  },
  option: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: customTheme.colors.background,
  },
  optionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionText: {
    lineHeight: 20,
  },
  optionHint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.8,
  },
  key: {
    fontWeight: "bold",
    color: customTheme.colors.secondary,
  },
  button: {
    marginTop: 8,
  },
});

export default WebDemoModal;
