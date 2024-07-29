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
    } else if (qst.type == "Checkbox") {
      const answer = answers.find((answer) => answer.questionId == qst.id);

      if (answer) {
        return answer.value.some((value) => {
          const option = qst.options.find((option) => option.value == value);
          if (option == undefined) {
            return true;
          }
        });
      }
    }
  });
  return found.length > 0 ? found[0].question : false;
};

export default optionValueNotExist;
