import { PeopleOutline } from "@mui/icons-material";
import { Grid, Select } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AdminLayout } from "../../components/layouts";
import useSWR from "swr";
import { IUser } from "../../interfaces";
import MenuItem from "@mui/material/MenuItem";
import tesloApi from "../../api/tesloApi";
import { useEffect, useState } from "react";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (error) return <p>Error al cargar la información</p>;
  if (!data) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previusUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userId ? newRole : user.role,
    }));
    setUsers(updatedUsers);
    try {
      await tesloApi.put(`/admin/users`, { userId, role: newRole });
    } catch (error) {
      setUsers(previusUsers);
      console.log(error);
      alert("No se pudo actualizar el role del usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: (params: GridRenderCellParams<any, any, any>) => {
        const { row } = params;
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={({ target }) => onRoleUpdated(row.id, target.value)}
            sx={{ width: "300px" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">Super User</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title="Usuarios"
      subtitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};
export default UsersPage;
