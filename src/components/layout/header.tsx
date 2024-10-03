import { ROUTE } from "@/routes/routes";
import Link from "next/link";

function Header() {
  return ( 
    <div>
      <ul>
        <li><Link href={ROUTE.LOGIN}>Đăng nhập</Link></li>
        <li><Link href={ROUTE.SIGNUP}>Đăng ký</Link></li>
      </ul>
    </div>
   );
}

export default Header;