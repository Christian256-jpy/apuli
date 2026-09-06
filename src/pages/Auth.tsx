import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BarChart3, User, Briefcase } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().trim().min(2, { message: "Full name is required" }).max(100).optional(),
});

type AppRole = "manager" | "cashier";

const Auth = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);

    try {
      // Validate input
      const validationData = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      authSchema.parse(validationData);

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Check if user has the selected role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", selectedRole)
          .maybeSingle();

        if (roleError) throw roleError;

        if (!roleData) {
          await supabase.auth.signOut();
          toast.error(`You don't have ${selectedRole} access`);
          return;
        }

        toast.success("Signed in successfully!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName,
              role: selectedRole,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            throw error;
          }
          return;
        }

        toast.success("Account created! You can now sign in.");
        setIsLogin(true);
        setFormData({ email: "", password: "", fullName: "" });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-[var(--gradient-hero)] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">BIBIYANO</h1>
            <p className="text-muted-foreground text-lg">Select your role to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="p-8 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1 group"
              onClick={() => setSelectedRole("manager")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="rounded-xl p-4 bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Manager</h2>
                <p className="text-muted-foreground">
                  Full access to manage business operations, view reports, and manage team members
                </p>
              </div>
            </Card>

            <Card 
              className="p-8 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1 group"
              onClick={() => setSelectedRole("cashier")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="rounded-xl p-4 bg-success/10 mb-4 group-hover:scale-110 transition-transform">
                  <User className="h-12 w-12 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Cashier</h2>
                <p className="text-muted-foreground">
                  Record sales and purchases, print receipts, and manage daily transactions
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-muted-foreground">
            {selectedRole === "manager" ? "Manager" : "Cashier"} Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required={!isLogin}
                maxLength={100}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <Button
            variant="ghost"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ email: "", password: "", fullName: "" });
            }}
            className="w-full"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedRole(null);
              setFormData({ email: "", password: "", fullName: "" });
            }}
            className="w-full"
          >
            Change Role
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
