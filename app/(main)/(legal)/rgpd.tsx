import React from "react";
import { ScrollView, Linking } from "react-native";
import { Text, Title, Paragraph, Divider } from "react-native-paper";

const RgpdPolicyScreen = () => {
  const openOfficialRgpdLink = () => {
    Linking.openURL(
      "https://www.cnil.fr/fr/reglement-europeen-protection-donnees",
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Title>Politique de confidentialité – RGPD</Title>
      <Paragraph style={{ fontStyle: "italic", marginBottom: 10 }}>
        Dernière mise à jour : 2025-05-09
      </Paragraph>

      <Divider style={{ marginVertical: 10 }} />

      <Title style={{ fontSize: 18 }}>1. Données collectées</Title>
      <Paragraph>
        Nous collectons uniquement les données nécessaires :{"\n"}• Nom, prénom,
        email
        {"\n"}• Mot de passe (crypté)
        {"\n"}• Émotions et descriptions de votre journal
        {"\n"}• Articles ajoutés en favoris
      </Paragraph>

      <Title style={{ fontSize: 18 }}>2. Finalité de la collecte</Title>
      <Paragraph>
        Ces données permettent d'assurer le fonctionnement de l'application
        (connexion, suivi, affichage personnalisé). Aucune donnée n’est utilisée
        à des fins publicitaires.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>3. Base légale</Title>
      <Paragraph>
        La collecte repose sur :{"\n"}• Votre consentement
        {"\n"}• L’intérêt légitime à garantir un service sécurisé
      </Paragraph>

      <Title style={{ fontSize: 18 }}>4. Accès aux données</Title>
      <Paragraph>
        Vous seul avez accès à vos données émotionnelles. Les administrateurs ne
        peuvent pas consulter vos émotions, favoris ou informations
        personnelles.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>5. Durée de conservation</Title>
      <Paragraph>
        Vos données sont conservées uniquement pendant l’utilisation de
        l’application. Vous pouvez les supprimer à tout moment dans les
        paramètres de compte.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>6. Vos droits</Title>
      <Paragraph>
        Vous pouvez à tout moment exercer vos droits :{"\n"}• Accès,
        rectification, suppression, limitation, retrait du consentement.
        {"\n"}Depuis l’application ou par email : [adresse à insérer]
      </Paragraph>

      <Title style={{ fontSize: 18 }}>7. Sécurité des données</Title>
      <Paragraph>
        {"\n"}• Communications chiffrées (HTTPS)
        {"\n"}• Mots de passe hachés
        {"\n"}• Données stockées dans une base sécurisée
        {"\n"}• Authentification via Clerk et gestion par rôles
      </Paragraph>

      <Title style={{ fontSize: 18 }}>8. Modifications</Title>
      <Paragraph>
        Cette politique peut évoluer. Vous serez notifié en cas de changement.
        L’utilisation continue de l’application implique votre acceptation.
      </Paragraph>

      <Divider style={{ marginVertical: 10 }} />

      <Title style={{ fontSize: 18 }}>🔗 En savoir plus</Title>
      <Paragraph onPress={openOfficialRgpdLink} style={{ color: "blue" }}>
        Voir le texte officiel du RGPD sur le site de la CNIL
      </Paragraph>
    </ScrollView>
  );
};

export default RgpdPolicyScreen;
