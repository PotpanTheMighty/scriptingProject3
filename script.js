import { HfInference } from './index.js'

const hf1 = new HfInference('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')
const hf2 = new HfInference('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')
const model1Name = "meta-llama/Llama-3.2-1B-Instruct";
const model2Name = "microsoft/Phi-3.5-mini-instruct";
const argumentLength = 3;
const messageLength = 256;
const approximateLineWdith = 90;

let topic = null;
let model1LastOut;
let model2LastOut;
let modelTemperature = 0.6;

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
    messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
       { role: "user", content: "Form a supporting argument about " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model1LastOut = cleanString(model1LastOut.choices[0].message.content);

  model2LastOut = await hf2.chatCompletion({
    model: model2Name,
    messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
      { role: "user", content: "Form a critical argument " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model2LastOut = cleanString(model2LastOut.choices[0].message.content);

  model1Text.innerText += "\n" + model1LastOut + getSpaceDifference(model1LastOut, model2LastOut);
  model2Text.innerText += "\n" + model2LastOut + getSpaceDifference(model2LastOut, model1LastOut);
}

async function continueArgument(argument)
{
  for(let i = 0; i < argumentLength; i++)
  {
    //Model 1 argues
    model1LastOut = await hf1.chatCompletion({
      model: model1Name,
      messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
        { role: "user", content: "Form a rebuttal against this argument: " + model2LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model1LastOut = cleanString(model1LastOut.choices[0].message.content);

    //Model 2 argues
    model2LastOut = await hf2.chatCompletion({
      model: model2Name,
      messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
        { role: "user", content: "Form a rebuttal against this argument: " + model1LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model2LastOut = cleanString(model2LastOut.choices[0].message.content);

    model1Text.innerText += "\n\n" + model1LastOut + getSpace(model2LastOut);
    model2Text.innerText += "\n\n" + getSpace(model1LastOut) + model2LastOut;
  };
}

function cleanString(inString)
{
  let stringPieces = inString.split("\n");
  let outString = stringPieces[0];
  for(let i = 1; i < stringPieces.length - 1; i++)
  {
    outString += stringPieces[i] + "\n";
  }
  return outString;
}

function getSpaceDifference(myLast, opponentLast)
{
  let lengthDifference = opponentLast.length - myLast.length;
  let returnSpace = "";
  for(let i = 0; i < lengthDifference/approximateLineWdith; i++)
  {
    returnSpace += "\n";
  }
  return returnSpace;
}

function getSpace(textBlock)
{
  let returnSpace = "";
  for(let i = 0; i < textBlock.length / approximateLineWdith; i++)
  {
    returnSpace += "\n";
  }
/*
  for(let i in textBlock.match("\n"))
  {
    returnSpace += "\n";
  }
  */
  return returnSpace;
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