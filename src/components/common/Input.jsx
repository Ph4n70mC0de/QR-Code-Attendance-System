import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with label and error display
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      required = false,
      disabled = false,
      className = '',
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-[#aa3bff] focus:border-[#aa3bff] dark:border-gray-600 dark:bg-gray-800';

    const classes = [baseStyles, stateStyles, className].filter(Boolean).join(' ');

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            htmlFor={props.id || props.name}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={`${classes} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
};

export default Input;