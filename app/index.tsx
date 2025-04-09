import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login/login" />;
  // return <Redirect href="/cart/cart" />;
  // return <Redirect href="/(tabs)/history" />;
}
