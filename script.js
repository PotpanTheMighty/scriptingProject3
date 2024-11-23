import { HfInference } from './index.js'

const hf1 = new HfInference('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')
const hf2 = new HfInference('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')

let topic = null;
let model1LastOut;
let model2LastOut;

const model1Text = document.getElementById("thing1");
const model2Text = document.getElementById("thing2");

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
  model1LastOut = await hf1.textGeneration({
    model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    inputs: "I like " + argument + " because"
  });

  model2LastOut = await hf2.textGeneration({
    model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    inputs: "I don't like " + argument + " because"
  });

  model1Text.innerText = model1LastOut.generated_text;
  model2Text.innerText = model2LastOut.generated_text;
}

model1Text.innerText = "My";
model2Text.innerText = "Balls";

setArgument();
startArgument(topic);