import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { getRessources } from "../../services/ressources.services";
import { Ressource } from "../../utils/types/Ressources.types";
import { Link } from "expo-router";

const renderItem = ({ item }: { item: Ressource }) => {
  return (
    <Link
      href={"/(ressource)/522e617d-fae8-4378-a7d6-01a3a34bda31"}
      // href={`/${item.id}`}
    >
      <Card>
        <Card.Content>
          <Text variant="titleLarge">{item.title}</Text>
          <Text variant="bodyMedium">{item.description}</Text>
        </Card.Content>
        {item.file && <Card.Cover source={{ uri: `${item.file}` }} />}
      </Card>
    </Link>
  );
};

export default function Page() {
  const [ressources, setRessources] = useState<Ressource[] | undefined>(
    undefined,
  );

  const getDatas = useCallback(async () => {
    const response = await getRessources();
    if (response) {
      setRessources(response.data);
    }
  }, []);

  useEffect(() => {
    getDatas();
  }, [getDatas]);

  return (
    <View>
      {ressources ? (
        <FlatList
          data={ressources}
          keyExtractor={(item) => `${item.title}_card`}
          renderItem={renderItem}
        />
      ) : (
        <Text>Aucune ressources disponnibles !</Text>
      )}
    </View>
  );
}
