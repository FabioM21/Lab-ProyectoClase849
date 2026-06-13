import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import ScreenWrapper from "../components/ScreenWrapper";
import SectionTitle from "../components/SectionTitle";
import { Alert } from "react-native";
import { supabase } from "../services/supabaseClient";

export default function RegisterScreen ({ navigation }: any) {
     //definicion de una variable de estado en ReactN
const [email, setEmail] = useState("");
const [password, setPassword] = useState ("");
const [name, setName] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  if (!name.trim() || !phoneNumber.trim() || !email.trim() || !password.trim()) {
    Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
    return;
  }
  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
  });
  setLoading(false);
  if (error) {
    Alert.alert("Error al registrarse", error.message);
    return;
  }
  if (data.user) {
    Alert.alert(
      "¡Registro exitoso!",
      "Tu cuenta fue creada correctamente.",
      [{ text: "Iniciar sesión", onPress: () => navigation.navigate("Login") }]
    );
  }
};

  return (
   <ScreenWrapper>
  <SectionTitle title="Crear cuenta" subtitle="Completa los datos para registrarte" />
      
       <CustomInput 
        placeholder={"Ingresa tu nombre"} 
        value={name} 
        onChange={setName}
        />
          <CustomInput 
          type={"number"}
        placeholder={"Ingresa tu numero de telefono"} 
        value={phoneNumber} 
        onChange={setPhoneNumber}
        />
      <CustomInput 
        type={"email"} 
        placeholder={"micorreo@gmail.com"} 
        value={email} 
        onChange={setEmail}
        />
      <CustomInput 
        type={"password"} 
        placeholder={"Ingresa tu contraseña"} 
        value={password} 
        onChange={setPassword}
        />
      <CustomButton
        title={"App"}
        onPress={() => {
          console.log("Press desde boton App");
        }}
      />
       <CustomButton
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
        variant="primary"
      />
    </ScreenWrapper>
  );
}

