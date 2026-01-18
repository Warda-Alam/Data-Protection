import React, { useState } from 'react';
import Step1 from '../components/Step1';
import Step2 from '../components/Step2';
import Step3 from '../components/Step3';
import '../index.css';
import Step4 from '../components/Step4';
import EncryptionFlowAnimation from '../components/ShareLink';

function DetailSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // const handleNext = () => {
  //   if (currentStep < totalSteps) {
  //     setCurrentStep(currentStep + 1);
  //   } else {
  //     alert('🎉 You now understand how zero-knowledge encryption protects your data!\n\nYour data is encrypted before it leaves your device, and only you hold the key.');
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1);
  //   }
  // };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EncryptionFlowAnimation />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* <ProgressBar 
        currentStep={currentStep}
        totalSteps={totalSteps}
      /> */}
      
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6 sm:p-8 lg:p-12 shadow-2xl">
            {renderStep()}
          </div>
          
          {/* <Navigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrev={handlePrev}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default DetailSteps;