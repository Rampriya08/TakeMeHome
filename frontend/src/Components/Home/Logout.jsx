import { Link } from "react-router-dom";
import useLogout from "../../hooks/logoutHooks";

const Logout = () => {

  const {loading,logout} = useLogout();
  return (
    <div className="mt-auto">
      {!loading ?(
                  <Link to='/signup' > <button className="w-full p-2 mt-4 text-white bg-red-600 rounded" 
        onClick={logout}>
        Logout
      </button> </Link>
       
      ):(
        <span className="loading loading-spinner" ></span>
      )}

    </div>
  )
}

export default Logout