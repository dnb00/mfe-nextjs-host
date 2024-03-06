import { NextPageContext } from 'next';
import dynamic from 'next/dynamic';
const PersonPage = dynamic(() => import('remote/AboutPageOne'));

export const getServerSideProps = async (ctx: NextPageContext) => {
  const remote = await import('remote/AboutPageOne');

  if (remote.getServerSideProps) {
    const remoteProps = await remote.getServerSideProps(ctx);
    return {
      props: remoteProps.props,
    };
  }

  return { props: {} };
};

export default PersonPage;
