import { useSelector } from "react-redux";
import Menu from "../Menu";
import NotificationCenter from "../NotificationCenter";
import Navbar from "../Navbar";

function PrimaryLayout({ children }) {

    const menu=useSelector(state=>state.global.menu)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)

    return (
      <>
        <Navbar />
        {menu&&<Menu />}
        <div className={`fixed top-16.4 ${menu?'left-4/5':''} mt-1 rounded-md border border-black border-2  ${menu?'w-4/5':'w-full'} h-screen overflow-auto flex flex-col items-center`}>
          {children}
        </div>
        {notificationCenter
            &&
            <NotificationCenter/>    
        }
      </>
    );
  }

export default PrimaryLayout