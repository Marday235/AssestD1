import {  Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "@/pages/AdminPage";
import PostulerPage from "@/pages/PostulerPage";
import { Toaster } from "@/components/dashboard/ui/toaster";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/postuler" element={<PostulerPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Toaster />
    </>
  );
}