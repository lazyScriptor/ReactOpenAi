import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiwithText = () => {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAz6lyQmy_GCN9SBgQIyMP7fqXZiC47gT8"
  );

  const [search, setSearch] = useState("");
  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  //Generative AI part

  async function aiRun() {
    setLoading(true);
    setResponse("");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `top rated places with these tags ${search} .Give me multiple places in SRILANKA only .strictly in this format, \ city: \ location: in ascending order`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/\*/g, ""); // Remove asterisks

    // Split the response into individual place entries
    const places = text.split("- ").filter((place) => place.trim() !== "");

    // line break
    const formattedResponse = places.map((place) => (
      <React.Fragment key={place}>
        {place.trim()}
        <br />
      </React.Fragment>
    ));
    setResponse(formattedResponse);
    setLoading(false);
  }

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = () => {
    aiRun();
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <input
          placeholder="Search Food with Category using Generative AI"
          onChange={(e) => handleChangeSearch(e)}
        />
        <button style={{ marginLeft: "20px" }} onClick={() => handleClick()}>
          Search
        </button>
      </div>

      {loading == true && aiResponse == "" ? (
        <p style={{ margin: "30px 0" }}>Loading ...</p>
      ) : (
        <div style={{ margin: "30px 0" }}>{aiResponse}</div>
      )}
    </div>
  );
};

export default AiwithText;
