import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

export const LoadingScreen = ({ onFinish }) => {

  const { firstLoad, setFirstLoad } = useAppContext();
  const [text, setText] = useState("");
  const fullText = "Hello World ";
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => {
            onFinish(); // notify parent after fade finishes
          }, 700);
          return 100;
        }
        return prev + 1; // increase 1% every 30ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!firstLoad) return null;

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}>
        <div className="mt-20 "> {/* Adjust mt-20 to move it down from top */}
            <img src={assets.CS_Logo} alt="Logo" className="w-100 h-auto" />
        </div>
      {/* Progress bar container */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-[300px] h-[10px] bg-gray-300 rounded-full overflow-hidden ">
            <div
            className="h-full bg-black transition-all duration-75"
            style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>
    

      {/* Percentage text */}
      <p className="text-black font-mono text-lg">{progress}%</p>
    </div>
  );
};
