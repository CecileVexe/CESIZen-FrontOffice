import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Card, Text } from "react-native-paper";

import { Link } from "expo-router";
import { Ressource } from "../../../utils/types/Ressources.types";
import { getRessources } from "../../../services/ressources.service";
import { SignOutButton } from "../../../components/SignOutButton";

const renderItem = ({ item }: { item: Ressource }) => {
  return (
    <Link href={`/(ressource)/${item.id}`}>
      <Card>
        {item.file && <Card.Cover source={{ uri: `${item.file}` }} />}
        <Card.Content>
          <Text variant="titleLarge">{item.title}</Text>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
      </Card>
    </Link>
  );
};

export default function Page() {
  const [ressources, setRessources] = useState<Ressource[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);

  const getDatas = useCallback(async () => {
    const response = await getRessources();
    if (response) {
      const validatedRessrouces = response.data.filter(
        (ressource) => ressource.isValidate,
      );
      setRessources(validatedRessrouces);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    getDatas();
  }, [getDatas]);

  useEffect(() => {
    getDatas();
  }, [getDatas]);

  return (
    <View>
      <SignOutButton />
      {ressources ? (
        <FlatList
          data={ressources}
          keyExtractor={(item) => `${item.title}_card`}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text>Aucune ressources disponnibles !</Text>
      )}
    </View>
  );
}
