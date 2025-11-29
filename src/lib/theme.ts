import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'neon',
  colors: {
    neon: [
      '#F0FFD6',
      '#E1FFAD',
      '#D2FF85',
      '#C3FF5C',
      '#B4FF33',
      '#98FF4C', // Основной неоновый акцент
      '#7ACC3D',
      '#5C992E',
      '#3D661F',
      '#1F3310',
    ],
    lavender: [
      '#F5F2FF',
      '#EBE5FF',
      '#E1D8FF',
      '#D7CBFF',
      '#CDBEFF',
      '#C3B7FF', // Лавандовый акцент
      '#9C92CC',
      '#756D99',
      '#4E4866',
      '#272433',
    ],
    peach: [
      '#FEF8F7',
      '#FDF1EF',
      '#FCEAE7',
      '#FBE3DF',
      '#FADCD7',
      '#F8CCC7', // Персиковый акцент
      '#C6A39F',
      '#947A77',
      '#63514F',
      '#312827',
    ],
    cream: [
      '#FFFDF5',
      '#FFFCEB',
      '#FFFBE1',
      '#FFFAD7',
      '#FFF9CD',
      '#FCEAAA', // Кремовый акцент
      '#C9BB88',
      '#968C66',
      '#645D44',
      '#322E22',
    ],
    darkGreen: [
      '#E6F0E9',
      '#CDE1D3',
      '#B4D2BD',
      '#9BC3A7',
      '#82B491',
      '#6A9F7B',
      '#5A8F6B',
      '#4A7F5B',
      '#3A6F4B',
      '#135C2E', // Темно-зеленый бренд
    ],
    midGreen: [
      '#F5F9E6',
      '#EBF3CD',
      '#E1EDB4',
      '#D7E79B',
      '#CDE182',
      '#C3DB69',
      '#A5C055',
      '#87A541',
      '#698A2D',
      '#B6D40D', // Средний зеленый бренд
    ],
    dark: [
      '#4A4A4A',
      '#424242',
      '#3A3A3A',
      '#323232',
      '#2A2A2A',
      '#222222',
      '#1A1A1A',
      '#191919', // Вторичный фон
      '#121212',
      '#0A0A0A',
    ],
    gray: [
      '#8A8A8A',
      '#7A7A7A',
      '#6A6A6A',
      '#5A5A5A',
      '#4A4A4A',
      '#464646', // Вторичный фон для секций
      '#3A3A3A',
      '#2E2E2E',
      '#222222',
      '#161616',
    ],
  },
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '600',
  },
  other: {
    mainBackground: '#2E284C',
    mainText: '#FAFAFA',
    accentText: '#98FF4C',
    subheadingText: '#C3B7FF',
  },
});

