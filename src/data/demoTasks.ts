import { Task } from '../types/privacy';

export const demoTasks: Task[] = [
  { id: "t1", title: "Rotate ConnectHub password & enable 2FA", priority: "Critical", status: "Pending", bucket: "Today", module: "Breaches", ai: true, effort: "5 min" },
  { id: "t2", title: "Change reused password on DevForum", priority: "Critical", status: "Pending", bucket: "Today", module: "Breaches", ai: true, effort: "3 min" },
  { id: "t3", title: "Enable 2FA on primary email", priority: "High", status: "Resolved", bucket: "Today", module: "Identity", ai: false, effort: "done" },
  { id: "t4", title: "Request removal from DataFind broker", priority: "High", status: "In Progress", bucket: "This Week", module: "Brokers", ai: true, effort: "auto" },
  { id: "t5", title: "Remove saved home address from ShopMart", priority: "High", status: "Pending", bucket: "This Week", module: "Breaches", ai: true, effort: "4 min" },
  { id: "t6", title: "Make @alexrivera profile private", priority: "Medium", status: "Pending", bucket: "This Week", module: "Footprint", ai: false, effort: "2 min" },
  { id: "t7", title: "Submit deletion request to InfoAggregate", priority: "Medium", status: "Sent", bucket: "This Week", module: "Brokers", ai: true, effort: "sent" },
  { id: "t8", title: "Scrub work.alias email from public repo", priority: "Medium", status: "Pending", bucket: "Later", module: "Footprint", ai: false, effort: "10 min" },
  { id: "t9", title: "Monitor FitTrack (low sensitivity)", priority: "Low", status: "Monitor", bucket: "Later", module: "Breaches", ai: false, effort: "ongoing" },
];
