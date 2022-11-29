import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-block;
  border: none;
  border-radius: 4px;
  background-color: ${({ inverted }) =>
    inverted ? `none` : `hsl(200, 98%, 40%)`};

  transition: 0.2s ease-out;
  font-size: 0.86rem;
  color: ${({ inverted }) => (inverted ? `hsl(200, 98%, 40%)` : `whitesmoke`)};
  border: 2px solid hsl(200, 98%, 40%);
  padding: 0.4rem 0.8rem;
  letter-spacing: 0.02rem;
  font-weight: 500;
  min-height: 1rem;
  min-width: 1rem;
  :hover {
    background-color: hsl(200, 98%, 45%);
    border: 2px solid hsl(200, 98%, 45%);
    color: whitesmoke;
    cursor: pointer;
  }
`;
export const App = () => {
  return (
    <>
      <StyledButton inverted>Sign Up</StyledButton>
      <StyledButton>Sign In</StyledButton>
    </>
  );
};
