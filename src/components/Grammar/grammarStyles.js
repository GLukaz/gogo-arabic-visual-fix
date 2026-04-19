import { COLORS, FONTS, pixelBtnGold, pixelBtnDark } from '../../styles/theme.js';

export const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: COLORS.beige,
  overflowY: 'auto',
};

export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  background: COLORS.brown,
  borderBottom: `4px solid ${COLORS.darkBrown}`,
};

export const titleStyle = {
  fontFamily: FONTS.pixel,
  fontSize: '16px',
  color: COLORS.xpGold,
  textAlign: 'center',
  flex: 1,
};

export const bodyStyle = {
  flex: 1,
  padding: '40px',
  maxWidth: '900px',
  margin: '0 auto',
  width: '100%',
};

export const sectionTitleStyle = {
  fontFamily: FONTS.pixel,
  fontSize: '14px',
  color: COLORS.brown,
  marginBottom: '20px',
};

export const arabicTextStyle = {
  fontFamily: FONTS.arabicDisplay,
  fontSize: '18px',
  color: COLORS.brown2,
  marginBottom: '10px',
};

export const textStyle = {
  fontFamily: FONTS.pixel,
  fontSize: '12px',
  lineHeight: '1.8',
  color: COLORS.dark,
  marginBottom: '20px',
};

export const exampleBoxStyle = {
  background: COLORS.white,
  border: `3px solid ${COLORS.brown}`,
  padding: '20px',
  marginBottom: '15px',
};

export const btnStyle = {
  ...pixelBtnGold,
  marginTop: '20px',
};

export const choiceStyle = {
  ...pixelBtnDark,
  margin: '10px',
  minWidth: '200px',
};

export const choiceCorrectStyle = {
  ...choiceStyle,
  background: COLORS.green,
  color: COLORS.white,
};

export const choiceWrongStyle = {
  ...choiceStyle,
  background: COLORS.red,
  color: COLORS.white,
};

export function getFeedbackStyle(feedbackMessage) {
  const isCorrect = feedbackMessage.includes('Correct');
  const color = isCorrect ? COLORS.green : COLORS.red;
  return {
    fontFamily: FONTS.pixel,
    fontSize: '14px',
    color,
    marginTop: '20px',
    padding: '15px',
    background: COLORS.white,
    border: `3px solid ${color}`,
  };
}

export { pixelBtnDark, pixelBtnGold, COLORS, FONTS };
