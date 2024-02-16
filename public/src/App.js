import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup";
import Chat from "./pages/chat";
import Login from "./pages/login";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Chat />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
