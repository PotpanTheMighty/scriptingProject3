# scriptingProject3
Project by: Oliver Anderson

This project runs on Github Pages at https://potpanthemighty.github.io/scriptingProject3/

The goal of my project was to cause an argument about an arbtirary topic between two LLMs.

The "New Argument" button at the top begins a new argument about a topic which the user is prompted for,
and the "Temperature" slider controls the temperature of the models when they generate the text. Generally,
a higher temperature will result in a more random, chaotic output.

Model 1 on the left is meta-llama/Llama-3.2-1B-Instruct, and Model 2 on the right is microsoft/Phi-3.5-mini-instruct.
Both models are accessed using the Huggingface.js API, and were chosen for their compatibility with the chatCompletion()
function from the API, as well as thier small size.

The file index.js in the root of the repo is a copy of one of the node_modules files. It had to be present
in the root directory in order to be imported properly by script.js at runtime due to the MIME type (“text/html”)
mismatch error thrown when attempting to import modules from different directories.

Otherwise, script.js, index.html, and style.css were all written by me.