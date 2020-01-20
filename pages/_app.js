import App from 'next/app';
import React from 'react';
import withReduxStore from '../src/redux';
import { Provider } from 'react-redux';
import Head from 'next/head';

class YukiChat extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Provider store={reduxStore}>
        <Head>
          <title>Yuki</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default withReduxStore(YukiChat);
