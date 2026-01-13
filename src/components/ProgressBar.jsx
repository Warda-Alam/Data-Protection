import React from 'react';

const ProgressBar = ({ currentStep, totalSteps, stepTitle, stepDescription }) => {
  const progress = (currentStep / totalSteps) * 100;
  const stepTitles = [
    "Signup & Key Generation",
    "Login & Vault Unlock",
    "Data Encryption & Decryption",
    "Security Summary"
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-800/50 backdrop-blur-sm z-50 border-b border-purple-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-300">Step {currentStep} of {totalSteps}</span>
          <span className="text-xs text-slate-400">{stepTitles[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;