/* eslint-disable */
import PropTypes from 'prop-types';
import { CheckCircleFilled } from '@ant-design/icons';

/**
 * A horizontal progress indicator with gradient styling.
 * 
 * Props:
 * - steps: array of step labels
 * - currentStep: zero-based index of the active step
 */
const ProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="mb-10 px-4">
      <div className="flex items-center">
        {steps.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const circleClass = isCompleted
            ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
            : isActive
            ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
            : 'bg-gray-200 text-gray-500';
          const lineClass = isCompleted
            ? 'flex-1 h-1 bg-gradient-to-r from-green-400 to-green-600'
            : isActive
            ? 'flex-1 h-1 bg-gradient-to-r from-blue-400 to-blue-600'
            : 'flex-1 h-1 bg-gray-200';

          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${circleClass}`}
                >
                  {isCompleted ? <CheckCircleFilled /> : idx + 1}
                </div>
                <p className={`mt-2 text-sm font-medium ${isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
              </div>
              {/* Don't render line after last item */}
              {idx < steps.length - 1 && <div className={`mx-2 ${lineClass}`}></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

ProgressIndicator.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
};

ProgressIndicator.defaultProps = {
  steps: ['Cart', 'Shipping', 'Payment', 'Confirmation'],
  currentStep: 1,
};

export default ProgressIndicator;
