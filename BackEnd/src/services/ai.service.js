const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
You are an experienced software engineer acting as a code reviewer.

Your job is to:
- Review the provided code for correctness, readability, and maintainability.
- Point out any bugs, security issues, or potential improvements.
- Suggest best practices and improvements where appropriate.
- Be clear and concise in your feedback.
- If possible, provide improved code examples.

Keep your tone professional and constructive.
`
});


async function generateContent(prompt) {
    const result = await model.generateContent(prompt);

    console.log(result.response.text())

    return result.response.text();

}

module.exports = generateContent