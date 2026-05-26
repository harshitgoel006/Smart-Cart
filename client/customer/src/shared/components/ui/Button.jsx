const Button = ({
  children,
  className = "",

  variant = "primary",

  ...props
}) => {
  const variants = {
    primary: `
      bg-[var(--color-primary)]
      text-white
      hover:bg-[var(--color-primary-hover)]
    `,

    secondary: `
      bg-black
      text-white
      hover:opacity-90
    `,

    outline: `
      border
      border-[var(--color-border)]
      hover:bg-gray-100
    `,
  };

  return (
    <button
      className={`
        px-5
        py-3
        rounded-xl
        font-medium
        transition-all
        duration-300
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;