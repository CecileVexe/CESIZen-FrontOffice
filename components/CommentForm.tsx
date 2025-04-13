import React from "react";
import { View } from "react-native";
import {
  Controller,
  Control,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { TextInput, Button, Text, Portal, Dialog } from "react-native-paper";

interface CommentFormProps {
  visible: boolean;
  hideDialog: () => void;
  control: Control<
    {
      title: string;
      description: string;
    },
    any,
    {
      title: string;
      description: string;
    }
  >;
  handleSubmit: UseFormHandleSubmit<
    {
      title: string;
      description: string;
    },
    {
      title: string;
      description: string;
    }
  >;
  errors: FieldErrors<{
    title: string;
    description: string;
  }>;
  onSubmit: (data: any) => void;
}

const CommentForm = (props: CommentFormProps) => {
  const { visible, hideDialog, control, handleSubmit, onSubmit, errors } =
    props;

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Laissser un commentaire</Dialog.Title>
          <Dialog.Content>
            <Controller
              control={control}
              name="title"
              rules={{ required: "Le titre est requis" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Titre"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.title}
                />
              )}
            />
            {errors.title && (
              <Text style={{ color: "red", marginBottom: 8 }}>
                {errors.title.message}
              </Text>
            )}

            <Controller
              control={control}
              name="description"
              rules={{ required: "La description est requise" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Description"
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.description}
                  style={{ marginTop: 16 }}
                />
              )}
            />
            {errors.description && (
              <Text style={{ color: "red", marginBottom: 8 }}>
                {errors.description.message}
              </Text>
            )}
          </Dialog.Content>

          <Dialog.Actions>
            <Button mode="outlined" onPress={hideDialog}>
              Annuler
            </Button>
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
              Confirmer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CommentForm;
