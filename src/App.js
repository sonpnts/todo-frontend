import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter, Route, Switch, Routes , Navigate, Link } from 'react-router-dom';
import ListTask from "./components/Task/ListTask";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<ListTask />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
