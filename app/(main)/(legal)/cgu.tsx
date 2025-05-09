import React from "react";
import { ScrollView } from "react-native";
import { Text, Title, Paragraph, Divider } from "react-native-paper";

const TermsOfUseScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Title>Conditions d'utilisation</Title>
      <Paragraph>
        Bienvenue sur CESIZen, une application dédiée au suivi du bien-être
        émotionnel et à la sensibilisation à la santé mentale. L’utilisation de
        cette application implique l’acceptation des conditions suivantes.
      </Paragraph>

      <Divider style={{ marginVertical: 10 }} />

      <Title style={{ fontSize: 18 }}>1. Objet de l'application</Title>
      <Paragraph>
        CESIZen propose des outils de suivi émotionnel et des articles
        informatifs. Elle ne remplace en aucun cas un avis ou un suivi médical
        professionnel.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>2. Compte utilisateur</Title>
      <Paragraph>
        Vous devez créer un compte personnel pour accéder à certaines
        fonctionnalités. Vos données sont sécurisées et vous avez le droit de
        les consulter, modifier ou supprimer à tout moment.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>3. Données personnelles</Title>
      <Paragraph>
        CESIZen respecte la règlementation RGPD. Les données collectées sont
        limitées au strict nécessaire et ne sont jamais partagées. Elles sont
        chiffrées et stockées de manière sécurisée.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>4. Confidentialité</Title>
      <Paragraph>
        Les informations émotionnelles saisies sont strictement personnelles.
        Aucun administrateur ni autre utilisateur ne peut y accéder.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>5. Utilisation responsable</Title>
      <Paragraph>
        L’utilisateur s’engage à utiliser l’application de manière respectueuse,
        sans détournement de ses finalités ou tentative de nuire à son bon
        fonctionnement.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>6. Limitation de responsabilité</Title>
      <Paragraph>
        CESIZen décline toute responsabilité en cas d’usage inapproprié ou
        d’interprétation erronée des contenus proposés. En cas de détresse
        psychologique, nous vous encourageons à consulter un professionnel de
        santé.
      </Paragraph>

      <Title style={{ fontSize: 18 }}>7. Modifications</Title>
      <Paragraph>
        CESIZen peut être amenée à modifier les présentes conditions. Vous serez
        notifié en cas de changement majeur. L’utilisation continue vaut
        acceptation des nouvelles conditions.
      </Paragraph>

      <Paragraph style={{ marginTop: 20, fontStyle: "italic" }}>
        Merci de faire confiance à CESIZen pour vous accompagner dans votre
        bien-être émotionnel.
      </Paragraph>
    </ScrollView>
  );
};

export default TermsOfUseScreen;
