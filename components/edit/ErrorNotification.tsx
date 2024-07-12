import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

type Props = {
  message?: string;
  show: boolean;
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const ErrorBox = styled.div<
  { $show: boolean } & React.HTMLProps<HTMLDivElement>
>`
  background-color: red;
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  border-radius: var(--rounded);
  color: white;
  text-align: center;
  padding: 1rem;
  opacity: ${({$show}) => ($show ? "1" : "0")};
  animation: ${({$show}) => ($show ? fadeIn : fadeOut)} 1s;
`;

const ErrorNotification = ({ message, show }: Props) => {
  const { t: tr } = useTranslation("recipe");
  const [firstShown, setFirstShown] = useState(false);

  useEffect(() => {
    if (message && !firstShown) {
      setFirstShown(true);
    }
  }, [message, firstShown]);

  return (
    <ErrorBox $show={show} hidden={!firstShown}>
      {message ? message : ""}
    </ErrorBox>
  );
};

export default ErrorNotification;
