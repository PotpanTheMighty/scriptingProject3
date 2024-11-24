import { HfInference } from './index.js'

const hf1 = new HfInference('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')
const hf2 = new HfInference('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')
const modelName = "meta-llama/Llama-3.2-1B-Instruct";
const argumentLength = 3;
const messageLength = 128;
const modelTemperature = 0.1;

let topic = null;
let model1LastOut;
let model2LastOut;

const model1Text = document.getElementById("thing1");
const model2Text = document.getElementById("thing2");
const startButton = document.getElementById("startButton");

//Prompts the user for a new argument topic
function setArgument()
{
  topic = null;
  do
  {
    topic = prompt("What should the AIs agrue about?", "Topic");
  } while(topic === null)
}

async function startArgument(argument)
{
  model1Text.innerText = "Processing...";
  model2Text.innerText = "Processing...";

  model1LastOut = await hf1.chatCompletion({
    model: modelName,
    messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
       { role: "user", content: "Tell me why you like " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model1LastOut = model1LastOut.choices[0].message.content;

  model2LastOut = await hf2.chatCompletion({
    model: modelName,
    messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
      { role: "user", content: "Tell me why you dislike " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model2LastOut = model2LastOut.choices[0].message.content;

  model1Text.innerText = model1LastOut;
  model2Text.innerText = model2LastOut;
}

async function continueArgument(argument)
{
  for(let i = 0; i < argumentLength; i++)
  {
    model1Text.innerText += "\nProcessing...";

    //Model 1 argues
    model1LastOut = await hf1.chatCompletion({
      model: modelName,
      messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
        { role: "user", content: "Tell me why you disagree with " + model2LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model1LastOut = model1LastOut.choices[0].message.content;
    model1Text.innerText += "\n" + model1LastOut;

    model2Text.innerText += "\nProcessing...";

    //Model 2 argues
    model2LastOut = await hf2.chatCompletion({
      model: modelName,
      messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
        { role: "user", content: "Tell me why you disagree with " + model1LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model2LastOut = model2LastOut.choices[0].message.content;
    model2Text.innerText += "\n" + model2LastOut;
  };
}

async function runArgument()
{
  console.log("Running");
  setArgument();
  await startArgument(topic);
  await continueArgument(topic);
}

startButton.addEventListener("click", runArgument);

runArgument();