import styled from "styled-components";

export const InputRow = styled.div<{headingRow?: boolean} & React.HTMLProps<HTMLDivElement>>`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  margin-bottom: ${props => props.headingRow ? "-2rem" : "0"};
  width: 100%;
`;

export const InputLabel = styled.label<{indent?: boolean} & React.HTMLProps<HTMLLabelElement>>`
  font-size: 1.2rem;
  font-weight: 600;
  margin: auto 0;
  margin-left: ${props => props.indent ? "3rem" : "0"};
`;

export const Input = styled.input`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: ${props => props.width || "70%"};
  height: 3rem;
`;

export const Select = styled.select<{width?: string} & React.HTMLProps<HTMLSelectElement>>`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  color: var(--color-text-primary);
  width: ${props => props.width || "70%"};
  height: 3rem;
`;

export const GroupedInput = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 70%;
  min-width: 400px;
  align-items: center;
  cursor: ${props => props.draggable ? "grab" : "default" };
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
  margin-left: auto;
  margin-right: 0;
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
