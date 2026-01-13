import { useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Navigation = ({ currentStep, totalSteps, onNext, onPrev }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex gap-2">
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index + 1 === currentStep
                ? "bg-purple-500 scale-125"
                : "bg-slate-600"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium"
      >
        <span>{currentStep === totalSteps ? "Finish" : "Next"}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Navigation;
