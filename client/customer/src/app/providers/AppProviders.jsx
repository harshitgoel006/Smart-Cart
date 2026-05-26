import { Provider } from "react-redux";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import { store } from "@app/store/store";

const queryClient = new QueryClient();

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider
        client={queryClient}
      >
        {children}

        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProviders;