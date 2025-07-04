import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator , BackHandler,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getQuestionsFromAPI } from '../config/questions'; 

const Questions = ({ navigation, route }) => {
  const { selectedCategory } = route.params;

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(true);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const handleNext = useCallback(() => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    if (!selectedOption) {
      setResults(prev => [
        ...prev,
        {
          question: currentQuestion.question,
          selected: null,
          correct: currentQuestion.correctAnswer,
          isCorrect: false,
        },
      ]);
    }

    if (currentQuestionIndex === shuffledQuestions.length - 1) {
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Score',
            params: { score, results, selectedCategory, timeTaken: totalTimeInSeconds },
          }],
        });
      }, 600);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(60);
        setTimerRunning(true);
      }, 600);
    }
  }, [currentQuestionIndex, shuffledQuestions, navigation, score, results, selectedCategory, selectedOption]);
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit Quiz',
        'Do you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              // navigate back
              navigation.goBack();
            },
          },
        ],
        { cancelable: true }
      );

      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const questions = await getQuestionsFromAPI(selectedCategory);

      const shuffled = questions
        .sort(() => 0.5 - Math.random())
        .slice(0, 15)
        .map(q => ({
          ...q,
          options: [...q.options].sort(() => 0.5 - Math.random()),
        }));

      setShuffledQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsCorrect(null);
      setResults([]);
      setTimeLeft(60);
      setTimerRunning(true);
      setLoading(false);
    };

    fetchQuestions();
  }, [selectedCategory]);

  useEffect(() => {
    let timer;

    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalTimeInSeconds(prev => prev + 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      handleNext();
    }

    return () => clearInterval(timer);
  }, [timeLeft, timerRunning]);

  const handleOptionPress = (pressedOption) => {
    setSelectedOption(pressedOption);
    setTimerRunning(false);

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isAnswerCorrect = currentQuestion.correctAnswer === pressedOption;
    setIsCorrect(isAnswerCorrect);

    setResults(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: pressedOption,
        correct: currentQuestion.correctAnswer,
        isCorrect: isAnswerCorrect,
      },
    ]);

    if (isAnswerCorrect) {
      setScore(prev => prev + 10);
    }
  };

  if (loading) {
    return (
      <View style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#fff' }}>
          Generating questions for "{selectedCategory}"
        </Text>
      </View>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <View style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#E74C3C', textAlign: 'center' }}>
          No questions could be generated for "{selectedCategory}". Try another topic.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
{shuffledQuestions[currentQuestionIndex] && (
  <>
    <Text style={styles.questionCounter}>
      Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
    </Text>

    <Text style={styles.questionText}>
      {shuffledQuestions[currentQuestionIndex].question}
    </Text>
  </>
)}



      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={70}
          width={8}
          fill={(timeLeft / 60) * 100}
          tintColor="#2E86C1"
          backgroundColor="#85C1E9"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={styles.timerText}>{timeLeft}</Text>
          )}
        </AnimatedCircularProgress>
      </View>
{shuffledQuestions[currentQuestionIndex] &&
  shuffledQuestions[currentQuestionIndex].options.map((option, index) => {
    const isSelected = selectedOption === option;
    let optionStyle = [styles.option];
    if (isSelected) {
      optionStyle.push(isCorrect ? styles.correctOption : styles.wrongOption);
    }

    return (
      <Pressable
        key={index}
        style={optionStyle}
        onPress={() => handleOptionPress(option)}
        disabled={!!selectedOption}
      >
        <Text style={styles.optionText}>{option}</Text>
      </Pressable>
    );
  })}
      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish' : 'Next'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ADCBE3',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  questionText: {
    fontSize: 22,
    color: 'white',
    backgroundColor: '#2E86C1',
    textAlign: 'center',
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    minHeight: 160,
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  option: {
    borderWidth: 2,
    borderColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    color: '#2E86C1',
    fontWeight: '600',
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: '#A9DFBF',
    borderColor: '#27AE60',
  },
  wrongOption: {
    backgroundColor: '#F5B7B1',
    borderColor: '#E74C3C',
  },
  nextButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  questionCounter: {
  fontSize: 18,
  fontWeight: '600',
  color: '#154360',
  marginBottom: 10,
  textAlign: 'center',
},
});

export default Questions;
