import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SignIn from './sign-in/SignIn.tsx';
import LandingPage from './Pages/LandingPage.jsx';
import { BrowserRouter } from 'react-router';
import Routers from './Routes'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function App() {
  return (
   <BrowserRouter>
    <Routers/>
   </BrowserRouter>
  );
}
