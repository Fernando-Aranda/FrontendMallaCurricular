import LoginForm from "./components/LoginForm";
import LoginImagePanel from "./components/LoginImagePanel";

const Login = () => {
  return (
    <div className="w-full h-screen flex">
      {/* Panel izquierdo */}
      <LoginImagePanel />

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 h-full bg-white flex flex-col justify-center items-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
