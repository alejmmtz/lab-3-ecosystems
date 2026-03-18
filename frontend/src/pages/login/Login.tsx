import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { AxiosError } from "axios";

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: string;
  storeName?: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("consumer");
  const [storeName, setStoreName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", { email, password });

        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: data.user.user_metadata.role,
            name: data.user.user_metadata.name,
          }),
        );

        navigate(`/${data.user.user_metadata.role}`);
      } else {
        const payload: RegisterPayload = { email, password, name, role };
        if (role === "store") {
          payload.storeName = storeName;
        }

        await api.post("/auth/register", payload);
        alert("¡Registro exitoso! Por favor, inicia sesión.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data?.message || "Ocurrió un error con el servidor.",
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 transition-all">
      <div className="w-150 border-2 border-blue bg-white p-8  transition-all">
        <div className="mb-8 text-center border-b-2 border-dashed border-blue pb-4">
          <h1 className="text-blue text-5xl mb-2">HomeTaste</h1>
          <h2 className="text-black text-2xl tracking-widest">
            {isLogin ? "Welcome Back" : "Join to HomeTaste"}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 transition-all"
        >
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-blue p-3 outline-none  text-black font-medium transition-colors"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border-2 border-blue p-3 outline-none  text-black font-medium cursor-pointer transition-colors"
              >
                <option value="consumer">Consumer</option>
                <option value="store">Store</option>
                <option value="delivery">Delivery</option>
              </select>

              {role === "store" && (
                <input
                  type="text"
                  placeholder="Store Name"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full border-2 border-blue p-3 outline-none  text-black font-medium transition-colors"
                />
              )}
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-blue p-3 outline-none  text-black font-medium transition-colors"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-blue p-3 outline-none  text-black font-medium transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-green border-2 border-blue text-blue font-bold py-3 px-4 uppercase text-lg hover:bg-blue hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center border-t-2 border-dashed border-blue pt-4">
          <p className="text-black font-medium">
            {isLogin ? "New to the the app?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="ml-2 text-blue font-bold uppercase hover:underline decoration-2 underline-offset-4 cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
