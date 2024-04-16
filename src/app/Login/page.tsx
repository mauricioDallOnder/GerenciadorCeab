'use client'
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useSession, signOut, signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface LoginFormInputs {
  username: string;
  password: string;
}

type PageProps = {
  searchParams: { error?: string };
}

export default function LoginPage({ searchParams }: PageProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginFormInputs>();
  const { data: session } = useSession();
  const isUserLoggedIn = !!session;
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    if (isUserLoggedIn) {
      reset();
    }
  }, [isUserLoggedIn, reset]);

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
      callbackUrl: '/'
    });

    if (result?.error) {
      alert(result.error);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {searchParams.error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {searchParams.error}
            </Typography>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleLogin)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              autoFocus
              {...register("username", { required: "Username required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", { required: "Password required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!isUserLoggedIn && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Fazendo login, aguarde" : "Fazer Login"}
              </Button>
            )}
            {isUserLoggedIn && (
              <>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleLogout}
                >
                  Deslogar
                </Button>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Logado como: {session.user?.name}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
}
