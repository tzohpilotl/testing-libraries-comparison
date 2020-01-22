import React from "react";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";
import Component from "./Component";
import ApolloProvider from "./ApolloProvider";
import { MockedProvider } from "@apollo/react-testing";

describe("When using Enzyme's deep renderer", () => {
  describe(`When testing a component connected to the GraphQL provider via
  hooks`, () => {
    describe("When trying to render it without wrapping it in a provider", () => {
      const render = () => mount(<Component />);

      it("Fails because the hook needs a client in it's context", () => {
        // Also, this test pollutes stdout with an uncaught error; it does not
        // make the test fail though.
        expect(render).toThrow();
      });
    });

    describe("When wrapping it in a GraphQL provider", () => {
      let wrapper;

      beforeAll(async () => {
        await act(async () => {
          wrapper = mount(
            <ApolloProvider>
              <Component />
            </ApolloProvider>
          );
        });
      });

      it("Renders correctly", () => {
        expect(wrapper).toBeDefined();
      });

      it("Renders the full component tree", () => {
        expect(wrapper.find(Component)).toHaveLength(1);
      });

      it("Renders the component with the data", () => {
        expect(wrapper.find(Component).text()).toInclude(
          "minimumPaymentAmount"
        );
      });
    });

    describe("When wrapping it with a dedicated test provider", () => {
      let wrapper;

      beforeAll(async () => {
        await act(async () => {
          wrapper = mount(
            <MockedProvider>
              <Component />
            </MockedProvider>
          );
        });
      });

      it("Renders correctly", () => {
        expect(wrapper).toBeDefined();
      });

      it("Renders the component with a loading state", () => {
        expect(wrapper.find(Component).contains("Loading")).toBe(true);
      });
    });
  });
});
