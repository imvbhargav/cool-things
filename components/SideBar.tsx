import BrandLogo from "./BrandLogo";
import ListItem from "./ListItem";
import Login from "./Login";
import SideBarAuthButton from './SideBarAuthButton';
import Profile from "./Profile";

function SideBar({ active }: Readonly<{ active: string, cartCount?: number }>) {
  return (
    <>
      <Login />
      <Profile />
      <div className="absolute z-10 w-20 hover:w-80 bg-zinc-950 transition-all duration-300 rounded-l-xl py-5 h-[100dvh] overflow-hidden hidden sm:flex flex-col justify-between border-r-4 border-slate-800">
        <div>
        <BrandLogo />
        <ul className="list-none mt-16 mx-3">
          <ListItem
            icon={"/home.png"}
            title={"Home"}
            to={`${process.env.BASE_URL}`}
            active={active == 'home'}
          />
          <ListItem
            icon={"/cart.png"}
            title={"Cart"}
            to={"/cart"}
            active={active == 'cart'}
          />
          <ListItem
            icon={"/orders.png"}
            title={"Orders"}
            to={"/orders"}
            active={active == 'orders'}
          />
        </ul>
        </div>
        <div className="mx-4 ml-3">
          <SideBarAuthButton />
        </div>
      </div>
    </>
  );
}

export default SideBar;