import { NextUIProvider } from '@nextui-org/react';
import { AppPropsWithLayout } from 'types/Layout';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <NextUIProvider>
      {getLayout(<Component {...pageProps} />)}
    </NextUIProvider>
  );
}

export default MyApp;