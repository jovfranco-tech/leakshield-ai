import { Task } from '../types/privacy';

export const demoTasks: Task[] = [
  { id: "t1", title: "Rotar contraseña de ConnectHub y activar 2FA", priority: "Critical", status: "Pending", bucket: "Today", module: "Breaches", ai: true, effort: "5 min" },
  { id: "t2", title: "Cambiar clave reutilizada en DevForum", priority: "Critical", status: "Pending", bucket: "Today", module: "Breaches", ai: true, effort: "3 min" },
  { id: "t3", title: "Habilitar verificación de dos factores (2FA) en correo principal", priority: "High", status: "Resolved", bucket: "Today", module: "Identity", ai: false, effort: "hecho" },
  { id: "t4", title: "Solicitar remoción en el broker comercial DataFind", priority: "High", status: "In Progress", bucket: "This Week", module: "Brokers", ai: true, effort: "auto" },
  { id: "t5", title: "Remover domicilio guardado de la cuenta de ShopMart", priority: "High", status: "Pending", bucket: "This Week", module: "Breaches", ai: true, effort: "4 min" },
  { id: "t6", title: "Configurar el perfil social @alexrivera como privado", priority: "Medium", status: "Pending", bucket: "This Week", module: "Footprint", ai: false, effort: "2 min" },
  { id: "t7", title: "Enviar solicitud de exclusión de datos a InfoAggregate", priority: "Medium", status: "Sent", bucket: "This Week", module: "Brokers", ai: true, effort: "enviado" },
  { id: "t8", title: "Depurar correo work.alias expuesto en repositorio público", priority: "Medium", status: "Pending", bucket: "Later", module: "Footprint", ai: false, effort: "10 min" },
  { id: "t9", title: "Mantener monitoreo pasivo en FitTrack (baja prioridad)", priority: "Low", status: "Monitor", bucket: "Later", module: "Breaches", ai: false, effort: "monitoreo" },
];
