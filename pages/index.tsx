import { ReactElement } from 'react';
import { Layout } from 'components/Layout';
import { Search } from 'components/Search'
import { PageWithLayout } from 'types/Layout';

const Home: PageWithLayout = () => {
  return (
    <>
      <Search />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};


export default Home
