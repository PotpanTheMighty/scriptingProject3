import { HfInference } from './index.js'

const hf = new HfInference('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')

let testies = async function(prompt)
{
    let out = await hf.textGeneration({
        model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
        inputs: prompt
      })
    return(out.generated_text);
}

let theThing = document.getElementById("thing");
theThing.innerText = "calculating";
theThing.innerText = await testies("my favourite horse is");
