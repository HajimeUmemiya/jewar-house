import { Stack } from 'expo-router';

export default function CategoriesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="gold-jewellery" />
      <Stack.Screen name="gold-chains" />
      <Stack.Screen name="gold-bangles" />
      <Stack.Screen name="gold-rings" />
      <Stack.Screen name="silver-jewellery" />
      <Stack.Screen name="silver-bangles" />
      <Stack.Screen name="diamond-jewellery" />
      <Stack.Screen name="diamond-rings" />
      <Stack.Screen name="new-arrival" />
    </Stack>
  );
}