import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;