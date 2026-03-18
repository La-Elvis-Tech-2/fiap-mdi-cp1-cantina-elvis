import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

const PINK = '#ED145B';

function CustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const icons = {
                        index: 'leaf',
                        search: 'search',
                        purchases: 'bag-outline',
                    };

                    const labels = {
                        index: 'Explore',
                        search: 'Search',
                        purchases: 'Purchases',
                    };

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.pill, isFocused && styles.pillActive]}>
                                <Ionicons
                                    name={icons[route.name]}
                                    size={22}
                                    color={isFocused ? PINK : '#555'}
                                />
                                <Text style={[styles.label, isFocused && styles.labelActive]}>
                                    {labels[route.name]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="search" />
            <Tabs.Screen name="purchases" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 24 : 30,
        left: 70,
        right: 70,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#222222',
        borderRadius: 30,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pill: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
        borderRadius: 30,
        gap: 3,
        minWidth: 80,
    },
    pillActive: {
        backgroundColor: '#2D1120',
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: '#4A1A30',
        borderRadius: 30,
        gap: 3,
        minWidth: 90,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#555',
    },
    labelActive: {
        color: PINK,
        fontWeight: '600',
    },
});