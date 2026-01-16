import { useState } from "react";

function FeedbackForm({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!value.trim()) return;

    onAdd(value);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <input
        type="text"
        placeholder="Client feedback likhein..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 p-3 border rounded"
      />

      <button
        type="submit"
        className="bg-black text-green-400 px-5 rounded"
      >
        Add
      </button>
    </form>
  );
}

export default FeedbackForm;
