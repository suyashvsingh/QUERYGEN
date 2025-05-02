import { encoding_for_model } from "tiktoken";

const countPromptTokens = (prompt: string) => {
  const model = process.env.MODEL || ("gpt-4o-mini" as any);
  const encoder = encoding_for_model(model);
  const tokens = encoder.encode(prompt);
  encoder.free();
  return tokens.length;
};

export default countPromptTokens;
