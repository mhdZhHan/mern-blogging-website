import { GlobalContext } from "./contexts/GlobalContext"
import Routes_ from "./routes/Routes"

const App = () => {
    return (
        <GlobalContext>
            <Routes_ />
        </GlobalContext>
    )
}

export default App
