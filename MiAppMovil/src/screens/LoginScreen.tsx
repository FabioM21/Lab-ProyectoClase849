import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ScreenWrapper from "../components/ScreenWrapper";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { i18n } from "../contexts/LanguageContext";
import { Alert, View, Text, StyleSheet } from "react-native";
import SectionTitle from "../components/SectionTitle";
import { supabase } from "../services/supabaseClient";
import * as WebBrowser from "expo-web-browser"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("mjsalinas@unitec.edu");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = () => {
    try {
      login(email, password);
      navigation.navigate("MainTabs");
    } catch (error) {
      console.log(error);
    }
  };

const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://irynhxptvgfxmtxmlern.supabase.co/auth/v1/callback",
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    Alert.alert("Error con Google", error.message);
    return;
  }

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      "https://irynhxptvgfxmtxmlern.supabase.co/auth/v1/callback"
    );
    console.log("resultado:", result);
  }
};
  return (
    <ScreenWrapper>
      <CustomInput
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={setEmail}
      />

      <CustomInput
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={setPassword}
      />

      <CustomButton title={i18n.t("signIn")} onPress={handleLogin} />

      <View style={styles.divider}>
      <View style={styles.line} />
      <Text style={styles.orText}>o</Text>
      <View style={styles.line} />
      </View>

<CustomButton
  title="Continuar con Google"
  onPress={handleGoogleLogin}
  variant="secondary"
/>
<CustomButton
  title="Regístrarse"
  onPress={() => navigation.navigate("Register")}
  variant="tertiary"
/>
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 13,
  },
});