function StepIndicator({ currentStep }) {

  const steps = [
    "Inspection",
    "AI Analysis",
    "Result"
  ];

  return (
    <div className="steps">

      {steps.map((step, index) => {

        const stepNumber = index + 1;

        return (
          <div
            className={`step ${
              currentStep >= stepNumber
                ? "active"
                : ""
            }`}
            key={step}
          >

            <div className="step-number">
              {stepNumber}
            </div>

            <span>
              {step}
            </span>

            {index < steps.length - 1 && (
              <div className="step-line" />
            )}

          </div>
        );

      })}

    </div>
  );
}

export default StepIndicator;