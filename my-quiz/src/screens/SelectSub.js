import { useState, useEffect } from 'react';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { generateTopics } from '../config/gemini'; 

const subjects = [
  { name: "FRONTEND", icon: "language-html5" },
  { name: "BACKEND", icon: "server" },
  { name: "CYBER SECURITY", icon: "shield-lock" },
  { name: "ARTIFICIAL INTELLIGENCE", icon: "robot" },
  { name: "DEVOPS", icon: "docker" },
  { name: "DATABASES", icon: "database" },
  { name: "PROGRAMMING FUNDAMENTALS", icon: "code-tags" },
  { name: "MOBILE DEVELOPMENT", icon: "cellphone" },
  { name: "BLOCKCHAIN", icon: "link-variant" },
  { name: "OPERATING SYSTEMS", icon: "laptop" },
  { name: "COMPUTER NETWORKS", icon: "access-point-network" },
  { name: "VERSION CONTROL", icon: "git" },
  { name: "TESTING", icon: "bug-outline" },
  { name: "DATA STRUCTURES", icon: "shape-outline" },
  { name: "ALGORITHMS", icon: "function-variant" }
];

const SubjectCard = ({ subject, onPress }) => (
  <Pressable onPress={onPress}>
    <View style={styles.card}>
      <Icon name={subject.icon} size={40} color="#2E86C1" style={styles.icon} />
      <Text style={styles.text}>{subject.name}</Text>
    </View>
  </Pressable>
);

const SelectSub = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [aiTopics, setAiTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchAiTopics = async () => {
      if (search.trim() === '') {
        setAiTopics([]);
        return;
      }

      if (filteredSubjects.length > 0) {
        setAiTopics([]);
        return;
      }

      try {
        setLoading(true);
        const topics = await generateTopics(search); 
        setAiTopics(topics.map(topic => ({ name: topic, icon: "star" }))); 
      } catch (e) {
        console.error('Error generating topics:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAiTopics();
  }, [search]);

  return (
    <View style={styles.page}>
      <Text style={styles.select}>Select Topic</Text>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#2E86C1" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search topic..."
          placeholderTextColor="#2E86C1"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading && (
          <Text style={{ color: "#2E86C1", textAlign: "center", marginVertical: 10 }}>Loading AI topics...</Text>
        )}

        {(filteredSubjects.length > 0 ? filteredSubjects : aiTopics).map((subject, index) => (
          <SubjectCard
            key={index}
            subject={subject}
            onPress={() => navigation.navigate('TopicScreen', { category: subject.name })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ADCBE3',
    paddingTop: 60,
  },
  select: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  }, 
  container: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  text: {
    color: '#2E86C1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginBottom: 5,
  },
});

export default SelectSub;