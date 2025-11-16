import { View, Text } from 'react-native';

export default function ParkingCard({ name }) {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
}