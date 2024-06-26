import { useSelector } from "react-redux";
import Menu from "../Menu";
import NotificationCenter from "../NotificationCenter";
import Navbar from "../Navbar";
import FullItemDetails from "../fullItemDetails";


function PrimaryLayout({ children }) {
    const menu=useSelector(state=>state.global.menu)
    const notificationCenter=useSelector(state=>state.global.notificationCenter)
    const assetDetails = useSelector(state => state.global.assetDetails)


    return (
      <>
        <Navbar />
        {menu&&<Menu />}
        <div className={`fixed top-10vh ${menu?'left-4/5':''} mt-1 rounded-md   ${menu?'w-4/5':'w-full'} h-90vh overflow-auto flex flex-col items-center `}>
          {children}
        </div>
        {notificationCenter
            &&
            <NotificationCenter/>    
        }
        {assetDetails
          &&
          <FullItemDetails/>    
        }
      </>
    );
  }

export default PrimaryLayout