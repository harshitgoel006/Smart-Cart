import { Link } from "react-router-dom";

const CategoryHero = ({ category, pathSegments }) => {
  if (!category) return null;

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-4 text-sm text-gray-500 flex flex-wrap gap-1">
          <Link to="/" className="hover:text-black">
            Home
          </Link>

          {pathSegments?.map((segment, index) => {
            const url = `/categories/${pathSegments
              .slice(0, index + 1)
              .join("/")}`;

            return (
              <span key={index}>
                {" > "}
                <Link
                  to={url}
                  className="capitalize hover:text-black"
                >
                  {segment}
                </Link>
              </span>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={category.image}
            alt={category.name}
            className="w-40 h-40 object-cover rounded-xl"
          />

          <div>
            <h1 className="text-5xl font-black capitalize">
              {category.name}
            </h1>

            <p className="mt-4 text-gray-600 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryHero;
