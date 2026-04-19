/**
 * AriaLabels.test.jsx
 * Phase 75 — Task 1: ARIA Labels Audit
 * Verifies that all quiz components have proper ARIA attributes.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock useFormatArabic to return identity function with renderArabic
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => {
    const fn = (s) => s;
    fn.renderArabic = (s) => s;
    fn.getTashkeelOpacity = () => 1.0;
    return fn;
  },
}));

// Mock audio manager
vi.mock('../../../services/audio.js', () => ({
  audioManager: { playWord: vi.fn() },
}));

import ArabicToEnglish from '../ArabicToEnglish.jsx';
import EnglishToArabic from '../EnglishToArabic.jsx';
import ListenAndChoose from '../ListenAndChoose.jsx';
import FillInBlank from '../FillInBlank.jsx';
import RootIdentifier from '../RootIdentifier.jsx';
import ConjugationPick from '../ConjugationPick.jsx';
import GrammarFill from '../GrammarFill.jsx';
import PictureWord from '../PictureWord.jsx';
import ClozePassage from '../ClozePassage.jsx';
import ProgressBar from '../ProgressBar.jsx';

const mockWord = {
  id: 'w1',
  arabic: 'كِتَاب',
  english: 'book',
  transliteration: 'kitaab',
  category: 'objects',
};

const mockChoices = [
  { label: 'book', value: 'book', correct: true },
  { label: 'pen', value: 'pen', correct: false },
  { label: 'desk', value: 'desk', correct: false },
  { label: 'chair', value: 'chair', correct: false },
];

const mockArabicChoices = [
  { label: 'كِتَاب', value: 'كِتَاب', correct: true },
  { label: 'قَلَم', value: 'قَلَم', correct: false },
  { label: 'مَكْتَب', value: 'مَكْتَب', correct: false },
  { label: 'كُرْسِي', value: 'كُرْسِي', correct: false },
];

describe('Quiz ARIA Labels Audit', () => {
  describe('ArabicToEnglish', () => {
    it('has role="group" with descriptive aria-label', () => {
      render(<ArabicToEnglish word={mockWord} choices={mockChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Arabic to English.*kitaab/i });
      expect(group).toBeInTheDocument();
    });

    it('has aria-label on each choice button', () => {
      render(<ArabicToEnglish word={mockWord} choices={mockChoices} feedback={null} onAnswer={vi.fn()} />);
      expect(screen.getByRole('button', { name: /Choice 1: book/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Choice 2: pen/i })).toBeInTheDocument();
    });

    it('marks correct/incorrect in aria-labels after feedback', () => {
      const feedback = { correct: false, selected: 'pen', correctAnswer: 'book' };
      render(<ArabicToEnglish word={mockWord} choices={mockChoices} feedback={feedback} onAnswer={vi.fn()} />);
      expect(screen.getByRole('button', { name: /book.*correct answer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pen.*incorrect/i })).toBeInTheDocument();
    });
  });

  describe('EnglishToArabic', () => {
    it('has role="group" with descriptive aria-label', () => {
      render(<EnglishToArabic word={mockWord} choices={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /English to Arabic.*book/i });
      expect(group).toBeInTheDocument();
    });

    it('has answer choices group', () => {
      render(<EnglishToArabic word={mockWord} choices={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      expect(screen.getByRole('group', { name: /Answer choices/i })).toBeInTheDocument();
    });
  });

  describe('ListenAndChoose', () => {
    it('has play audio button with aria-label', () => {
      render(<ListenAndChoose word={mockWord} choices={mockChoices} feedback={null} onAnswer={vi.fn()} />);
      expect(screen.getByRole('button', { name: /Play audio pronunciation/i })).toBeInTheDocument();
    });
  });

  describe('FillInBlank', () => {
    it('has role="group" with descriptive aria-label', () => {
      const wordWithSentence = { ...mockWord, exampleSentence: { arabic: 'أنا أقرأ كِتَاب', english: 'I am reading a book' } };
      render(<FillInBlank word={wordWithSentence} options={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Fill in the blank.*book/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe('RootIdentifier', () => {
    it('has role="group" with descriptive aria-label including transliteration', () => {
      render(<RootIdentifier word={mockWord} options={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Root identifier.*kitaab.*book/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe('ConjugationPick', () => {
    const conjOptions = [
      { label: 'أكتب', value: 'أكتب', correct: true, pronoun: { en: 'I (أنا)', ar: 'أنا' } },
      { label: 'يكتب', value: 'يكتب', correct: false },
      { label: 'تكتب', value: 'تكتب', correct: false },
      { label: 'نكتب', value: 'نكتب', correct: false },
    ];

    it('has role="group" with descriptive aria-label', () => {
      render(<ConjugationPick word={mockWord} options={conjOptions} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Conjugation.*book/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe('GrammarFill', () => {
    const grammarOptions = [
      { label: 'أكتب', value: 'أكتب', correct: true, paradigmContext: { verb: 'كَتَبَ', root: 'ك-ت-ب', meaning: 'to write', paradigm: 'present', pronoun: { en: 'I (أنا)', ar: 'أنا' } } },
      { label: 'يكتب', value: 'يكتب', correct: false, paradigmContext: null },
      { label: 'تكتب', value: 'تكتب', correct: false, paradigmContext: null },
      { label: 'نكتب', value: 'نكتب', correct: false, paradigmContext: null },
    ];

    it('has role="group" with descriptive aria-label', () => {
      render(<GrammarFill word={mockWord} options={grammarOptions} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Grammar fill.*to write.*present/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe('PictureWord', () => {
    it('has role="group" with descriptive aria-label', () => {
      render(<PictureWord word={mockWord} options={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Picture word.*book.*objects/i });
      expect(group).toBeInTheDocument();
    });

    it('has category icon hidden from screen readers', () => {
      const { container } = render(<PictureWord word={mockWord} options={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const iconEl = container.querySelector('[aria-hidden="true"]');
      expect(iconEl).toBeInTheDocument();
    });
  });

  describe('ClozePassage', () => {
    it('has role="group" with descriptive aria-label', () => {
      const wordWithSentence = { ...mockWord, exampleSentence: { arabic: 'هذا كِتَاب جيد', english: 'This is a good book' } };
      render(<ClozePassage word={wordWithSentence} options={mockArabicChoices} feedback={null} onAnswer={vi.fn()} />);
      const group = screen.getByRole('group', { name: /Cloze passage.*book/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe('ProgressBar', () => {
    it('has progressbar role with correct values', () => {
      render(<ProgressBar current={3} total={10} />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toBeInTheDocument();
      expect(progressbar).toHaveAttribute('aria-valuenow', '3');
      expect(progressbar).toHaveAttribute('aria-valuemax', '10');
    });

    it('has live region for question count', () => {
      render(<ProgressBar current={3} total={10} />);
      expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
    });
  });
});
