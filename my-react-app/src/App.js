import Markets from "./components/Markets";
import {BrowserRouter, Routes , Navigate ,Route} from "react-router-dom"
import Account from "./components/Account";
import Login from "./components/Login";
import EmailVerification from "./components/EmailVerification";
import Register from "./components/Register";
import { useDispatch, useSelector } from "react-redux";
import News from "./components/News";
import { useCheckToken } from "./custom_hooks/useCheckToken";
import PrimaryLayout from "./components/layout/PrimaryLayout";
import Calendar from "./components/Calendar";
import Watchlist from "./components/Watchlist";
import Calculator from "./components/Calculator";
import Alerts from "./components/alerts/Alerts";
import MarketSentiment from "./components/MarketSentiment";
import Portfolio from "./components/portfolio/Portfolio";
import { useCheckAdminToken } from "./custom_hooks/useCheckAdminToken";
import AdminHomepage from './components/admin/AdminHomepage'
import Analyses from "./components/Analyses";

function App() {
  const token = useSelector(state=>state.global.token)
  const adminToken = useSelector(state=>state.global.adminToken)
  const loading=useSelector(state=>state.global.loading)

  useCheckToken()
  useCheckAdminToken()
  
  return (
      <BrowserRouter>
        <Routes>
          {!loading
            &&
            <>
              <Route path="/" element={!adminToken ? <PrimaryLayout><Markets/></PrimaryLayout> : <Navigate replace to="/adminhomepage" />}/>
              <Route path="/news" element={token? !adminToken ? <PrimaryLayout><News/></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> :<Navigate replace to="/login"/>}/>
              <Route path="/calendar" element={token ? !adminToken ? <PrimaryLayout><Calendar /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/account" element={token ? !adminToken ? <PrimaryLayout><Account /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/watchlist" element={token ? !adminToken ? <PrimaryLayout><Watchlist /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/calculator" element={token ? !adminToken ? <PrimaryLayout><Calculator /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/alerts" element={token ? !adminToken ? <PrimaryLayout><Alerts /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/marketsentiment" element={token ? !adminToken ? <PrimaryLayout><MarketSentiment /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/portfolio" element={token ? !adminToken ? <PrimaryLayout><Portfolio /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/account" element={token ? !adminToken ? <PrimaryLayout><Account /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/analyses" element={token ? !adminToken ? <PrimaryLayout><Analyses /></PrimaryLayout> : <Navigate replace to="/adminhomepage" /> : <Navigate replace to="/login" />} />
              <Route path="/adminhomepage" element={adminToken ? <PrimaryLayout><AdminHomepage/></PrimaryLayout> : <Navigate replace to='/'/>} />
              <Route path='/login' element={!token ? <Login/> : <Navigate replace to="/" />}/>
              <Route path='/users/verify/:id/:token' element={<EmailVerification/>}/>
              <Route path="/register" element={!token ?<Register/> : <Navigate replace to="/" />}/>
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
