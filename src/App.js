import logo from './logo.svg';
import './App.css';
import './components/Home/HomeMonitor/style.css'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './Pages/HomePage/HomePage';
import { PlayPage } from './Pages/PlayPage';
import { DuelsPage } from './Pages/DuelsPage';
import { DuelPage } from './Pages/DuelPage'
import { ContactPage } from './Pages/ContactPage';
import usePageTracking from "./usePackageTacking";

function App() {
  usePageTracking();
  return (
      <>
        <div>
          <Toaster
            position='bottom-center'
            toastOptions={{
              success: {
                duration: 5000,
                theme: {
                  primary: '#4aed88'
                },
              },
            }}
          >
          </Toaster>
        </div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/play' element={<PlayPage/>}/>
            <Route path='/duels' element={<DuelsPage/>}/>
            <Route path='/duel/:id' element={<DuelPage/>}/>
            <Route path='/contact' element={<ContactPage/>}/>
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
