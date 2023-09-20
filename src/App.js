import "./App.css";
import Routers from "./Router";
import Header from "./components/Header";


function App() {
  return (
    <>
      <Header />
      <div className="container-main">
        <Routers />
      </div>
    </>
  );
}

export default App;