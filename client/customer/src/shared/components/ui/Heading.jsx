const Heading = ({
  title,

  subtitle,

  align = "left",
}) => {
  return (
    <div
      className={`
        mb-10
        ${
          align === "center"
            ? "text-center"
            : "text-left"
        }
      `}
    >
      <h2
        className="
          text-3xl
          md:text-4xl
          font-bold
          text-[var(--color-text-primary)]
        "
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className="
            mt-3
            text-[var(--color-text-secondary)]
            max-w-2xl
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;