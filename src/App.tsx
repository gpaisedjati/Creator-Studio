/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from './components/layout/AppLayout';
import { CreatorMode } from './pages/CreatorMode';

export default function App() {
  return (
    <AppLayout>
      <CreatorMode />
    </AppLayout>
  );
}
