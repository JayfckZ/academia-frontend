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
  IconButton,
  Chip,
  Tooltip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import RoleGuard from '@/app/components/dashboard/RoleGuard'
import Toast from '@/app/components/dashboard/Toast'
import { apiFetch } from '@/app/lib/api'

interface Plan {
  name: string
  price: number
}

interface Student {
  name: string
}

interface Enrollment {
  student: Student
  plan: Plan
}

interface Payment {
  id: string
  enrollmentId: string
  amount: number
  dueDate: string
  paidAt: string | null
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  enrollment: Enrollment
}

type ChipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

export default function PagamentosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [toast, setToast] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    paymentId: string
    action: 'PAID' | 'OVERDUE' | null
  }>({
    open: false,
    paymentId: '',
    action: null
  })

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setToast({ open: true, message, severity })
    },
    []
  )

  const fetchPaymentsData = async (currentPage: number, limit: number) => {
    const res = await apiFetch(
      `/payments?page=${currentPage + 1}&limit=${limit}`
    )
    if (!res.ok) throw new Error()
    return await res.json()
  }

  const loadPayments = useCallback(() => {
    fetchPaymentsData(page, rowsPerPage)
      .then((response) => {
        // O controller envia: { data, total, page, limit }
        setPayments(response.data || [])
        setTotalCount(response.total || 0)
      })
      .catch(() => showToast('Erro ao carregar pagamentos', 'error'))
  }, [page, rowsPerPage, showToast])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const openConfirmation = (paymentId: string, action: 'PAID' | 'OVERDUE') => {
    setConfirmModal({ open: true, paymentId, action })
  }

  const handleAction = async () => {
    const { paymentId, action } = confirmModal
    if (!paymentId || !action) return

    try {
      const endpoint = action === 'PAID' ? 'pay' : 'overdue'
      const res = await apiFetch(`/payments/${paymentId}/${endpoint}`, {
        method: 'PATCH'
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erro ao processar ação')
      }

      showToast(
        action === 'PAID'
          ? 'Pagamento baixado com sucesso!'
          : 'Marcado como atrasado',
        'success'
      )
      loadPayments()
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error')
      } else {
        showToast('Erro de conexão', 'error')
      }
    } finally {
      setConfirmModal({ open: false, paymentId: '', action: null })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case 'PAID':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'OVERDUE':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Pago'
      case 'PENDING':
        return 'Pendente'
      case 'OVERDUE':
        return 'Atrasado'
      default:
        return status
    }
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}
      fallback={
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Acesso negado. Seu cargo não permite acessar o financeiro.
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
          Gestão de Pagamentos
        </Typography>
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
                <TableCell>Aluno</TableCell>
                <TableCell>Plano</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Data Pgto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => {
                const isPaid = payment.status === 'PAID'

                return (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      {payment.enrollment?.student?.name || 'Aluno Excluído'}
                    </TableCell>
                    <TableCell>
                      {payment.enrollment?.plan?.name || '-'}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'var(--font-fira-code)',
                        fontWeight: 'bold'
                      }}
                    >
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'var(--font-fira-code)' }}>
                      {formatDate(payment.dueDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'var(--font-fira-code)',
                        color: isPaid ? 'success.main' : 'inherit'
                      }}
                    >
                      {formatDate(payment.paidAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(payment.status)}
                        color={getStatusColor(payment.status)}
                        size="small"
                        variant={isPaid ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <RoleGuard
                        allowedRoles={['ADMIN', 'MANAGER', 'RECEPTION']}
                      >
                        {!isPaid && (
                          <>
                            <Tooltip title="Dar baixa (Marcar como Pago)" arrow>
                              <IconButton
                                color="success"
                                onClick={() =>
                                  openConfirmation(payment.id, 'PAID')
                                }
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>

                            {payment.status !== 'OVERDUE' && (
                              <Tooltip title="Marcar como Atrasado" arrow>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    openConfirmation(payment.id, 'OVERDUE')
                                  }
                                >
                                  <ErrorOutlineOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </RoleGuard>
                    </TableCell>
                  </TableRow>
                )
              })}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    Nenhum registro financeiro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Paper>

      {/* Modal de Confirmação Único */}
      <Dialog
        open={confirmModal.open}
        onClose={() =>
          setConfirmModal({ open: false, paymentId: '', action: null })
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {confirmModal.action === 'PAID'
            ? 'Confirmar Recebimento'
            : 'Marcar Atraso'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmModal.action === 'PAID'
              ? 'Tem certeza que deseja dar baixa neste pagamento? Esta ação registrará a data de hoje como data de recebimento.'
              : 'Tem certeza que deseja marcar esta mensalidade como atrasada?'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setConfirmModal({ open: false, paymentId: '', action: null })
            }
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={confirmModal.action === 'PAID' ? 'success' : 'error'}
          >
            {confirmModal.action === 'PAID' ? 'Sim, dar baixa' : 'Sim, atrasar'}
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
