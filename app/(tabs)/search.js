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
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_PRODUCTS = [
    { id: '1', name: 'Coxinha de Frango', weight: '120 gm.', price: 6.0, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&q=80', category: 'Lanches', discount: null },
    { id: '2', name: 'Suco de Laranja', weight: '300 ml.', price: 8.0, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=80', category: 'Bebidas', discount: 10 },
    { id: '3', name: 'Misto Quente', weight: '150 gm.', price: 9.5, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&q=80', category: 'Lanches', discount: null },
    { id: '4', name: 'Café Coado', weight: '200 ml.', price: 4.0, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80', category: 'Bebidas', discount: null },
    { id: '5', name: 'Pão de Queijo', weight: '80 gm.', price: 5.0, image: 'https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?w=200&q=80', category: 'Lanches', discount: null },
    { id: '6', name: 'Água Mineral', weight: '500 ml.', price: 3.5, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80', category: 'Bebidas', discount: null },
    { id: '7', name: 'Brownie de Chocolate', weight: '90 gm.', price: 7.0, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&q=80', category: 'Doces', discount: 15 },
    { id: '8', name: 'Refrigerante Lata', weight: '350 ml.', price: 6.0, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80', category: 'Bebidas', discount: null },
    { id: '9', name: 'Esfiha de Carne', weight: '100 gm.', price: 5.5, image: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=200&q=80', category: 'Lanches', discount: null },
    { id: '10', name: 'Vitamina de Banana', weight: '300 ml.', price: 9.0, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&q=80', category: 'Bebidas', discount: null },
    { id: '11', name: 'Wrap de Frango', weight: '200 gm.', price: 14.0, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&q=80', category: 'Refeições', discount: null },
    { id: '12', name: 'Bolo de Cenoura', weight: '100 gm.', price: 6.5, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=200&q=80', category: 'Doces', discount: null },
];

const CATEGORIES = ['Todos', 'Lanches', 'Bebidas', 'Refeições', 'Doces'];

const RECENT_SEARCHES = ['Coxinha', 'Café', 'Suco'];

// ─── ProductRow ───────────────────────────────────────────────────────────────


// ─── SearchScreen ─────────────────────────────────────────────────────────────

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [isFocused, setIsFocused] = useState(false);

    const filtered = ALL_PRODUCTS.filter(p => {
        const matchesText = searchText === '' || p.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
        return matchesText && matchesCategory;
    });

    const showEmpty = searchText !== '' && filtered.length === 0;
    const showRecent = searchText === '' && !isFocused === false;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={BG} />

            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Buscar</Text>
                </View>

                {/* Search Input */}
                <View style={styles.searchWrap}>
                    <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
                        <Ionicons name="search-outline" size={18} color={isFocused ? PINK : MUTED} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="O que você quer hoje?"
                            placeholderTextColor={MUTED}
                            value={searchText}
                            onChangeText={setSearchText}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            autoCorrect={false}
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')}>
                                <Ionicons name="close-circle" size={18} color={MUTED} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Category Chips */}
                <View style={styles.chipsWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsList}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.chip, activeCategory === cat && styles.chipActive]}
                                onPress={() => setActiveCategory(cat)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Searches — shown when input is empty */}
                {searchText === '' && (
                    <View style={styles.recentWrap}>
                        <Text style={styles.recentTitle}>Buscas recentes</Text>
                        <View style={styles.recentList}>
                            {RECENT_SEARCHES.map(term => (
                                <TouchableOpacity
                                    key={term}
                                    style={styles.recentChip}
                                    onPress={() => setSearchText(term)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="time-outline" size={13} color={MUTED} />
                                    <Text style={styles.recentChipText}>{term}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Results count */}
                {searchText !== '' && !showEmpty && (
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsCount}>
                            <Text style={{ color: PINK }}>{filtered.length}</Text> resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}

                {/* Empty State */}
                {showEmpty && (
                    <View style={styles.emptyWrap}>
                        <Ionicons name="search-outline" size={52} color="#333" />
                        <Text style={styles.emptyTitle}>Nenhum resultado</Text>
                        <Text style={styles.emptyText}>Tente buscar por outro nome ou categoria</Text>
                    </View>
                )}

                {/* Results List */}
                {!showEmpty && (
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.resultsList}
                        renderItem={({ item }) => <ProductRow item={item} />}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}
            </View>
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
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28, fontWeight: '900', color: WHITE, letterSpacing: -0.5,
    },

    // Search
    searchWrap: { paddingHorizontal: 20, marginBottom: 16 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: CARD, borderRadius: 30,
        paddingHorizontal: 16, paddingVertical: 4,
        borderWidth: 1, borderColor: BORDER,
    },
    searchBarFocused: { borderColor: PINK },
    searchInput: { flex: 1, color: WHITE, fontSize: 15 },

    // Category chips
    chipsWrap: { marginBottom: 20 },
    chipsList: { paddingHorizontal: 20, gap: 10 },
    chip: {
        paddingHorizontal: 18, paddingVertical: 9,
        borderRadius: 20, borderWidth: 1, borderColor: BORDER,
        backgroundColor: CARD,
    },
    chipActive: { backgroundColor: PINK, borderColor: PINK },
    chipText: { fontSize: 13, fontWeight: '600', color: MUTED },
    chipTextActive: { color: WHITE },

    // Recent
    recentWrap: { paddingHorizontal: 20, marginBottom: 20 },
    recentTitle: { fontSize: 13, fontWeight: '700', color: MUTED, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 },
    recentList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    recentChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: CARD, borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 8,
        borderWidth: 1, borderColor: BORDER,
    },
    recentChipText: { fontSize: 13, color: WHITE, fontWeight: '500' },

    // Results
    resultsHeader: { paddingHorizontal: 20, marginBottom: 14 },
    resultsCount: { fontSize: 13, color: MUTED, fontWeight: '500' },

    resultsList: { paddingHorizontal: 20, paddingBottom: 110 },
    separator: { height: 1, backgroundColor: BORDER, marginVertical: 4 },

    // Product Row
    productRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingVertical: 12,
    },
    rowImage: {
        width: 80, height: 80, borderRadius: 14,
        borderWidth: 1, borderColor: BORDER,
    },
    rowInfo: { flex: 1 },
    rowTopLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    rowCategory: { fontSize: 11, color: PINK, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    discountBadge: {
        backgroundColor: '#2D1120', borderRadius: 10,
        paddingHorizontal: 7, paddingVertical: 2,
        borderWidth: 1, borderColor: '#4A1A30',
    },
    discountText: { color: PINK, fontSize: 10, fontWeight: '800' },
    rowName: { fontSize: 15, fontWeight: '700', color: WHITE, marginBottom: 2 },
    rowWeight: { fontSize: 11, color: MUTED, marginBottom: 8 },
    rowFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rowPrice: { fontSize: 16, fontWeight: '900', color: WHITE },
    addBtn: {
        width: 32, height: 32, backgroundColor: PINK,
        borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    },
    addBtnDone: { backgroundColor: '#1E7A45' },

    // Empty
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: WHITE },
    emptyText: { fontSize: 13, color: MUTED, textAlign: 'center' },
});