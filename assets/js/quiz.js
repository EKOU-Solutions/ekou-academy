/* Lógica de quizzes conceptuales: independiente del DOM para poder probarla sin navegador. */
(function () {
  function sameAnswer(expected, actual) {
    if (Array.isArray(expected)) {
      if (!Array.isArray(actual) || expected.length !== actual.length) return false;
      return expected.every((value, i) => String(value) === String(actual[i]));
    }
    return expected != null && actual != null && String(expected) === String(actual);
  }

  function isCorrect(question, answer) {
    return sameAnswer(question && question.answer, answer);
  }

  function score(questions, answers) {
    return questions.reduce((total, question, i) =>
      total + (isCorrect(question, answers && answers[i]) ? 1 : 0), 0);
  }

  function requiredCorrect(total, threshold) {
    return Math.ceil(total * (threshold == null ? 1 : threshold));
  }

  function passed(questions, answers, threshold) {
    return score(questions, answers) >= requiredCorrect(questions.length, threshold);
  }

  window.Quiz = { isCorrect, score, requiredCorrect, passed };
})();
