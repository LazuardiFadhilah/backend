const AnswerDuplicate = async (answers) => {
  var seen = new Set();
  const d = answers.some((answer) => {
    if (seen.has(answer.questionId)) {
      return true;
    }
    seen.add(answer.questionId);
  });
  return d;
};
export default AnswerDuplicate;
