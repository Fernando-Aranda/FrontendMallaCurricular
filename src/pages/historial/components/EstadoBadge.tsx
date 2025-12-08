import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Props {
  estado: string;
}

export const EstadoBadge = ({ estado }: Props) => {
  if (estado === "APROBADO") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Aprobado
      </span>
    );
  } else if (estado === "REPROBADO") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
        <XCircle className="w-3.5 h-3.5" />
        Reprobado
      </span>
    );
  } else if (estado === "INSCRITO") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
        <Clock className="w-3.5 h-3.5" />
        Inscrito
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
        {estado}
      </span>
    );
  }
};