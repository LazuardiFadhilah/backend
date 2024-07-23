const questionRequiredButEmpty = async (form, answers) => {
  const found = form.question.filter((qst) => {
    if (qst.required === true) {
      const answer = answers.find((answer) => answer.questionId == qst.id);
      if (
        answer == undefined ||
        answer.value == undefined ||
        answer.value == ""
      ) {
        return true;
      }
    }
  });
  return found.length > 0 ? true : false;
};

export default questionRequiredButEmpty;
