import React, {Suspense, lazy} from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from "./componets/Allcode.js";
const Home = lazy(()=>import('./pages/Home.js'));
const Editor = lazy(()=>import('./pages/Editor.js'))
function App() {
return(
  <>
  <div>
    <Toaster position="top-center" toastOptions={
      {
        success:{
          iconTheme:{
            primary: '#4aed88',
          }
        }
      }
    }>

    </Toaster>
  </div>
  <BrowserRouter>
  <Suspense fallback={<h1>Wait While Loading.....</h1>}>
    <AppContextProvider>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/editor/:roomId" element={<Editor />}/>
    </Routes>
    </AppContextProvider>
    </Suspense>
  </BrowserRouter>
  </>
)
}
export default App;
