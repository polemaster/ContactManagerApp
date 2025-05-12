import { Link } from "react-router-dom";

type Props = {
  path: string;
  text: string;
};

const NavBarLink = (props: Props) => {
  return (
    <Link
      to={props.path}
      className="text-xl transition-colors duration-200 hover:bg-gray-300 flex items-center p-4"
    >
      {props.text}
    </Link>
  );
};

export default NavBarLink;
