import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    StatusBar,
    Image,
    TextInput,
    Modal,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES_CARDS = [
    {
        id: 'c1', label: 'Lanches', gradient: ['#FFD86B', '#FF9A3C'],
        image: require('../../assets/lanche.jpg'),
    },
    {
        id: 'c2', label: 'Bebidas', gradient: ['#A8EDEA', '#5BC8C1'],
        image: require('../../assets/bebida.jpg'),
    },
    {
        id: 'c3', label: 'Refeições', gradient: ['#FBC2EB', '#ED145B'],
        image: require('../../assets/prato.jpg'),
    },
    {
        id: 'c4', label: 'Doces', gradient: ['#C2FFD8', '#4CAF50'],
        image: require('../../assets/doce.jpg'),
    },
];

const ALL_NEEDS = [
    { id: '1', name: 'Hambúrguer de Frango', weight: '120 gm.', price: 6.0, image: require('../../assets/burguer.jpg'), discount: null, category: 'lanches' },
    { id: '2', name: 'Suco de Laranja', weight: '300 ml.', price: 8.0, image: require('../../assets/sucolaranj.jpg'), discount: 10, category: 'bebidas' },
    { id: '3', name: 'Misto Quente', weight: '150 gm.', price: 9.5, image: require('../../assets/misto.jpg'), discount: null, category: 'lanches' },
    { id: '4', name: 'Café Coado', weight: '200 ml.', price: 4.0, image: require('../../assets/cafe.jpg'), discount: null, category: 'bebidas' },
];

const BELOW_20 = [
    { id: '5', name: 'Hambúrguer X', weight: '80 gm.', price: 5.0,image: require('../../assets/burguer2.jpg'), discount: null, category: 'lanches' },
    { id: '6', name: 'Água Mineral', weight: '500 ml.', price: 3.5, image: require('../../assets/agua.jpg'), discount: null, category: 'bebidas' },
    { id: '7', name: 'Brownie de Chocolate', weight: '90 gm.', price: 7.0, image: require('../../assets/brownie.jpg'), discount: 15, category: 'doces' },
    { id: '8', name: 'Refrigerante Lata', weight: '350 ml.', price: 6.0, image: require('../../assets/fanta.jpg'), discount: null, category: 'bebidas' },
];

const FLOORS = ['5º Andar', '7º Andar'];
const FILTER_CATEGORIES = ['Todos', 'Lanches', 'Bebidas', 'Refeições', 'Doces'];

// ─── CategoryCard ─────────────────────────────────────────────────────────────

function CategoryCard({ item }) {
    const [active, setActive] = useState(false);
    return (
        <TouchableOpacity
            style={[styles.categoryCard, active && styles.categoryCardActive]}
            activeOpacity={0.85}
            onPress={() => setActive(!active)}
        >
            <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
            <View style={styles.categoryOverlay} />
            <Text style={styles.categoryLabel}>{item.label}</Text>
        </TouchableOpacity>
    );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ item }) {
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
                <View style={styles.addBtn}>
                    <Ionicons name="add" size={20} color="#fff" />
                </View>
            </View>
        </View>
    );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.seeAllBtn}>
                <Text style={styles.seeAll}>Ver tudo</Text>
                <Ionicons name="chevron-forward" size={14} color={PINK} />
            </TouchableOpacity>
        </View>
    );
}

// ─── FilterModal ──────────────────────────────────────────────────────────────

function FilterModal({ visible, onClose, selectedCategory, onSelectCategory, selectedPrice, onSelectPrice }) {
    const prices = ['Todos', 'Até R$5', 'Até R$10', 'Acima de R$10'];

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtros</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={WHITE} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.filterSectionLabel}>Categoria</Text>
                    <View style={styles.filterOptions}>
                        {FILTER_CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                                onPress={() => onSelectCategory(cat)}
                            >
                                <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.filterSectionLabel}>Faixa de preço</Text>
                    <View style={styles.filterOptions}>
                        {prices.map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.filterChip, selectedPrice === p && styles.filterChipActive]}
                                onPress={() => onSelectPrice(p)}
                            >
                                <Text style={[styles.filterChipText, selectedPrice === p && styles.filterChipTextActive]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
                        <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
                        <Ionicons name="checkmark" size={16} color={WHITE} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const [floorIndex, setFloorIndex] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedPrice, setSelectedPrice] = useState('Todos');

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            <FilterModal
                visible={showFilter}
                onClose={() => setShowFilter(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedPrice={selectedPrice}
                onSelectPrice={setSelectedPrice}
            />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerLogoText}>FIAP</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notifBtn}>
                            <Ionicons name="notifications-outline" size={20} color={WHITE} />
                            <View style={styles.notifDot} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Greeting */}
                <View style={styles.greetingWrap}>
                    <Text style={styles.greetingSub}>Bom dia,</Text>
                    <Text style={styles.greetingTitle}>Vitor</Text>
                    <View style={styles.greetingUnderline} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <View style={styles.searchLeft}>
                        <Ionicons name="search-outline" size={18} color={MUTED} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar na cantina..."
                            placeholderTextColor={MUTED}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
                        <Ionicons name="options-outline" size={18} color={WHITE} />
                    </TouchableOpacity>
                </View>

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

                {/* Category Cards */}
                <View style={styles.categorySectionHeader}>
                    <View style={styles.sectionTitleWrap}>
                        <View style={styles.sectionAccent} />
                        <Text style={styles.sectionTitle}>Categorias</Text>
                    </View>
                </View>
                <FlatList
                    data={CATEGORIES_CARDS}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => <CategoryCard item={item} />}
                />

                {/* Section: Destaques */}
                <SectionHeader title="Destaques da cantina" />
                <FlatList
                    data={ALL_NEEDS}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsList}
                    renderItem={({ item }) => <ProductCard item={item} />}
                />

                {/* Section: Abaixo de R$10 */}
                <SectionHeader title="Tudo abaixo de R$10!" />
                <FlatList
                    data={BELOW_20}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsList}
                    renderItem={({ item }) => <ProductCard item={item} />}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PINK = '#ED145B';
const BG = '#1A1A1A';
const CARD = '#2A2A2A';
const WHITE = '#FFFFFF';
const BORDER = '#333333';
const MUTED = '#888888';

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG, paddingTop: StatusBar.currentHeight || 0 },
    container: { flex: 1, backgroundColor: BG },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 20, marginTop: 16, marginBottom: 24,
    },
    headerLogoText: { fontSize: 22, fontWeight: '900', color: PINK, letterSpacing: 3 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifBtn: {
        width: 40, height: 40, backgroundColor: CARD,
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: BORDER,
    },
    notifDot: {
        position: 'absolute', top: 9, right: 9,
        width: 8, height: 8, borderRadius: 4, backgroundColor: PINK,
        borderWidth: 1.5, borderColor: BG,
    },

    // Greeting
    greetingWrap: { marginHorizontal: 20, marginBottom: 24 },
    greetingSub: { fontSize: 16, color: MUTED, fontWeight: '400', marginBottom: 2 },
    greetingTitle: { fontSize: 36, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
    greetingUnderline: { marginTop: 8, width: 40, height: 3, backgroundColor: PINK, borderRadius: 2 },

    // Search
    searchBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: CARD, marginHorizontal: 20, marginBottom: 16,
        borderRadius: 16, paddingLeft: 18, paddingRight: 6, paddingVertical: 6,
        borderWidth: 1, borderColor: BORDER,
    },
    searchLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    searchInput: { flex: 1, color: WHITE, fontSize: 14, paddingVertical: 8 },
    filterBtn: {
        backgroundColor: PINK, borderRadius: 12,
        padding: 10, alignItems: 'center', justifyContent: 'center',
    },

    // Location
    locationBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginHorizontal: 20, marginBottom: 24, backgroundColor: CARD,
        borderRadius: 16, padding: 14, borderWidth: 1, borderColor: BORDER,
    },
    locationLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    locIconWrap: {
        width: 38, height: 38, backgroundColor: '#2D1120',
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    },
    locationLabel: { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 2 },
    locationCity: { fontSize: 14, fontWeight: '700', color: WHITE },
    floorToggle: {
        flexDirection: 'row', backgroundColor: '#1A1A1A',
        borderRadius: 12, padding: 3, gap: 3,
        borderWidth: 1, borderColor: BORDER,
    },
    floorBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
    floorBtnActive: { backgroundColor: PINK },
    floorBtnText: { fontSize: 12, fontWeight: '600', color: MUTED },
    floorBtnTextActive: { color: WHITE },

    // Category Cards
    categorySectionHeader: {
        paddingHorizontal: 20, marginBottom: 14,
    },
    categoryList: { paddingHorizontal: 20, gap: 12, paddingBottom: 24 },
    categoryCard: {
        width: 110, height: 110, borderRadius: 20, overflow: 'hidden',
        borderWidth: 1, borderColor: BORDER, position: 'relative',
    },
    categoryCardActive: { borderColor: PINK, borderWidth: 2 },
    categoryImage: { width: '100%', height: '100%', position: 'absolute' },
    categoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.38)',
    },
    categoryLabel: {
        position: 'absolute', bottom: 10, left: 10, right: 10,
        color: WHITE, fontSize: 13, fontWeight: '800',
        textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, marginBottom: 14,
    },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sectionAccent: { width: 4, height: 18, backgroundColor: PINK, borderRadius: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: WHITE },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    seeAll: { fontSize: 13, color: PINK, fontWeight: '600' },

    // Product Cards
    productsList: { paddingHorizontal: 20, gap: 14, paddingBottom: 28 },
    productCard: {
        width: 158, backgroundColor: CARD, borderRadius: 18, padding: 14,
        borderWidth: 1, borderColor: BORDER, position: 'relative',
    },
    discountBadge: {
        position: 'absolute', top: 12, left: 12,
        backgroundColor: PINK, borderRadius: 20,
        paddingHorizontal: 8, paddingVertical: 4, zIndex: 1,
    },
    discountText: { color: WHITE, fontSize: 10, fontWeight: '800' },
    productIconWrap: {
        width: '100%', height: 100, borderRadius: 12, overflow: 'hidden',
        marginBottom: 12, borderWidth: 1, borderColor: '#3A1020',
    },
    productImage: { width: '100%', height: '100%' },
    productName: { fontSize: 13, fontWeight: '700', color: WHITE, marginBottom: 4, lineHeight: 18 },
    productWeight: { fontSize: 11, color: MUTED, marginBottom: 12, fontWeight: '500' },
    productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    productPrice: { fontSize: 16, fontWeight: '800', color: WHITE },
    addBtn: {
        width: 34, height: 34, backgroundColor: PINK,
        borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    },

    // Filter Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalSheet: {
        backgroundColor: '#1E1E1E', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 24, borderWidth: 1, borderColor: BORDER, borderBottomWidth: 0,
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: '900', color: WHITE },
    filterSectionLabel: {
        fontSize: 13, fontWeight: '700', color: MUTED,
        letterSpacing: 0.8, marginBottom: 12, textTransform: 'uppercase',
    },
    filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    filterChip: {
        paddingHorizontal: 16, paddingVertical: 9,
        borderRadius: 20, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD,
    },
    filterChipActive: { backgroundColor: PINK, borderColor: PINK },
    filterChipText: { fontSize: 13, fontWeight: '600', color: MUTED },
    filterChipTextActive: { color: WHITE },
    applyBtn: {
        backgroundColor: PINK, borderRadius: 16,
        paddingVertical: 16, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
    },
    applyBtnText: { color: WHITE, fontSize: 15, fontWeight: '800' },
});