import React, { useState, useEffect } from "react";

const SeedPhraseFlow = ({ isActive }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animateWords, setAnimateWords] = useState(false);
  const totalSteps = 10;

  const seedWords = [
    "apple",
    "bridge",
    "castle",
    "dragon",
    "eagle",
    "forest",
    "garden",
    "harbor",
    "island",
    "jungle",
    "kingdom",
    "lantern",
    "mountain",
    "nature",
    "ocean",
    "palace",
  ];

  // Reset animation state when isActive changes
  useEffect(() => {
    if (isActive) {
      // First reset animation state
      setAnimateWords(false);
      
      // Force a reflow to reset CSS animations
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Trigger animation
          setAnimateWords(true);
        });
      });
    }
  }, [isActive]);

  // Reset step when isActive becomes true
  useEffect(() => {
    if (isActive) {
      setCurrentStep(1);
    }
  }, [isActive]);

  return (
    <>
      {currentStep === 1 && (
        <div className="step-content">
          <div className="bg-slate-900/50 rounded-xl p-2 border border-purple-500/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {seedWords.map((word, index) => (
                <div
                  key={index}
                  className={`bg-slate-700/50 rounded-lg px-1 py-2 text-center font-mono text-xs transition-all duration-500 ${
                    animateWords ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-full'
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    animation: animateWords ? `slideIn 0.5s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeedPhraseFlow;