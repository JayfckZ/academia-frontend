'use client'

import { useState, useEffect, useCallback, ElementType } from 'react'
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
  InputAdornment,
  InputBaseComponentProps,
  Switch,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import RoleGuard from '@/app/components/dashboard/RoleGuard'
import Toast from '@/app/components/dashboard/Toast'
import { apiFetch } from '@/app/lib/api'
import { CurrencyInput } from '@/app/components/dashboard/Masks'

interface Plan {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  durationType: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS'
  active: boolean
}

export default function PlanosPage() {
  const [plans, setPlans] = useState<Plan[]>([])
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
    price: '',
    duration: '',
    durationType: 'MONTHS',
    description: ''
  })

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setToast({ open: true, message, severity })
    },
    []
  )

  const fetchPlansData = async () => {
    const res = await apiFetch('/plans')
    if (!res.ok) throw new Error()
    const data = await res.json()
    return Array.isArray(data) ? data : data.data || []
  }

  const loadPlans = useCallback(() => {
    fetchPlansData()
      .then(setPlans)
      .catch(() => showToast('Erro ao carregar planos', 'error'))
  }, [showToast])

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

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
    setFormData({
      name: '',
      price: '',
      duration: '',
      durationType: 'MONTHS',
      description: ''
    })
    setEditingId(null)
    setModalOpen(false)
  }

  const handleEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      durationType: plan.durationType,
      description: plan.description || ''
    })
    setEditingId(plan.id)
    setModalOpen(true)
  }

  const handleToggleStatus = async (plan: Plan) => {
    try {
      const res = await apiFetch(`/plans/${plan.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !plan.active })
      })

      if (!res.ok) throw new Error()

      showToast('Status atualizado com sucesso', 'success')
      loadPlans()
    } catch {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      }

      const url = editingId ? `/plans/${editingId}` : '/plans'
      const method = editingId ? 'PUT' : 'POST'

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json()
        showToast(err.message || 'Erro ao salvar plano', 'error')
        return
      }

      showToast(
        `Plano ${editingId ? 'atualizado' : 'criado'} com sucesso`,
        'success'
      )
      resetForm()
      loadPlans()
    } catch {
      showToast('Erro de conexão', 'error')
    }
  }

  const durationTypes = [
    { value: 'DAYS', label: 'Dias' },
    { value: 'WEEKS', label: 'Semanas' },
    { value: 'MONTHS', label: 'Meses' },
    { value: 'YEARS', label: 'Anos' }
  ]

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}
      fallback={
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Acesso negado. Seu cargo não permite visualizar planos.
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
          Gestão de Planos
        </Typography>

        <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
          >
            Novo Plano
          </Button>
        </RoleGuard>
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
                <TableCell>Preço</TableCell>
                <TableCell>Duração</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>R$ {plan.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {plan.duration} {plan.durationType}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={plan.active ? 'Ativo' : 'Inativo'}
                        color={plan.active ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
                        <Switch
                          checked={plan.active}
                          onChange={() => handleToggleStatus(plan)}
                          color="success"
                          size="small"
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(plan)}
                        >
                          <EditIcon />
                        </IconButton>
                      </RoleGuard>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={plans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>

      <Dialog open={modalOpen} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Plano' : 'Cadastrar Novo Plano'}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <TextField
              label="Nome do Plano"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Descrição (separada por vírgula)"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Preço"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                slotProps={{
                  input: {
                    inputComponent:
                      CurrencyInput as unknown as ElementType<InputBaseComponentProps>,
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    )
                  }
                }}
              />
              <TextField
                label="Duração"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                select
                label="Período"
                name="durationType"
                value={formData.durationType}
                onChange={handleInputChange}
                fullWidth
              >
                {durationTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={resetForm} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained">
            Salvar Plano
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
