import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { HYMNS } from '@/data/hymns';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const categories = [...new Set(HYMNS.map((hymn) => hymn.category))].slice(0, 6);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return HYMNS.slice(0, 4);
    return HYMNS.filter((hymn) => `${hymn.number} ${hymn.title} ${hymn.alternateTitle ?? ''}`.toLowerCase().includes(normalized)).slice(0, 4);
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}><View style={styles.logo}><ThemedText style={styles.logoText}>R</ThemedText></View><View><ThemedText style={styles.eyebrow}>REHOBOTH ASSEMBLY</ThemedText><ThemedText type="title">Efik Hymn Book</ThemedText></View></View>
        <View style={styles.hero}><ThemedText style={styles.heroKicker}>A living treasury of praise</ThemedText><ThemedText type="title" style={styles.heroTitle}>Sing in the language of home.</ThemedText><ThemedText style={styles.heroCopy}>Find your hymn, read every verse, and carry the words with you.</ThemedText><TextInput value={query} onChangeText={setQuery} placeholder="Search by number or title" placeholderTextColor="#718096" style={styles.search} /></View>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{query ? 'Search results' : 'Featured hymns'}</ThemedText>
        <View style={styles.list}>{results.map((hymn) => <HymnCard key={hymn.id} hymn={hymn} />)}</View>
        {!query && <><View style={styles.sectionHeader}><ThemedText type="subtitle">Browse by mood</ThemedText><Pressable onPress={() => router.push('/explore')}><ThemedText type="linkPrimary">See all</ThemedText></Pressable></View><View style={styles.chips}>{categories.map((category) => <Pressable key={category} onPress={() => router.push({ pathname: '/explore', params: { category } })} style={styles.chip}><ThemedText style={styles.chipText}>{category}</ThemedText></Pressable>)}</View></>}
        <Pressable onPress={() => router.push('/explore')} style={styles.browseButton}><ThemedText style={styles.browseText}>Browse all hymns</ThemedText><ThemedText style={styles.arrow}>-&gt;</ThemedText></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function HymnCard({ hymn }: { hymn: (typeof HYMNS)[number] }) {
  return <Pressable onPress={() => router.push({ pathname: '/hymn/[id]', params: { id: hymn.id } })} style={({ pressed }) => [styles.card, pressed && styles.pressed]}><View style={styles.number}><ThemedText style={styles.numberText}>{String(hymn.number).padStart(2, '0')}</ThemedText></View><View style={styles.cardCopy}><ThemedText type="subtitle">{hymn.title}</ThemedText><ThemedText themeColor="textSecondary" numberOfLines={1}>{hymn.alternateTitle ?? hymn.category}</ThemedText></View><ThemedText themeColor="textSecondary">-&gt;</ThemedText></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background }, content: { padding: Spacing.four, paddingBottom: 110, gap: Spacing.three, maxWidth: 760, width: '100%', alignSelf: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three }, logo: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#fff', fontSize: 24, fontWeight: '800' }, eyebrow: { color: Colors.light.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, hero: { backgroundColor: Colors.light.primary, borderRadius: 24, padding: Spacing.four, gap: Spacing.two }, heroKicker: { color: '#d9e7ff', fontWeight: '700' }, heroTitle: { color: '#fff', fontSize: 34, lineHeight: 39 }, heroCopy: { color: '#d9e7ff' }, search: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.light.text, marginTop: Spacing.two }, sectionTitle: { marginTop: Spacing.two }, list: { gap: Spacing.two }, card: { flexDirection: 'row', alignItems: 'center', padding: Spacing.three, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e1e6ee', borderRadius: 16, gap: Spacing.three }, pressed: { opacity: 0.7 }, number: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.light.backgroundElement, alignItems: 'center', justifyContent: 'center' }, numberText: { color: Colors.light.primary, fontWeight: '800' }, cardCopy: { flex: 1, gap: 4 }, sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.two }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }, chip: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#e8eef9' }, chipText: { color: Colors.light.primary, fontWeight: '700' }, browseButton: { backgroundColor: Colors.light.gold, padding: Spacing.three, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.two }, browseText: { color: Colors.light.onGold, fontWeight: '800' }, arrow: { color: Colors.light.onGold, fontWeight: '800' },
});