const emailNotValid = async (form, answers) => {
  const found = form.question.filter((qst) => {
    if (qst.type == "Email") {
      const answer = answers.find((answer) => answer.questionId == qst.id);

      if (qst.required === false) {
        if (
          answer === undefined ||
          answer.value === undefined ||
          answer.value === null ||
          answer.value === ""
        ) {
          return false;
        }
      }
      if (answer) {
        if (/[a-z0-9]+@[a-z}+.[a-z]{2,3}/.test(answer.value) === false) {
          return true;
        }
      }
    }
  });

  return found;
};

export default emailNotValid;
