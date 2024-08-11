import isEmailValid from "../libraries/isEmailValid.js";

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
        if (!isEmailValid(answer.value)) {
          return true;
        }
      }
    }
  });

  return found;
};

export default emailNotValid;
