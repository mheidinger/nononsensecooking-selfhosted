import Head from "next/head";

type Props = {
  title?: string;
};

const defaultTitle = "NoNonsenseCooking";

const PageTitle = ({ title }: Props) => (
  <Head>
    <title>{title ? title + " - " + defaultTitle : defaultTitle}</title>
  </Head>
);

export default PageTitle;
