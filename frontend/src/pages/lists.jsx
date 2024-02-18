import { Helmet } from 'react-helmet-async';

import { ListsView } from 'src/sections/lists/view';

// ----------------------------------------------------------------------

export default function ListsPage() {
  return (
    <>
      <Helmet>
        <title> List | Minimal UI </title>
      </Helmet>

      <ListsView />
    </>
  );
}
