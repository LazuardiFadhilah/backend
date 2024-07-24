const optionValueNotExist = async (form, answers) => {
  const found = form.question.filter((qst) => {
    if (qst.type == "Radio" || qst.type == "Dropdown") {
      const answer = answers.find((answer) => answer.questionId == qst.id);

      if (answer) {
        const option = qst.options.find(
          (option) => option.value == answer.value
        );

        if (option === undefined) {
          return true;
        }
      }
    }
  });
  return found.length > 0 ? true : false;
};

export default optionValueNotExist;
