import axios from "axios"

// contexts
import { useStateContext } from "../contexts/GlobalContext"

const EditProfile = () => {
	const {
		userData: { access_token },
	} = useStateContext()
    
	return <div>EditProfile</div>
}

export default EditProfile
