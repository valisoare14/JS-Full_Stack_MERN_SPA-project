import Markets from "./components/Markets";
import {BrowserRouter, Routes , Navigate ,Route} from "react-router-dom"
import Account from "./components/Account";
import Login from "./components/Login";
import EmailVerification from "./components/EmailVerification";
import Register from "./components/Register";
import { useSelector } from "react-redux";
import News from "./components/News";
import { useCheckToken } from "./custom_hooks/useCheckToken";
import PrimaryLayout from "./components/layout/PrimaryLayout";
import Calendar from "./components/Calendar";
import Watchlist from "./components/Watchlist";
import Calculator from "./components/Calculator";
import Alerts from "./components/alerts/Alerts";
import MarketSentiment from "./components/MarketSentiment";
import Portfolio from "./components/portfolio/Portfolio";

function App() {
  const token = useSelector(state=>state.global.token)
  const loading=useSelector(state=>state.global.loading)

  useCheckToken()

  
  return (
      <BrowserRouter>
        <Routes>
          {!loading
            &&
            <>
              <Route path="/" element={<PrimaryLayout><Markets/></PrimaryLayout>}/>
              <Route path="/news" element={token?<PrimaryLayout><News/></PrimaryLayout>:<Navigate replace to="/login"/>}/>
              <Route path="/calendar" element={token ?<PrimaryLayout><Calendar /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/account" element={token ?<PrimaryLayout><Account /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/watchlist" element={token ?<PrimaryLayout><Watchlist /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/calculator" element={token ?<PrimaryLayout><Calculator /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/alerts" element={token ?<PrimaryLayout><Alerts /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/marketsentiment" element={token ?<PrimaryLayout><MarketSentiment /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path="/portfolio" element={token ?<PrimaryLayout><Portfolio /></PrimaryLayout> : <Navigate replace to="/login" />} />
              <Route path='/login' element={<Login/>}/>
              <Route path='/users/verify/:id/:token' element={<EmailVerification/>}/>
              <Route path="/register" element={<Register/>}/>
            </>
          }
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;

//atributul replace seteaza replace=true
//aceasta inseamna ca ruta "/account" va fii inlocuita in instoricul rutelor cu ruta de /login
//a.i. , atunci cand se apasa butonul de back al browser-ului , acesta sa fie redirectionat catre o ruta
//valida, nu catre ruta ce a deviat utilizatorul catre /login , adica /account
