import { useAuth } from "../../context/AuthContext";
import NavigationUcn from "../../components/NavigationUcn";
import HomeHeader from "./components/HomeHeader";
import CarrerasList from "./components/CarrerasList";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationUcn />

      {/* Contenedor principal con animación de entrada */}
      <main className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in-up">
        <div className="space-y-8">
          <HomeHeader rut={user?.rut} />
          <CarrerasList carreras={user?.carreras || []} />
        </div>
      </main>
    </div>
  );
};

export default Home;