import { HfInference } from './index.js'

const hf1 = new HfInference('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')
const hf2 = new HfInference('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')
const model1Name = "meta-llama/Llama-3.2-1B-Instruct";
const model2Name = "microsoft/Phi-3.5-mini-instruct";
const argumentLength = 3;
const messageLength = 128;

let topic = null;
let model1LastOut;
let model2LastOut;
let modelTemperature = 0.2;

const model1Text = document.getElementById("model1");
const model2Text = document.getElementById("model2");
const startButton = document.getElementById("startArgumentButton");
const tempSelector = document.getElementById("tempSelector");
const tempDisplay = document.getElementById("tempOutput");

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
  model1Text.innerText = "Model 1:\nProcessing positive stance...";
  model2Text.innerText = "Model 2:\nProcessing negative stance...";

  model1LastOut = await hf1.chatCompletion({
    model: model1Name,
    messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
       { role: "user", content: "Tell me why you like " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model1LastOut = model1LastOut.choices[0].message.content;

  model2LastOut = await hf2.chatCompletion({
    model: model2Name,
    messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
      { role: "user", content: "Tell me why you dislike " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model2LastOut = model2LastOut.choices[0].message.content;

  model1Text.innerText += "\n" + model1LastOut + "\n";
  model2Text.innerText += "\n" + model2LastOut + "\n";
}

async function continueArgument(argument)
{
  for(let i = 0; i < argumentLength; i++)
  {
    model1Text.innerText += "\nProcessing rebuttal...";

    //Model 1 argues
    model1LastOut = await hf1.chatCompletion({
      model: model1Name,
      messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
        { role: "user", content: "Tell me why you disagree with the ideas of this statement:" + model2LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model1LastOut = model1LastOut.choices[0].message.content;
    model1Text.innerText += "\n" + model1LastOut;

    //Model 2 argues
    model2Text.innerText += "\n\n\n\nProcessing rebuttal...";
    model2LastOut = await hf2.chatCompletion({
      model: model2Name,
      messages: [{role: "user", content: "Act as though you have strong opinions on " + argument},
        { role: "user", content: "Tell me why you disagree with the ideas of this statement:" + model1LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model2LastOut = model2LastOut.choices[0].message.content;
    model2Text.innerText += "\n" + model2LastOut;

    //Creates space to next model 1 message
    model1Text.innerText += "\n\n\n"
  };
}

async function runArgument()
{
  console.log("Running");
  setArgument();
  await startArgument(topic);
  await continueArgument(topic);
}

function buttonClicked()
{
  console.log("Button clicked");
  runArgument();
}

function sliderMoved()
{
  modelTemperature = tempSelector.value / 10;
  tempDisplay.innerText = "Temperature: " + modelTemperature;
}

startButton.addEventListener("click", buttonClicked);
tempSelector.addEventListener("input", sliderMoved);

runArgument();