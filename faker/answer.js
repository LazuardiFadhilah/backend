import { faker } from "@faker-js/faker";
import answer from "../models/answer.js";

const run = async (limit) => {
  try {
    let data = [];

    for (let i = 0; i < limit; i++) {
      data.push({
        "6695453af4c34ad948467a6c": faker.helpers.arrayElement([
          "Semur",
          "Rendang",
          "Nasi Uduk",
          "Dendeng",
        ]),
        formId: "668c0de00a7d6039394c5aa7",
        userId: "668941877248169b994f56e4",
      });
    }
    const fakeData = await answer.insertMany(data);
    if (fakeData) {
      console.log(fakeData);
      process.exit();
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export { run };
