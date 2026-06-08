/* eslint-disable */

const ReusableInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3.5 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 outline-none focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 hover:bg-gray-100 transition-all"
          {...props}
        />
      </div>
    </div>
  );
};

export default ReusableInput;
