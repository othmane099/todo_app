import { Helmet } from 'react-helmet-async';

import { ItemView } from '../sections/items/view';

// ----------------------------------------------------------------------

export default function ListsPage() {
  return (
    <>
      <Helmet>
        <title> Items | Minimal UI </title>
      </Helmet>

      <ItemView />
    </>
  );
}
