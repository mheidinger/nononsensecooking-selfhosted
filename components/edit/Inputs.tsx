import styled from "styled-components";

const COLUMN_MAX_WIDTH = "1300px";

export const InputRow = styled.div<{headingRow?: boolean} & React.HTMLProps<HTMLDivElement>>`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  margin-bottom: ${props => props.headingRow ? "-1rem" : "0"};
  gap: 5px;
`;

export const InputLabel = styled.label<{indent?: boolean, width?: string} & React.HTMLProps<HTMLLabelElement>>`
  font-size: 1.2rem;
  font-weight: 600;
  margin: auto 0;
  margin-left: ${props => props.indent ? "3rem" : "0"};
  ${props => props.width ? `width: ${props.width};` : ""}

  @media screen and (max-width: ${COLUMN_MAX_WIDTH}) {
    margin-left: ${props => props.indent ? "1rem" : "0"};
  }
`;

export const Input = styled.input<{grow?: number, width?: string} & React.HTMLProps<HTMLInputElement>>`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  height: 3rem;
  filter: ${props => props.disabled ? "brightness(150%)" : "brightness(100%)"};
  flex-grow: ${props => props.grow || 0};
  ${props => props.width ? `width: ${props.width};` : ""}
`;

export const Select = styled.select<{grow?: number, width?: string} & React.HTMLProps<HTMLSelectElement>>`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  color: var(--color-text-primary);
  height: 3rem;
  ${props => props.width ? `width: ${props.width};` : ""}
  flex-grow: ${props => props.grow || 0};

  & > option {
    background-color: var(--color-background-alt-solid);
    border-radius: var(--rounded);
  }

  @media (prefers-color-scheme: dark) {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  }
`;

export const GroupedInput = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  cursor: ${props => props.draggable ? "grab" : "default" };
  flex-grow: 1;
`

export const Button = styled.button`
  background: var(--color-primary);
  height: 2rem;
  appearance: none;
  cursor: pointer;
  border-radius: var(--rounded);
  outline: none;
  border: none;
  color: hsla(var(--palette-gray-00), 100%);
  font-size: 1rem;
  font-weight: 400;
`;

export const AddButton = styled(Button)`
	margin: auto 0 auto auto;
  padding: 0 1rem;
`;

export const RemoveButton = styled(Button)`
  height: 2.5rem;
  width: 2.5rem;
  background: #d94040;
`;

export const StepInput = styled.textarea`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: 100%;
`;

export const FileSelector = styled.span`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: 90%;
  height: 3rem;
  cursor: pointer;
`;
