import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { PaperProvider } from "react-native-paper";
import { customTheme } from "../utils/theme/theme";
import WebDemoModal from "./WebDemoModal";

// Taille d'écran simulée (iPhone 14)
const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const FRAME_BORDER = 12;
const PAGE_MARGIN = 24;
// En dessous de cette largeur, on est déjà sur téléphone (ou en simulation) : pas de cadre
const DESKTOP_MIN_WIDTH = 768;

const isInsideIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    // Accès à window.top refusé : on est forcément dans un iframe
    return true;
  }
};

// Sur web et écran large, l'app est affichée dans un iframe au format téléphone.
// L'iframe recharge le site lui-même : à l'intérieur, la fenêtre fait la taille
// d'un téléphone, donc toutes les mesures d'écran de l'app restent justes.
export const useShouldRenderPhoneFrame = () => {
  const { width } = useWindowDimensions();

  return (
    Platform.OS === "web" && width >= DESKTOP_MIN_WIDTH && !isInsideIframe()
  );
};

const WebPhoneFrame = () => {
  const { height } = useWindowDimensions();
  const screenHeight = Math.min(
    PHONE_HEIGHT,
    height - PAGE_MARGIN * 2 - FRAME_BORDER * 2,
  );

  return (
    <PaperProvider theme={customTheme}>
      <View style={styles.page}>
        <View style={styles.phone}>
          <iframe
            title="CESIZen"
            src={window.location.href}
            style={{
              width: PHONE_WIDTH,
              height: screenHeight,
              border: "none",
              display: "block",
            }}
          />
        </View>
      </View>
      <WebDemoModal />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: PAGE_MARGIN,
    backgroundColor: customTheme.colors.background,
  },
  phone: {
    borderWidth: FRAME_BORDER,
    borderColor: "#1F1F1F",
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
    boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25)",
  },
});

export default WebPhoneFrame;
