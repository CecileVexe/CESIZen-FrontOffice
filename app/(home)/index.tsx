import { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { getRessources } from "../../services/ressources.services";
import { Ressource } from "../../utils/types/Ressources.types";

const renderItem = ({ item }: { item: Ressource }) => {
  return (
    // <Link href={`/${item.id}`} style={styles.recipeContainer}>
    <Text>{item.title}</Text>
    // </Link>
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

  console.log(ressources);

  return (
    <View>
      {ressources ? (
        <FlatList
          data={ressources}
          keyExtractor={(item) => `${item.title}+1`}
          renderItem={renderItem}
        />
      ) : (
        <Text>Aucune ressources disponnibles</Text>
      )}
    </View>
  );
}
