import React, { setState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export const GET_LOAN_DETAILS = gql`
  query {
    loans {
      currentLoanBalance
      minimumPaymentAmount
      nextActualPaymentDate
      loanStatusCode
      originalLoanAmount
    }
  }
`;

const Component = () => {
  const { loading, error, data } = useQuery(GET_LOAN_DETAILS);

  if (loading) return <div>Loading</div>;
  if (error)
    return (
      <div>
        Error <span>{JSON.stringify(error)}</span>
      </div>
    );
  return (
    <div>
      {JSON.stringify(data)}
      <span>minimum payment: {data.loans[0].minimumPaymentAmount}</span>
    </div>
  );
};

export default Component;
