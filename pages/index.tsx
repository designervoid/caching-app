import { ReactElement } from 'react';
import { Layout } from 'components/Layout';
import { Search } from 'components/Search'
import { PageWithLayout } from 'types/Layout';

import dynamic from "next/dynamic";

import type { DynamicWrapper as ComponentType } from "components/DynamicWrapper";

//the named export with then promise
const DynamicComponent = dynamic(
  import("components/Search").then((mod) => mod.Search),
  {
    ssr: false,
  }
) as typeof ComponentType;

const Home: PageWithLayout = () => {
  return (
    <>
      <DynamicComponent>
        <Search />
      </DynamicComponent>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default Home
