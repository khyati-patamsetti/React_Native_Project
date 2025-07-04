import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GEMINI_API_KEY_1 } from '@env';

const Review = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { results = [] } = route.params || {};

  const [explanations, setExplanations] = useState({});
  const [visibleExplanations, setVisibleExplanations] = useState({}); 

  useEffect(() => {
    const fetchExplanations = async () => {
      try {
        const newExplanations = {};

        for (let i = 0; i < results.length; i++) {
          const question = results[i].question;
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY_1}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `Explain this question in 2-3 concise lines:\n\n${question}`,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          const data = await resp.json();
          const explanation =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'No explanation available.';
          newExplanations[i] = explanation.trim();
        }

        setExplanations(newExplanations);
      } catch (error) {
        console.error('Error fetching explanations:', error);
      }
    };
    fetchExplanations();
  }, [results]);

  const toggleExplanation = index => {
    setVisibleExplanations(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Review Answers</Text>

      {results.map((item, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.questionText}>{index + 1}. {item.question}</Text>

          <Text
            style={[
              styles.answerText,
              item.isCorrect ? styles.correct : styles.wrong,
            ]}
          >
            Your Answer:{' '}
            <Text style={styles.answerPill}>{item.selected || 'Not Answered'}</Text>
          </Text>

          {!item.isCorrect && (
            <Text style={styles.correctAnswerText}>
              Correct Answer:{' '}
              <Text style={styles.correctPill}>{item.correct}</Text>
            </Text>
          )}
          <Pressable
            style={styles.explanationButton}
            onPress={() => toggleExplanation(index)}
          >
            <Text style={styles.explanationButtonText}>
              {visibleExplanations[index] ? 'Hide Explanation' : 'View Explanation'}
            </Text>
          </Pressable>

          {visibleExplanations[index] && (
            <Text style={styles.explanationText}>
              {explanations[index] || 'Loading explanation...'}
            </Text>
          )}
        </View>
      ))}

      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADCBE3',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1e3a8a',
  },
  questionBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#93c5fd',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1e40af',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answerPill: {
    color: '#92400e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 14,
  },
  correctAnswerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
  },
  correctPill: {
    color: '#065f46',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 14,
  },
  explanationButton: {
    marginTop: 10,
    backgroundColor: '#2E86C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  explanationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  explanationText: {
    marginTop: 8,
    fontSize: 15,
    color: '#34495E',
  },
  correct: { color: '#065f46' },
  wrong: { color: '#b91c1c' },
  button: {
    marginTop: 30,
    backgroundColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignSelf: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Review;
