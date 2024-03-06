import Header from '@/components/Header/Header';
import { DocumentContext } from 'next/dist/shared/lib/utils';
import dynamic from 'next/dynamic';

const AboutPage = dynamic(() => import('remote/AboutPage'), {
  ssr: true,
});

export default function Home({ remoteProps }: Readonly<{ remoteProps: any }>) {
  return (
    <>
      <Header />
      <AboutPage {...remoteProps} />
    </>
  );
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const remote = await import('remote/AboutPage');

  if (remote.getServerSideProps) {
    const remoteProps = await remote.getServerSideProps(ctx);
    return {
      props: {
        remoteProps: remoteProps.props,
      },
    };
  }

  return { props: {} };
};
