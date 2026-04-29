import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { OrdersProvider } from '../context/Orderscontext';

function RootGate() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        const inAuth = segments[0] === '(auth)';
        if (!user && !inAuth) router.replace('/(auth)/login');
        else if (user && inAuth) router.replace('/(tabs)');
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#ED145B" size="large" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <CartProvider>
                <OrdersProvider>
                    <RootGate />
                </OrdersProvider>
            </CartProvider>
        </AuthProvider>
    );
}