import { Avatar, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts";
import { GetServerSideProps, NextPage } from "next";
import { IUser } from "../../interfaces";
import { getSession } from "next-auth/react";
import { validations } from "../../utils";

type IUserForProfile = Omit<IUser, "password" | "updatedAt" | "createdAt">;

interface Props {
  user: IUserForProfile;
}

const ProfilePage: NextPage<Props> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  const onSubmit = () => {};

  return (
    <ShopLayout
      title={"Perfil de usuario"}
      pageDescription={"Perfil de usuario"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center">
          <Grid container item xs={12} sm={6} justifyContent="center" gap={3}>
            <Avatar
              sx={{ width: 156, height: 156 }}
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
            />
            <TextField
              label="Nombre"
              variant="filled"
              inputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 1 }}
              {...register("name", {
                required: "Este campo es requerido",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              variant="filled"
              inputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 1 }}
              {...register("email", {
                required: "Este campo es requerido",
                validate: validations.isEmail,
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
        </Grid>
      </form>
    </ShopLayout>
  );
};
export default ProfilePage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let session: any = null;
  let user: IUser | null = null;

  try {
    session = await getSession({ req });
  } catch (error) {
    console.log(error);
  }

  user = session.user;

  if (!user) {
    return {
      redirect: {
        destination: `/auth/login?p=/profile`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
