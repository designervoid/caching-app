import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type GetLayoutPlugin = {
    getLayout?: (page: ReactElement) => ReactNode;
  };

export type PageWithLayout = NextPage & GetLayoutPlugin;

export type NextPageWithLayout = NextPage & GetLayoutPlugin;

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};