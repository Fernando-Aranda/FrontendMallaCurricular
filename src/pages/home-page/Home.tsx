import { useAuth } from "../../context/AuthContext";
import NavigationUcn from "../../components/NavigationUcn";
import HomeHeader from "./components/HomeHeader";
import CarrerasList from "./components/CarrerasList";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn />

      <main className="p-8 max-w-7xl mx-auto">
        <HomeHeader rut={user?.rut} />
        <CarrerasList carreras={user?.carreras || []} />
      </main>
    </div>
  );
};

export default Home;
