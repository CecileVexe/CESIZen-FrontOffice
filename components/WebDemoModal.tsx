import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Modal, Portal, Text } from "react-native-paper";
import { customTheme } from "../utils/theme/theme";

const STORAGE_KEY = "cesizen-web-demo-modal-seen";

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

// Modale d'accueil affichée par le cadre téléphone (version web sur ordinateur)
const WebDemoModal = () => {
  const [visible, setVisible] = useState(() => !hasSeenModal());

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
          Cette application est conçue pour mobile. Vous allez la découvrir dans
          un aperçu au format téléphone.
        </Text>

        <View style={styles.tip}>
          <Icon
            source="lightbulb-on-outline"
            size={20}
            color={customTheme.colors.secondary}
          />
          <Text style={styles.tipText}>
            Pour une expérience complète, ouvrez ce lien sur votre téléphone.
          </Text>
        </View>

        <Button mode="contained" onPress={handleClose} style={styles.button}>
          Découvrir l'application
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 440,
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
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: customTheme.colors.background,
  },
  tipText: {
    flexShrink: 1,
    fontWeight: "bold",
  },
  button: {
    marginTop: 8,
  },
});

export default WebDemoModal;
