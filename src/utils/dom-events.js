const KeyboardKey = {
  ESCAPE: `Escape`,
  ESCAPE_IE: `Esc`
};

const isEscapeEvent = (evt) => {
  return evt.key === KeyboardKey.ESCAPE
  || evt.key === KeyboardKey.ESCAPE_IE;
};

export {isEscapeEvent};
