import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./contabilitate/components/Layout";
import Login from "./contabilitate/pages/auth/Login";
import Register from "./contabilitate/pages/auth/Register";
import Dashboard from "./contabilitate/pages/dashboard/Dashboard";
import DocumenteDeIesire from "./contabilitate/pages/documenteDeIesire/DocumenteDeIesire";
import DocumenteDeIntrare from "./contabilitate/pages/documenteDeIntrare/DocumenteDeIntrare";
import GestiuneClienti from "./contabilitate/pages/contracte/clienti/GestiuneClienti";
import GestiuneAngajati from "./contabilitate/pages/contracte/angajati/GestiuneAngajati";
import GestiuneProduse from "./contabilitate/pages/contracte/produse/GestiuneProduse";
import GestiuneConcedii from "./contabilitate/pages/contracte/concedii/GestiuneConcedii";
import GestiuneSabloane from "./contabilitate/pages/sabloane/GestiuneSabloane";
import Suport from "./contabilitate/pages/suport/Suport";
import DateFirma from "./contabilitate/pages/setari/DateFirma";
import SetariCont from "./contabilitate/pages/setari/SetariCont";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documente-iesire" element={<DocumenteDeIesire />} />
          <Route path="documente-intrare" element={<DocumenteDeIntrare />} />
          <Route path="clienti" element={<GestiuneClienti />} />
          <Route path="angajati" element={<GestiuneAngajati />} />
          <Route path="produse" element={<GestiuneProduse />} />
          <Route path="concedii" element={<GestiuneConcedii />} />
          <Route path="sabloane" element={<GestiuneSabloane />} />
          <Route path="suport" element={<Suport />} />
          <Route path="date-firma" element={<DateFirma />} />
          <Route path="setari-cont" element={<SetariCont />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
