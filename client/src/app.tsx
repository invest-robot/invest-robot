import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import NotFound from './pages/NotFound/NotFound';
import HomePage from './pages/HomePage/HomePage';
import QuickStartPage from './pages/QuickStartPage/QuickStartPage';
import AgentGuidesPage from './pages/AgentGuidesPage/AgentGuidesPage';
import CasesPage from './pages/CasesPage/CasesPage';
import DevGuidePage from './pages/DevGuidePage/DevGuidePage';
import CompanyCasesPage from './pages/CompanyCasesPage/CompanyCasesPage';
import CaseDetailPage from './pages/CompanyCasesPage/CaseDetailPage';
import AdminPage from './pages/AdminPage/AdminPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="quick-start" element={<QuickStartPage />} />
        <Route path="agents" element={<AgentGuidesPage />} />
        <Route path="dev-guide" element={<DevGuidePage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="company-cases">
          <Route index element={<CompanyCasesPage />} />
          <Route path=":caseId" element={<CaseDetailPage />} />
        </Route>
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
