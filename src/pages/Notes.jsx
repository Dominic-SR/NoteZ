import React, { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function Notes() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    context.closePath();
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setRecognizedText("");
  };

  const recognizeText = () => {
    const canvas = canvasRef.current;
    Tesseract.recognize(canvas, "eng")
      .then(({ data: { text } }) => {
        setRecognizedText(text);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold mb-4">✍️ Draw letters → Convert to Text</h1>

      <canvas
        ref={canvasRef}
        className="border bg-white rounded-md shadow"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={recognizeText}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Convert to Text
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Clear
        </button>
      </div>

      {recognizedText && (
        <p className="mt-4 p-2 bg-white shadow rounded">
          Recognized: <b>{recognizedText}</b>
        </p>
      )}
    </div>
  );
}
