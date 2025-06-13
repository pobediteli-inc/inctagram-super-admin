"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ApolloProvider } from "@apollo/client";
import { client } from "apollo/client";

type ReactChild = ReactNode;

export const StoreWrapper = ({ children }: { children: ReactChild }) => {
  return <Provider store={store}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
  </Provider>;
};
