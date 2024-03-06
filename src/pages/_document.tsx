import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import React from 'react';
import {
  revalidate,
  FlushedChunks,
  flushChunks,
} from '@module-federation/nextjs-mf/utils';
import { ServerStyleSheet } from 'styled-components';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    if (
      process.env.NODE_ENV === 'development' &&
      !(ctx.req?.url ?? '').includes('_next')
    ) {
      await revalidate().then((shouldReload) => {
        if (shouldReload) {
          ctx.res?.writeHead(302, { Location: ctx.req?.url });
          ctx.res?.end();
        }
      });
    } else {
      ctx?.res?.on('finish', () => {
        revalidate();
      });
    }

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = sheet.getStyleElement();
    const chunks = await flushChunks();

    return {
      ...initialProps,
      chunks,
      styles,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          {this.props.styles}
          {/*@ts-ignore*/}
          <FlushedChunks chunks={this.props.chunks} />
        </Head>

        <body className="bg-background-grey">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
