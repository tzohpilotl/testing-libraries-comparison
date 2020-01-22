import React from "react";
import { shallow } from "enzyme";
import Component from "./Component";
import ApolloProvider from "./ApolloProvider";

describe("When using Enzyme's shallow renderer", () => {
  describe(`When testing a component connected to the GraphQL provider via
  hooks`, () => {
    describe("When trying to render it without wrapping it in a provider", () => {
      const render = () => shallow(<Component />);

      it("Fails because the hook needs a client in it's context", () => {
        expect(render).toThrow();
      });
    });

    describe("When wrapping it in a GraphQL provider", () => {
      let wrapper;

      beforeAll(() => {
        wrapper = shallow(
          <ApolloProvider>
            <Component />
          </ApolloProvider>
        );
      });

      it("Renders correctly", () => {
        expect(wrapper).toBeDefined();
      });

      it("Only renders the provider", () => {
        expect(wrapper.find(Component)).toEqual({});
      });
    });
  });
});
