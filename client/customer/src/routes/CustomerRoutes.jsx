import {
  Routes,
  Route,
} from "react-router-dom";

import CustomerLayout from "@layouts/customer/CustomerLayout";

import Container from "@shared/components/ui/Container";

import Section from "@shared/components/ui/Section";

import Heading from "@shared/components/ui/Heading";

import Button from "@shared/components/ui/Button";

const HomePage = () => {
  return (
    <Section>
      <Container>
        <Heading
          title="Smart Cart"
          subtitle="AI powered ecommerce experience"
        />

        <Button>
          Explore Now
        </Button>
      </Container>
    </Section>
  );
};

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route
        element={<CustomerLayout />}
      >
        <Route
          path="/"
          element={<HomePage />}
        />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;