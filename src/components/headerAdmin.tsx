"use cleint";

import Image from "next/image";
import Logo from "../../public/image/pseLogo.png";



export default function HeaderAdminPage() {
    return(
        <header className="flex justify-between items-center bg-[#1D276C] shadow-md">
        <div className=" ml-[15px]  rounded-t-[10px]">
          <Image
            src={Logo}
            alt="PSE Logo"
            className="w-auto object-contain p-[10px]"
          />
        </div>
        
  
  
         
      </header>
    )

}