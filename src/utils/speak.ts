const synth = window.speechSynthesis;

function speak(text: string, lang: string, repeatTimes = 1) {
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = lang;
  utterThis.onend = function (event) {};
  utterThis.onerror = function (event) {
    console.error('speak error');
  };
  utterThis.pitch = 1;
  utterThis.rate = 1;
  for (let i = 0; i < repeatTimes; i++) {
    synth.speak(utterThis);
  }
}

export { speak };
