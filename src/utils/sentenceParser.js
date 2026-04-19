/**
 * Sentence parsing utilities for the sentence building quiz type.
 * Handles Arabic text normalization, word shuffling, and distractor generation.
 */

import { shuffle } from './shuffle.js';

/**
 * Normalizes Arabic text by removing diacritics (tashkeel)
 * @param {string} text - Arabic text with or without diacritics
 * @returns {string} Text without diacritics
 */
export function removeDiacritics(text) {
  if (!text) return '';
  // Remove Arabic diacritics: basic tashkeel, Quranic annotations, kashida, combining marks
  // eslint-disable-next-line no-misleading-character-class
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0640\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g, '').trim();
}

/**
 * Splits an Arabic sentence into word tokens
 * Handles Arabic punctuation and whitespace
 * @param {string} sentence - Arabic sentence
 * @returns {string[]} Array of word tokens
 */
export function splitSentence(sentence) {
  if (!sentence) return [];

  // Remove Arabic punctuation marks but keep the words
  const cleaned = sentence.replace(/[،؛؟]/g, '');

  // Split on whitespace and filter out empty strings
  return cleaned.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Generates distractor words for sentence building quiz
 * Selects words from the same category and similar difficulty
 * @param {object} targetWord - The target vocabulary word
 * @param {object[]} vocabularyPool - Full vocabulary array
 * @param {number} count - Number of distractors to generate (default 2-3)
 * @returns {string[]} Array of Arabic distractor words
 */
export function generateDistractors(targetWord, vocabularyPool, count = 3) {
  if (!targetWord || !vocabularyPool) return [];

  // Filter candidates: same category, similar difficulty, not the target word
  let candidates = vocabularyPool.filter(w =>
    w.id !== targetWord.id &&
    w.category === targetWord.category &&
    Math.abs((w.difficulty || 1) - (targetWord.difficulty || 1)) <= 1 &&
    w.arabic && w.arabic.length > 0
  );

  // If not enough candidates in same category, expand to all categories
  if (candidates.length < count) {
    candidates = vocabularyPool.filter(w =>
      w.id !== targetWord.id &&
      w.arabic && w.arabic.length > 0
    );
  }

  // Shuffle and take the required count
  const shuffled = shuffle(candidates);
  return shuffled.slice(0, count).map(w => w.arabic);
}

/**
 * Validates if the user's word arrangement matches the correct sentence
 * Uses normalization to ignore diacritics
 * @param {string[]} userWords - Array of words in user's order
 * @param {string[]} correctWords - Array of words in correct order
 * @returns {boolean} True if the arrangement is correct
 */
export function validateSentence(userWords, correctWords) {
  if (!userWords || !correctWords) return false;
  if (userWords.length !== correctWords.length) return false;

  // Normalize both arrays and compare word by word
  for (let i = 0; i < userWords.length; i++) {
    const userNormalized = removeDiacritics(userWords[i]);
    const correctNormalized = removeDiacritics(correctWords[i]);

    if (userNormalized !== correctNormalized) {
      return false;
    }
  }

  return true;
}

/**
 * Finds the target word within a sentence
 * Returns the index of the word in the sentence
 * @param {string} targetWord - The vocabulary word to find
 * @param {string[]} sentenceWords - Array of words from the sentence
 * @returns {number} Index of the target word, or -1 if not found
 */
export function findTargetWordIndex(targetWord, sentenceWords) {
  if (!targetWord || !sentenceWords) return -1;

  const normalizedTarget = removeDiacritics(targetWord);

  for (let i = 0; i < sentenceWords.length; i++) {
    const normalizedWord = removeDiacritics(sentenceWords[i]);
    if (normalizedWord === normalizedTarget) {
      return i;
    }
  }

  return -1;
}

/**
 * Prepares sentence data for the quiz
 * @param {object} word - Vocabulary word with exampleSentence
 * @param {object[]} vocabularyPool - Full vocabulary array
 * @returns {object} Quiz data with words, distractors, target info
 */
export function prepareSentenceQuiz(word, vocabularyPool) {
  if (!word || !word.exampleSentence || !word.exampleSentence.arabic) {
    return null;
  }

  const sentenceWords = splitSentence(word.exampleSentence.arabic);
  const distractors = generateDistractors(word, vocabularyPool, 3);
  const targetIndex = findTargetWordIndex(word.arabic, sentenceWords);

  // Combine correct words with distractors and shuffle
  const allWords = shuffle([...sentenceWords, ...distractors]);

  return {
    correctWords: sentenceWords,
    allWords: allWords,
    englishSentence: word.exampleSentence.english,
    transliteration: word.exampleSentence.transliteration || null,
    targetWord: word.arabic,
    targetWordEnglish: word.english,
    targetIndex: targetIndex,
  };
}
