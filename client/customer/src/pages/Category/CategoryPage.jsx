
import CategoryLayout from "../../components/categories/CategoryLayout";

import { useLocation } from "react-router-dom";

const CategoryPage = () => {
  const location = useLocation();

  const pathSegments = location.pathname
    .replace("/categories/", "")
    .split("/");

  return <CategoryLayout pathSegments={pathSegments} />;
};


export default CategoryPage;
