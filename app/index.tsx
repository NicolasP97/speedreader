import { View } from "react-native";
import { AppText } from "@/components/ui/AppText";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText>Index Screen.</AppText>
    </View>
  );
}
