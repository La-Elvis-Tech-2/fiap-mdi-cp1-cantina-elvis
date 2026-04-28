import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    FlatList, SafeAreaView, StatusBar, Image, Modal,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';

// ─── Mock Data ────────────────────────────────────────────────────────────────
// "todos" removido da lista — é o estado padrão quando nada está selecionado
const CATEGORIES_CARDS = [
    { id: 'lanches', label: 'Lanches', image: require('../../assets/lanche.jpg') },
    { id: 'bebidas', label: 'Bebidas', image: require('../../assets/bebida.jpg') },
    { id: 'refeicoes', label: 'Refeições', image: require('../../assets/prato.jpg') },
    { id: 'doces', label: 'Doces', image: require('../../assets/doce.jpg') },
];

const ALL_PRODUCTS = [
    { id: '1', name: 'Hambúrguer de Frango', weight: '120 gm.', price: 6.0, image: require('../../assets/burguer.jpg'), discount: null, category: 'lanches' },
    { id: '2', name: 'Suco de Laranja', weight: '300 ml.', price: 8.0, image: require('../../assets/sucolaranj.jpg'), discount: 10, category: 'bebidas' },
    { id: '3', name: 'Misto Quente', weight: '150 gm.', price: 9.5, image: require('../../assets/misto.jpg'), discount: null, category: 'lanches' },
    { id: '4', name: 'Café Coado', weight: '200 ml.', price: 4.0, image: require('../../assets/cafe.jpg'), discount: null, category: 'bebidas' },
    { id: '5', name: 'Hambúrguer X', weight: '80 gm.', price: 5.0, image: require('../../assets/burguer2.jpg'), discount: null, category: 'lanches' },
    { id: '6', name: 'Água Mineral', weight: '500 ml.', price: 3.5, image: require('../../assets/agua.jpg'), discount: null, category: 'bebidas' },
    { id: '7', name: 'Brownie de Chocolate', weight: '90 gm.', price: 7.0, image: require('../../assets/brownie.jpg'), discount: 15, category: 'doces' },
    { id: '8', name: 'Refrigerante Lata', weight: '350 ml.', price: 6.0, image: require('../../assets/fanta.jpg'), discount: null, category: 'bebidas' },
];

const BELOW_10 = ALL_PRODUCTS.filter(p => p.price < 10);

const FLOORS = ['5º Andar', '7º Andar'];

// ─── NotificationsModal — estado vazio ────────────────────────────────────────
function NotificationsModal({ visible, onClose }) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Notificações</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={WHITE} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.notifEmpty}>
                        <Ionicons name="notifications-off-outline" size={44} color={BORDER} />
                        <Text style={styles.notifEmptyTitle}>Nenhuma notificação</Text>
                        <Text style={styles.notifEmptyBody}>Você será avisado sobre promoções e pedidos por aqui.</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// ─── CategoryChip ─────────────────────────────────────────────────────────────
// Clica de novo na categoria ativa para desmarcar (volta a "todos")
function CategoryChip({ item, active, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.categoryCard, active && styles.categoryCardActive]}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
            <View style={styles.categoryOverlay} />
            <Text style={styles.categoryLabel}>{item.label}</Text>
        </TouchableOpacity>
    );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ item }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 700);
    };

    return (
        <View style={styles.productCard}>
            {item.discount && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
            )}
            <View style={styles.productIconWrap}>
                <Image source={item.image} style={styles.productImage} resizeMode="cover" />
            </View>
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productWeight}>{item.weight}</Text>
            <View style={styles.productFooter}>
                <Text style={styles.productPrice}>R${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                    style={[styles.addBtn, added && styles.addBtnDone]}
                    onPress={handleAdd}
                    activeOpacity={0.8}
                >
                    <Ionicons name={added ? 'checkmark' : 'add'} size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function SectionHeader({ title }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
        </View>
    );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [floorIndex, setFloorIndex] = useState(0);
    // null = todos (padrão, sem seleção visual)
    const [activeCategory, setActiveCategory] = useState(null);
    const [showNotif, setShowNotif] = useState(false);

    const firstName = user?.name?.split(' ')[0] || 'Usuário';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    // Toca na categoria: se já está ativa, desmarca (volta a null = todos)
    const handleCategoryPress = (id) => {
        setActiveCategory(prev => prev === id ? null : id);
    };

    const filteredDestaques = activeCategory
        ? ALL_PRODUCTS.filter(p => p.category === activeCategory)
        : ALL_PRODUCTS;

    const filteredBelow10 = activeCategory
        ? BELOW_10.filter(p => p.category === activeCategory)
        : BELOW_10;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            <NotificationsModal visible={showNotif} onClose={() => setShowNotif(false)} />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerLogoText}>FIAP</Text>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => setShowNotif(true)}>
                        <Ionicons name="notifications-outline" size={20} color={WHITE} />
                    </TouchableOpacity>
                </View>

                {/* Greeting */}
                <View style={styles.greetingWrap}>
                    <Text style={styles.greetingSub}>{greeting},</Text>
                    <Text style={styles.greetingTitle}>{firstName} 👋</Text>
                    <View style={styles.greetingUnderline} />
                </View>

                {/* Search Bar */}
                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.8}
                    onPress={() => router.push('/(tabs)/search')}
                >
                    <View style={styles.searchLeft}>
                        <Ionicons name="search-outline" size={18} color={MUTED} />
                        <Text style={styles.searchPlaceholder}>Buscar na cantina...</Text>
                    </View>
                    <View style={styles.filterBtn}>
                        <Ionicons name="search" size={18} color={WHITE} />
                    </View>
                </TouchableOpacity>

                {/* Location Bar */}
                <View style={styles.locationBar}>
                    <View style={styles.locationLeft}>
                        <View style={styles.locIconWrap}>
                            <Ionicons name="location" size={16} color={PINK} />
                        </View>
                        <View>
                            <Text style={styles.locationLabel}>Unidade Paulista</Text>
                            <Text style={styles.locationCity}>{FLOORS[floorIndex]}</Text>
                        </View>
                    </View>
                    <View style={styles.floorToggle}>
                        {FLOORS.map((floor, i) => (
                            <TouchableOpacity
                                key={floor}
                                style={[styles.floorBtn, floorIndex === i && styles.floorBtnActive]}
                                onPress={() => setFloorIndex(i)}
                            >
                                <Text style={[styles.floorBtnText, floorIndex === i && styles.floorBtnTextActive]}>
                                    {floor}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Categorias */}
                <View style={styles.categorySectionHeader}>
                    <View style={styles.sectionTitleWrap}>
                        <View style={styles.sectionAccent} />
                        <Text style={styles.sectionTitle}>Categorias</Text>
                    </View>
                    {/* Indicador sutil quando há filtro ativo */}
                    {activeCategory && (
                        <TouchableOpacity onPress={() => setActiveCategory(null)} style={styles.clearFilter}>
                            <Text style={styles.clearFilterText}>Limpar filtro</Text>
                            <Ionicons name="close-circle" size={14} color={PINK} />
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={CATEGORIES_CARDS}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => (
                        <CategoryChip
                            item={item}
                            active={activeCategory === item.id}
                            onPress={() => handleCategoryPress(item.id)}
                        />
                    )}
                />

                {/* Destaques */}
                {filteredDestaques.length > 0 && (
                    <>
                        <SectionHeader title={activeCategory ? `Destaques em ${CATEGORIES_CARDS.find(c => c.id === activeCategory)?.label}` : 'Destaques da cantina'} />
                        <FlatList
                            data={filteredDestaques}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsList}
                            renderItem={({ item }) => <ProductCard item={item} />}
                        />
                    </>
                )}

                {/* Abaixo de R$10 */}
                {filteredBelow10.length > 0 && (
                    <>
                        <SectionHeader title="Tudo abaixo de R$10!" />
                        <FlatList
                            data={filteredBelow10}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.productsList}
                            renderItem={({ item }) => <ProductCard item={item} />}
                        />
                    </>
                )}

                {/* Estado vazio */}
                {filteredDestaques.length === 0 && filteredBelow10.length === 0 && (
                    <View style={styles.emptyWrap}>
                        <Ionicons name="basket-outline" size={52} color={BORDER} />
                        <Text style={styles.emptyTitle}>Nenhum produto nessa categoria</Text>
                        <TouchableOpacity onPress={() => setActiveCategory(null)}>
                            <Text style={styles.emptyLink}>Ver todos os produtos</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    container: { flex: 1, backgroundColor: BG },

    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 16, marginBottom: 24 },
    headerLogoText: { fontSize: 22, fontWeight: '900', color: PINK, letterSpacing: 3 },
    notifBtn: { width: 40, height: 40, backgroundColor: CARD, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER },

    greetingWrap: { marginHorizontal: 20, marginBottom: 24 },
    greetingSub: { fontSize: 16, color: MUTED, fontWeight: '400', marginBottom: 2 },
    greetingTitle: { fontSize: 34, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
    greetingUnderline: { marginTop: 8, width: 40, height: 3, backgroundColor: PINK, borderRadius: 2 },

    searchBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: CARD, marginHorizontal: 20, marginBottom: 16, borderRadius: 16, paddingLeft: 18, paddingRight: 6, paddingVertical: 6, borderWidth: 1, borderColor: BORDER },
    searchLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    searchPlaceholder: { color: MUTED, fontSize: 14 },
    filterBtn: { backgroundColor: PINK, borderRadius: 12, padding: 10 },

    locationBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 24, backgroundColor: CARD, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: BORDER },
    locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    locIconWrap: { width: 38, height: 38, backgroundColor: '#2D1120', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 2 },
    locationCity: { fontSize: 14, fontWeight: '700', color: WHITE },
    floorToggle: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 12, padding: 3, gap: 3, borderWidth: 1, borderColor: BORDER },
    floorBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
    floorBtnActive: { backgroundColor: PINK },
    floorBtnText: { fontSize: 12, fontWeight: '600', color: MUTED },
    floorBtnTextActive: { color: WHITE },

    categorySectionHeader: { paddingHorizontal: 20, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    clearFilter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    clearFilterText: { fontSize: 12, color: PINK, fontWeight: '600' },

    categoryList: { paddingHorizontal: 20, gap: 12, paddingBottom: 24 },
    categoryCard: { width: 100, height: 100, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, position: 'relative' },
    categoryCardActive: { borderColor: PINK, borderWidth: 2 },
    categoryImage: { width: '100%', height: '100%', position: 'absolute' },
    categoryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },
    categoryLabel: { position: 'absolute', bottom: 8, left: 8, right: 8, color: WHITE, fontSize: 12, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionAccent: { width: 4, height: 18, backgroundColor: PINK, borderRadius: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: WHITE },

    productsList: { paddingHorizontal: 20, gap: 14, paddingBottom: 28 },
    productCard: { width: 158, backgroundColor: CARD, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: BORDER, position: 'relative' },
    discountBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: PINK, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, zIndex: 1 },
    discountText: { color: WHITE, fontSize: 10, fontWeight: '800' },
    productIconWrap: { width: '100%', height: 100, borderRadius: 12, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: '#3A1020' },
    productImage: { width: '100%', height: '100%' },
    productName: { fontSize: 13, fontWeight: '700', color: WHITE, marginBottom: 4, lineHeight: 18 },
    productWeight: { fontSize: 11, color: MUTED, marginBottom: 12, fontWeight: '500' },
    productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    productPrice: { fontSize: 16, fontWeight: '800', color: WHITE },
    addBtn: { width: 34, height: 34, backgroundColor: PINK, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    addBtnDone: { backgroundColor: '#1E7A45' },

    // Modal notificações vazio
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48, borderWidth: 1, borderColor: BORDER, borderBottomWidth: 0 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: WHITE },
    notifEmpty: { alignItems: 'center', gap: 10, paddingVertical: 16 },
    notifEmptyTitle: { fontSize: 16, fontWeight: '800', color: WHITE },
    notifEmptyBody: { fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },

    emptyWrap: { alignItems: 'center', paddingTop: 48, paddingBottom: 32, gap: 12 },
    emptyTitle: { fontSize: 15, color: MUTED, fontWeight: '600' },
    emptyLink: { fontSize: 14, color: PINK, fontWeight: '700' },
});