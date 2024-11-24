import { HfInference } from './index.js'

//Hugging Face API access with tokens
const hf1 = new HfInference('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')
const hf2 = new HfInference('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')

//Constants to control behaviour of the program
const model1Name = "meta-llama/Llama-3.2-1B-Instruct";
const model2Name = "microsoft/Phi-3.5-mini-instruct";
const argumentLength = 3;
const messageLength = 200;
const approximateLineWdith = 90;

//Always-accessible variables
let topic = null;
let model1LastOut;
let model2LastOut;
let modelTemperature = 0.6;

//DOM node references
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

//Generates and displays the initial argument positions of the models
async function startArgument(argument)
{
  //Displays status messages
  model1Text.innerText = "Model 1:\nProcessing positive stance...";
  model2Text.innerText = "Model 2:\nProcessing negative stance...";

  //Generates the first model's supporting argument
  model1LastOut = await hf1.chatCompletion({
    model: model1Name,
    messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
       { role: "user", content: "Form a supporting argument about " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model1LastOut = cleanString(model1LastOut.choices[0].message.content);

  //Generates the second model's critical argument
  model2LastOut = await hf2.chatCompletion({
    model: model2Name,
    messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
      { role: "user", content: "Form a critical argument " + argument}],
    max_tokens: messageLength,
    temperature: modelTemperature
  });
  model2LastOut = cleanString(model2LastOut.choices[0].message.content);

  //Displays the generated text with dynamic spacing afterwards
  model1Text.innerText += "\n" + model1LastOut + getSpaceDifference(model1LastOut, model2LastOut);
  model2Text.innerText += "\n" + model2LastOut + getSpaceDifference(model2LastOut, model1LastOut);
}

//Generates and displays the rebuttals from the models
async function continueArgument(argument)
{
  //Displays status messages
  model1Text.innerText += "\n\nProcessing rebuttals...";
  model2Text.innerText += "\n\nProcessing rebuttals...";

  //Generates a pair of rebuttals for each argument length
  for(let i = 0; i < argumentLength; i++)
  {
    //Generates the rebuttal that the first model is arguing
    model1LastOut = await hf1.chatCompletion({
      model: model1Name,
      messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
        { role: "user", content: "Form a rebuttal against this argument: " + model2LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model1LastOut = cleanString(model1LastOut.choices[0].message.content);

    //Generates the rebuttal that the second model is arguing
    model2LastOut = await hf2.chatCompletion({
      model: model2Name,
      messages: [{role: "user", content: "Act as though you need to win an argument about " + argument},
        { role: "user", content: "Form a rebuttal against this argument: " + model1LastOut}],
      max_tokens: messageLength,
      temperature: modelTemperature
    });
    model2LastOut = cleanString(model2LastOut.choices[0].message.content);

    //Displays the generated text with dynamic spacing to stagger the rebuttals in order of generation
    model1Text.innerText += "\n" + model1LastOut + getSpace(model2LastOut);
    model2Text.innerText += "\n" + getSpace(model1LastOut) + model2LastOut;
  };
}

//Cleans up the text generated by the models by removing incomplete sentences from the end
function cleanString(inString)
{
  //Splits the text into sentences, then reconstructs it without the final sentence fragment
  let stringPieces = inString.split(".");
  let outString = stringPieces[0];
  for(let i = 1; i < stringPieces.length - 1; i++)
  {
    outString += stringPieces[i] + ".";
  }

  return outString;
}

//Returns a string of newline characters which evens out the difference in space two text blocks take up
function getSpaceDifference(myLast, opponentLast)
{
  //Determines the difference in the text lengths
  let lengthDifference = opponentLast.length - myLast.length;
  let returnSpace = "";

  //Adds a newline character to the return value for each excess line in the opponent's text
  for(let i = 0; i < lengthDifference/approximateLineWdith; i++)
  {
    returnSpace += "\n";
  }
  return returnSpace;
}

//Returns a string of newline characters which should take up the same amount of space as a given text block
function getSpace(textBlock)
{
  let returnSpace = "";

  //Adds a newline character to the return value for each approximate line of text in the text block
  for(let i = 0; i < textBlock.length / approximateLineWdith; i++)
  {
    returnSpace += "\n";
  }

  //Adds a newline character to the return value for each newline character in the text block
  for(let i in textBlock.match("\n"))
  {
    returnSpace += "\n";
  }
  
  return returnSpace;
}

//Runs an argument using the constant parameters and those specified by the user
async function runArgument()
{
  setArgument();
  await startArgument(topic);
  await continueArgument(topic);
}

//Event listener for the new argument button
function buttonClicked()
{
  //Starts a new argument
  runArgument();
}

//Event listener for the temperature slider
function sliderMoved()
{
  //Sets the model temperatures to the selected value and displays the current value
  modelTemperature = tempSelector.value / 10;
  tempDisplay.innerText = "Temperature: " + modelTemperature;
}

//Assigns the event listeners
startButton.addEventListener("click", buttonClicked);
tempSelector.addEventListener("input", sliderMoved);