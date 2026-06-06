'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Switch,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RoleGuard from '@/app/components/dashboard/RoleGuard'
import Toast from '@/app/components/dashboard/Toast'
import { apiFetch } from '@/app/lib/api'

interface Employee {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'RECEPTION' | 'TRAINER'
  active: boolean
  createdAt: string
}

const ROLES = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'RECEPTION', label: 'Recepção' },
  { value: 'TRAINER', label: 'Treinador' }
]

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RECEPTION'
  })

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setToast({ open: true, message, severity })
    },
    []
  )

  const fetchEmployeesData = async (currentPage: number, limit: number) => {
    const res = await apiFetch(
      `/employees?page=${currentPage + 1}&limit=${limit}`
    )
    if (!res.ok) throw new Error()
    return await res.json()
  }

  const loadEmployees = useCallback(() => {
    fetchEmployeesData(page, rowsPerPage)
      .then((data) => {
        let list = []
        let count = 0

        if (Array.isArray(data)) {
          if (Array.isArray(data[0])) {
            list = data[0]
            count = data[1] || 0
          } else {
            list = data
            count = data.length
          }
        } else {
          list = data.employees || data.data || []
          count = data.total || data.count || list.length
        }

        setEmployees(list)
        setTotalCount(count)
      })
      .catch(() => showToast('Erro ao carregar funcionários', 'error'))
  }, [page, rowsPerPage, showToast])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', role: 'RECEPTION' })
    setEditingId(null)
    setModalOpen(false)
  }

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      password: '', // Sempre iniciamos vazia por segurança
      role: employee.role
    })
    setEditingId(employee.id)
    setModalOpen(true)
  }

  const handleToggleStatus = async (employee: Employee) => {
    try {
      const res = await apiFetch(`/employees/${employee.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !employee.active })
      })

      if (!res.ok) throw new Error()

      showToast('Status atualizado com sucesso', 'success')
      loadEmployees()
    } catch {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/employees/${editingId}` : '/employees'
      const method = editingId ? 'PUT' : 'POST'

      const payload: {
        name: string
        email: string
        role: string
        password?: string
      } = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      }

      if (!editingId || formData.password.trim() !== '') {
        payload.password = formData.password
      }

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.message || 'Erro ao salvar funcionário', 'error')
        return
      }


      showToast(
        `Funcionário ${editingId ? 'atualizado' : 'cadastrado'} com sucesso`,
        'success'
      )
      resetForm()
      loadEmployees()
    } catch {
      showToast('Erro de conexão', 'error')
    }
  }

  const getRoleLabel = (role: string) => {
    return ROLES.find((r) => r.value === role)?.label || role
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'MANAGER']}
      fallback={
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Acesso negado. Apenas administradores e gerentes podem gerenciar a
            equipe.
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Gestão de Equipe
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Novo Funcionário
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid rgba(255, 255, 255, 0.05)',
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(employee.role)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.active ? 'Ativo' : 'Inativo'}
                      color={employee.active ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Switch
                      checked={employee.active}
                      onChange={() => handleToggleStatus(employee)}
                      color="success"
                      size="small"
                    />
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(employee)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>

      <Dialog open={modalOpen} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Funcionário' : 'Novo Funcionário'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <TextField
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Cargo"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
              >
                {ROLES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                helperText={editingId ? 'Deixe em branco para não alterar' : ''}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={resetForm} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar Funcionário
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </RoleGuard>
  )
}
