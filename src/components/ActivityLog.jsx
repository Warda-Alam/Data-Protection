export const StepProgress = ({ activeTab, steps = {} }) => {
    
    const getFilteredSteps = () => {
        
        if (activeTab === "signup") {
            return {
                step1: steps.step1, 
                step2: steps.step2  
            };
        } else if (activeTab === "encrypt") {
            return {
                step3: steps.step3, 
                step4: steps.step4 
            };
        }
        return steps;
    };

    const filteredSteps = getFilteredSteps();

    return (
        <div className="px-2 py-2 space-y-4">
            {Object.values(filteredSteps).map((step, index) => {
                return (
                    <div
                        key={step?.id || index}
                        className={`p-4 rounded-lg border-2 ${
                            step?.status === "completed"
                                ? "bg-green-50 border-green-200"
                                : step?.status === "active"
                                ? "bg-blue-50 border-blue-200"
                                : step?.status === "error"
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    step?.status === "completed"
                                        ? "bg-green-500 text-white"
                                        : step?.status === "active"
                                        ? "bg-blue-500 text-white"
                                        : step?.status === "error"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-300 text-gray-600"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h5 className="font-semibold text-gray-800">{step?.title || 'Loading...'}</h5>
                                <p className="text-sm text-gray-600">{step?.description || ''}</p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                    step?.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : step?.status === "active"
                                        ? "bg-blue-100 text-blue-800"
                                        : step?.status === "error"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {step?.status ? step.status.charAt(0).toUpperCase() + step.status.slice(1) : 'Pending'}
                            </span>
                        </div>

                        {/* Substeps */}
                        <div className="ml-11 space-y-2">
                            {step?.substeps?.map((substep, subIndex) => (
                                <div key={subIndex} className="flex items-center gap-2 text-sm">
                                    <div
                                        className={`p-2.5 rounded-full flex items-center justify-center ${
                                            step?.completedSubsteps?.includes(subIndex)
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                       <span className="absolute">{step?.completedSubsteps?.includes(subIndex) ? "✓" : ""}</span> 
                                    </div>
                                    <span
                                        className={
                                            step?.completedSubsteps?.includes(subIndex)
                                                ? "text-green-700"
                                                : "text-gray-500"
                                        }
                                    >
                                        {substep}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};