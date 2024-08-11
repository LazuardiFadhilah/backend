const questionIdNotValid = async (form, answers) => {
  const found = answers.filter((answer) => {
    let qst = form.question.some((qst) => qst.id == answer.questionId);
    if (qst === false) {
      return true;
    }
  });

  return found.length > 0 ? found : false;
  //   return true;
};

export default questionIdNotValid;
