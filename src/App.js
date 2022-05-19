import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";

import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../openai.config.js";

export default function App() {
  const [temperature, setTemperature] = useState(0);
  const [responses, setResponses] = useState([]);

  const [input, setInput] = useState("");

  useEffect(() => {}, [responses]);

  function handleSubmit(e) {
    e.preventDefault();

    let configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const userRes = {
      sender: "user",
      text: input,
    };

    openai
      .createCompletion("text-davinci-001", {
        prompt: input,
        temperature: temperature,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((res) => {
        let botRes = {
          sender: "bot",
          text: res.data.choices[0].text,
        };
        setResponses([...responses, userRes, botRes]);
      })
      .then(() => {
        setInput("");
      });
  }

  function handleClick(e) {
    e.preventDefault();
    axios
      .post("/curie", {
        prompt: input,
        engine_id: "text-curie-001",
        temp: temperature,
      })
      .then((data) => console.log(data))
      .then(setInput(""))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h1 className="text-white font-thin text-xl">
                        Shopify Technical Challenge
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Curie Bot</h1>
            <div className="m-6">
              <span>
                <h2>Temperature</h2>

                <input
                  type="range"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  min="0"
                  max="10"
                />
              </span>

              <p className="font-thin text-sm">
                Temperature: "Temperature is a value between 0 and 1 that
                essentially lets you control how confident the model should be
                when making these predictions. Lowering temperature means it
                will take fewer risks, and completions will be more accurate and
                deterministic. Increasing temperature will result in more
                diverse completions." -Openai.com
              </p>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="overflow-y-auto border-4 border-dashed border-gray-200 rounded-lg h-96">
                <ul>
                  {responses.map((n) => {
                    return n.sender === "bot" ? (
                      <li className="bg-neutral-200 text-black m-2 p-3 rounded">
                        {n.text}
                      </li>
                    ) : (
                      <li className="bg-blue-400 text-white text-right m-2 p-3 rounded">
                        {n.text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <textarea
                className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
                id="exampleFormControlTextarea1"
                rows="3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your message"
              ></textarea>
              <div className="flex space-x-2 justify-end">
                <button
                  type="submit"
                  className="mt-2 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
