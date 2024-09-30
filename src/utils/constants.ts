export const jwtSecret = process.env.JWT_SECRET;
export const api_key = process.env.GOOGLE_GENAI_API_KEY;
export const prompt = `Act as a software engineer specialising in functional test case design. I will provide you with a use case, analyse it to determine a set of functional test cases based on this JSON schema, for as many test cases as you can find. In the explanation I require you to detail step by step, how you arrived at that proposal, how the keywords found serve you, why they are keywords and what other steps you execute internally in it to achieve the result:
{
  "testCases": [
    {
      "strId": "Unique identifier for the test case, typically in the format 'TC01', 'TC02', etc.",
      "strDescription": "A brief but clear description of the test case's objective, indicating which functionality or behavior is being verified.",
      "lstPreconditions": ["Preconditions that must be met before executing the test case, such as the system state or user role."],
      "lstSteps": ["Sequence of steps the user must follow to execute the test case. Each step should be clear and concise, explaining the specific interaction with the system."],
      "lstInputs": ["Input data required to perform the test case, such as form fields or parameter values provided by the user."],
      "strResult": "The expected result after executing the test case. It should describe the behavior or output the system should display if functioning correctly.",
      "lstCreationSecuence": {
        "Analyst": {
          "obtDescription": {
            "strAnalystText": "Analyzed description of the test case by the analyst, providing an interpretation or justification for the test case.",
            "lstKeyWords": "Keywords identified in the description that help define the critical elements of the test case.",
            "strExplication": "Detailed explanation of why these keywords are important and how they contribute to the creation of the test case."
          },
          "obtPreconditions": {
            "strAnalystText": "Text analyzed by the analyst regarding the preconditions, explaining their relevance in the test case context.",
            "lstKeyWords": "Keywords identified in the preconditions that define important constraints before running the test.",
            "strExplication": "Justification of how these preconditions impact the test and why they are essential."
          },
          "obtSteps": {
            "strAnalystText": "Analyst's interpretation of the steps the user must take to execute the test case.",
            "lstKeyWords": "Keywords in the steps that help identify key actions or interactions within the test.",
            "strExplication": "Explanation of the importance of these steps in the context of the test and how they relate to the system's functionality."
          },
          "obtInputs": {
            "strAnalystText": "Analysis of the input data provided in the test case, highlighting its relevance.",
            "lstKeyWords": "Keywords that indicate the most important input data for the test.",
            "strExplication": "Analyst's explanation of why this input data is crucial for test execution."
          },
          "obtResult": {
            "strAnalystText": "Analysis of the expected result of the test case as interpreted by the analyst.",
            "lstKeyWords": "Keywords that define the most critical expected behavior or outputs.",
            "strExplication": "Analyst's explanation of the importance of the expected result and its relevance in validating the tested functionality."
          }
        }
      }
    }
  ]
}
If what is sent is not a use case, it returns a short warning, in this JSON schema:
{
    "strResponse": ""
}
The response with which you fill in the parameters must be in Spanish, without changing the name of the attributes, limit your response to JSON, do not give more than necessary to be able to parse the response to a json after generation: Below, I send you the use case:
`;
