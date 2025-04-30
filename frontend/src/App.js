import React, { useState } from "react";
import axios from "axios";

function App() {
  const [modelName, setModelName] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadModel = async () => {
    if (!modelName) {
      setMessage("Please enter a model name.");
      return;
    }
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8000/load_model", {
        model_name: modelName,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error loading model: " + error.response?.data?.detail || error.message);
    }
  };

  const runQuery = async () => {
    if (!modelName || !query) {
      setMessage("Please enter both model name and query.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:8000/query", {
        model_name: modelName,
        query: query,
      });
      setAnswer(res.data.answer);
    } catch (error) {
      setMessage("Error querying model: " + error.response?.data?.detail || error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">ML Creator and Tools</h1>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Model Name (Hugging Face):</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. t5-small"
          />
          <button
            onClick={loadModel}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load Model
          </button>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Query:</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter your query here"
          />
          <button
            onClick={runQuery}
            disabled={loading}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Query"}
          </button>
        </div>
        {answer && (
          <div className="mb-4 p-4 bg-gray-100 rounded border border-gray-300">
            <h2 className="font-semibold mb-2">Answer:</h2>
            <p>{answer}</p>
          </div>
        )}
        {message && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
