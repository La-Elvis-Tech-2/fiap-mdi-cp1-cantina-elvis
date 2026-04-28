import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContext';

const PINK = '#ED145B';

function CustomTabBar({ state, navigation }) {
    const { totalItems } = useCart();

    const icons = { index: 'home-outline', search: 'search-outline', cart: 'bag-outline', profile: 'person-outline' };
    const labels = { index: 'Início', search: 'Buscar', cart: 'Carrinho', profile: 'Perfil' };

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };
                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
                            <View style={[styles.pill, isFocused && styles.pillActive]}>
                                <View>
                                    <Ionicons name={icons[route.name]} size={22} color={isFocused ? PINK : '#555'} />
                                    {route.name === 'cart' && totalItems > 0 && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// Sem useAuth aqui, sem redirect — quem controla é o RootGate no _layout.js raiz
export default function TabsLayout() {
    return (
        <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="search" />
            <Tabs.Screen name="cart" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: { position: 'absolute', bottom: Platform.OS === 'ios' ? 24 : 20, left: 40, right: 40 },
    tabBar: {
        flexDirection: 'row', backgroundColor: '#222222', borderRadius: 30,
        height: 62, alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8,
        borderWidth: 1, borderColor: '#333333',
        shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12,
    },
    tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    pill: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, gap: 3 },
    pillActive: { flexDirection: 'row', gap: 6, backgroundColor: '#2D1120', borderWidth: 1, borderColor: '#4A1A30', borderRadius: 30, paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
    badge: {
        position: 'absolute', top: -4, right: -8, backgroundColor: PINK, borderRadius: 10,
        minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
        borderWidth: 1.5, borderColor: '#222222',
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    labelActive: { color: PINK, fontWeight: '700', fontSize: 11 },
});