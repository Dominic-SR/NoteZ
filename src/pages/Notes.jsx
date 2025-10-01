import React, { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function Notes() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);  // dynamic width
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);  // dynamic height

  // Update the canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    setContext(ctx);
  }, []);

  const getCoordinates = (e) => {
    let x, y;
    if (e.touches) {
      const rect = e.target.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = (e) => {
    e.preventDefault();
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
        width={canvasWidth}  // Dynamic width
        height={canvasHeight}  // Dynamic height
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
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
