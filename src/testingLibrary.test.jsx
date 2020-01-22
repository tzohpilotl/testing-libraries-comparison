import React from "react";
import { act } from "react-dom/test-utils";
import { render, prettyDOM, waitForElement } from "@testing-library/react";
import Component from "./Component";
import ApolloProvider from "./ApolloProvider";
import { MockedProvider } from "@apollo/react-testing";

describe("When using React Testing Library's renderer", () => {
  describe(`When testing a component connected to the GraphQL provider via
  hooks`, () => {
    describe("When trying to render it without wrapping it in a provider", () => {
      const wrappedRender = () => render(<Component />);

      it("Fails because the hook needs a client in it's context", () => {
        // Also, this test pollutes stdout with an uncaught error; it does not
        // make the test fail though.
        expect(wrappedRender).toThrow();
      });
    });

    describe("When wrapping it in a GraphQL provider", () => {
      let testingAPI;

      beforeAll(async () => {
        await act(async () => {
          testingAPI = render(
            <ApolloProvider>
              <Component />
            </ApolloProvider>
          );
        });
      });

      it("Renders the component with the data", async () => {
        const minimumPayment = waitForElement(
          () => testingAPI.getByText("minimumPayment"),
          { container: testingAPI.container }
        );
        expect(minimumPayment).toBeDefined();
      });
    });

    describe("When wrapping it with a dedicated test provider", () => {
      let testingAPI;

      beforeAll(async () => {
        await act(async () => {
          testingAPI = render(
            <MockedProvider>
              <Component />
            </MockedProvider>
          );
        });
      });

      it("Renders the component with the loading state", () => {
        const loading = waitForElement(() => testingAPI.getByText("Loading"), {
          container: testingAPI.container
        });

        expect(loading).toBeDefined();
      });
    });
  });
});
