import {
    View, Text, StyleSheet, SafeAreaView, StatusBar,
    TouchableOpacity, ScrollView, Animated,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';
const GREEN = '#4CAF50';

export default function OrderSuccessScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const total = parseFloat(params.total || '0');
    const itemCount = parseInt(params.itemCount || '0');
    const orderId = params.orderId || '';

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const eta = '~15 minutos';
    const shortId = orderId.slice(-4).toUpperCase();

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Ícone animado */}
                <Animated.View style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.iconInner}>
                        <Ionicons name="checkmark" size={52} color={WHITE} />
                    </View>
                </Animated.View>

                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.title}>Pedido Confirmado!</Text>
                    <Text style={styles.subtitle}>
                        Sua solicitação foi enviada para a cantina e já está sendo preparada.
                    </Text>

                    {/* Card de detalhes */}
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconWrap}>
                                <Ionicons name="receipt-outline" size={18} color={PINK} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Número do pedido</Text>
                                <Text style={styles.detailValue}>#{shortId}</Text>
                            </View>
                        </View>

                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconWrap}>
                                <Ionicons name="bag-outline" size={18} color={PINK} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Itens</Text>
                                <Text style={styles.detailValue}>
                                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconWrap}>
                                <Ionicons name="cash-outline" size={18} color={PINK} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Total pago</Text>
                                <Text style={[styles.detailValue, { color: WHITE, fontSize: 18 }]}>
                                    R${total.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconWrap}>
                                <Ionicons name="time-outline" size={18} color={GREEN} />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Previsão de retirada</Text>
                                <Text style={[styles.detailValue, { color: GREEN }]}>{eta}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Banner de status */}
                    <View style={styles.statusBanner}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Pedido em preparação na cantina</Text>
                    </View>

                    {/* Botões */}
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => router.replace('/(tabs)')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="home-outline" size={20} color={WHITE} />
                        <Text style={styles.primaryBtnText}>Voltar ao Início</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => router.replace('/(tabs)/profile')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="list-outline" size={18} color={PINK} />
                        <Text style={styles.secondaryBtnText}>Ver meus pedidos</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },

    // ScrollView ocupa tudo — sem alignItems aqui
    scroll: { flex: 1, backgroundColor: BG },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 48, alignItems: 'center' },

    content: { width: '100%', alignItems: 'center' },

    iconCircle: {
        width: 120, height: 120, borderRadius: 38,
        backgroundColor: GREEN + '20',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 1, borderColor: GREEN + '40',
    },
    iconInner: {
        width: 84, height: 84, borderRadius: 28,
        backgroundColor: GREEN,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: GREEN, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
        elevation: 10,
    },

    title: { fontSize: 28, fontWeight: '900', color: WHITE, textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 4 },

    detailsCard: {
        width: '100%', backgroundColor: CARD, borderRadius: 22,
        padding: 20, borderWidth: 1, borderColor: BORDER, marginBottom: 16,
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
    detailIconWrap: {
        width: 38, height: 38, backgroundColor: '#2D1120',
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#4A1030',
    },
    detailInfo: { flex: 1 },
    detailLabel: { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    detailValue: { fontSize: 15, color: WHITE, fontWeight: '800' },
    detailDivider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },

    statusBanner: {
        width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#1A2D1A', borderRadius: 14, padding: 14,
        borderWidth: 1, borderColor: GREEN + '44', marginBottom: 28,
    },
    statusDot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN,
        shadowColor: GREEN, shadowOpacity: 0.8, shadowRadius: 4, shadowOffset: { width: 0, height: 0 },
    },
    statusText: { fontSize: 13, color: GREEN, fontWeight: '600' },

    primaryBtn: {
        width: '100%', backgroundColor: PINK, borderRadius: 16,
        paddingVertical: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12,
        shadowColor: PINK, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    primaryBtnText: { color: WHITE, fontSize: 16, fontWeight: '900' },

    secondaryBtn: {
        width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        borderRadius: 16, paddingVertical: 14,
        borderWidth: 1, borderColor: PINK, backgroundColor: '#1A0A10',
    },
    secondaryBtnText: { color: PINK, fontSize: 15, fontWeight: '700' },
});